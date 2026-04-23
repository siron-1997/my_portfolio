import type { Dispatch, RefObject, SetStateAction } from 'react';

import { gsap } from 'gsap';
import { Euler, type PerspectiveCamera, Quaternion, Vector3 } from 'three';

import { IS_DEV } from '@/constants/common';
import { computeArcPosition } from '@/utils/world/work/cameraArc';
import {
  type CameraParams,
  type ControlCameraConfigs,
  type Position,
  type Rotation,
  type ViewOffset,
  type WorkWorldSectionsCameraParams,
} from '@/types/world';

/** 弧状補間の横バイアス強度（0=直線, 1=デフォルト） */
const ARC_BIAS = 0.3;

/** セクション種別に応じた「開始・終了位置」情報 */
type GetSectionAnimationParamsReturn = {
  /** 開始位置 */
  startPoint: string;

  /** 終了位置 */
  endPoint: string;

  /** セクション名 */
  sectionName: string;
};

/**
 * Three.js の `PerspectiveCamera.view` オブジェクトに対応する型。
 * `ViewOffset` の `x`/`y` は `setViewOffset` 引数用だが、
 * `camera.view` の内部フィールドは `offsetX`/`offsetY` であるため別型として定義する。
 */
/** CameraViewState の型定義 */
type CameraViewState = {
  /** enabled */
  enabled?: boolean;
  /** fullWidth */
  fullWidth?: number;
  /** fullHeight */
  fullHeight?: number;
  /** offsetX */
  offsetX?: number;
  /** offsetY */
  offsetY?: number;
  /** width */
  width?: number;
  /** height */
  height?: number;
} | null;

type CreateSectionAnimationProps = {
  /** 対象のセクション要素 */
  element: HTMLElement;

  /** 開始時のカメラ位置 */
  startPosition: Position;

  /** 開始時のカメラ回転 */
  startRotation: Rotation;

  /** 開始時の viewOffset */
  startViewOffset: ViewOffset;

  /** 目標のカメラ位置 */
  targetPosition?: Position;

  /** 目標のカメラ回転 */
  targetRotation?: Rotation;

  /** 目標の viewOffset */
  targetViewOffset?: ViewOffset;

  /** コントロール開始フラグを更新するコールバック */
  updateStartControls?: Dispatch<SetStateAction<boolean>>;

  /** ナビゲーション表示状態を更新する関数 */
  setIsNavigationVisible?: Dispatch<SetStateAction<boolean>>;

  /** ウィンドウ幅 */
  width?: number;

  /** ウィンドウ高さ */
  height?: number;

  /** カメラ */
  camera: PerspectiveCamera;
};

type SectionsAnimationProps = {
  /** portal セクションの要素 */
  portal: HTMLElement;

  /** introduction セクションの要素 */
  introduction: HTMLElement;

  /** controls セクションの要素 */
  controls: HTMLElement;

  /** カメラ */
  camera: PerspectiveCamera;

  /** コントロール開始フラグを更新するコールバック */
  updateStartControls: (
    valueOrUpdater: boolean | ((prev: boolean) => boolean),
  ) => void;

  /** ナビゲーションの表示フラグの状態を更新する関数 */
  setIsNavigationVisible: Dispatch<SetStateAction<boolean>>;

  /** ブレークポイントに応じた、各セクションのカメラパラメータ */
  cameraParams: WorkWorldSectionsCameraParams;
};

type ViewerToggleAnimationProps = {
  /** introduction セクションの要素 */
  introduction: HTMLElement;

  /** トグルボタンの要素 */
  toggleButton: HTMLElement;

  /** カメラの参照 Ref */
  cameraRef: RefObject<PerspectiveCamera | null>;

  /** カメラの基本パラメータ */
  cameraParams: CameraParams;

  /** ズーム */
  zoom: number;

  /** オフセット */
  offset: number;
};

type controlsAnimationProps = {
  /** 前回のカメラ位置の参照 Ref */
  previousPosition: Position;

  /** 前回のカメラ回転の参照 Ref */
  previousRotation: Rotation;

  /** カメラの参照 Ref */
  cameraRef: RefObject<PerspectiveCamera | null>;

  /** 現在選択中のコントロールインデックス */
  currentIndex: number;

  /** 初期コントロール状態フラグ（Controls セクションに入る前の初期状態） */
  isInitialControl: boolean;

  /** コントロール開始フラグ（Controls セクションに到達したとき true になる） */
  isStartControls: boolean;

  /** 生成されたコントロール用のカメラパラメータ */
  cameraConfigs: ControlCameraConfigs;

  /** ウィンドウ幅 */
  width: number;

  /** ウィンドウ高さ */
  height: number;

  /** シーンの中心座標 */
  sceneCenter: Vector3;

  /** シーンの包容球半径 */
  bboxRadius: number;
};

/** セクション種別に応じた「開始・終了位置」情報を取得する処理 */
const getSectionAnimationParams = (
  elementId: string,
): GetSectionAnimationParamsReturn => {
  switch (elementId) {
    case 'model-viewer':
      return {
        startPoint: 'top top',
        endPoint: '85% top',
        sectionName: 'Model Viewer',
      };
    case 'introduction':
      return {
        startPoint: '0% top',
        endPoint: '90% top',
        sectionName: 'Introduction',
      };
    case 'controls':
      return {
        startPoint: '0% top',
        endPoint: '100% top',
        sectionName: 'Controls',
      };
    default:
      return {
        startPoint: '',
        endPoint: '',
        sectionName: '',
      };
  }
};

/**
 * 各セクション・アニメーションタイプごとの逆再生完了時の処理。
 *
 * @param type - 逆再生処理の種別
 * @param element - 対象セクション要素
 * @param camera - 操作対象のカメラ
 * @param startPosition - 開始時のカメラ位置
 * @param startRotation - 開始時のカメラ回転
 * @param startViewOffset - 開始時の viewOffset
 * @param initialState - 逆再生前に保持したカメラ状態
 * @param setIsStartControls - controls の開始状態を更新する関数
 * @param setIsNavigationVisible - ナビゲーション表示状態を更新する関数
 * @returns {void} 戻り値は返さない
 
 *
 * @example
 * handleReverseComplete(type, element, camera, startPosition, startRotation, startViewOffset, initialState, setIsStartControls, setIsNavigationVisible);
 */
const handleReverseComplete = (
  type: string,
  element: HTMLElement,
  camera: PerspectiveCamera,
  startPosition: Position,
  startRotation: Rotation,
  startViewOffset: {
    fullWidth: number;
    fullHeight: number;
    x: number;
    y: number;
    width: number;
    height: number;
  },
  initialState: {
    position: Position;
    rotation: Rotation;
    viewOffset: CameraViewState;
  },
  setIsStartControls: Dispatch<SetStateAction<boolean>>,
  setIsNavigationVisible: Dispatch<SetStateAction<boolean>>,
) => {
  const animation = gsap.timeline({ paused: true });

  /** カメラ位置またはコントロールセクション以外の場合はスキップ */
  if (type !== 'position' || element.id !== 'controls') {
    return;
  }

  /** Controls セクションを抜けた状態に更新 */
  setIsStartControls(false);

  /** ナビゲーションを非表示に更新 */
  setIsNavigationVisible(false);

  const html = document.documentElement;
  const body = document.body;

  /** コントロールセクション要素の絶対位置を取得 */
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const elementTop = rect.top + scrollTop;

  /** スクロール位置を強制的に固定する処理 */
  const forceScroll = (): void => {
    /** スクロール位置が目標位置と異なる場合に強制的にスクロールを戻す */
    if (window.scrollY !== elementTop) {
      window.scrollTo(0, elementTop);
    }
  };

  /**
   * スクロール操作を無効化する処理
   *
   * @param e - スクロール関連イベント
   */
  const disableScroll = (e: Event): void => e.preventDefault();

  /** 即座に位置を戻す */
  forceScroll();

  /** スクロールを無効化 */
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';

  /** 慣性スクロールや追加入力を防ぐためにイベントを無効化 */
  window.addEventListener('wheel', disableScroll, { passive: false });
  window.addEventListener('touchmove', disableScroll, { passive: false });

  /** アニメーション中は毎フレーム強制的に位置を補正し続ける */
  gsap.ticker.add(forceScroll);

  /** 他の ScrollTrigger による干渉を防ぐためにカメラ更新をロックする */
  camera.userData.isLocked = true;

  /** カメラ位置を「スクロールされる前の位置（initialState）」に強制的に戻す */
  /** 行き過ぎたスクロールによるズレを解消し、ユーザーが操作していた位置からアニメーションを開始する */
  if (initialState) {
    camera.position.set(
      initialState.position.x,
      initialState.position.y,
      initialState.position.z,
    );
    camera.rotation.set(
      initialState.rotation.x,
      initialState.rotation.y,
      initialState.rotation.z,
    );
    const vo = initialState.viewOffset;
    if (vo?.enabled) {
      camera.setViewOffset(
        vo.fullWidth ?? 0,
        vo.fullHeight ?? 0,
        vo.offsetX ?? 0,
        vo.offsetY ?? 0,
        vo.width ?? 0,
        vo.height ?? 0,
      );
    }
    camera.updateProjectionMatrix();
  }

  /** アニメーションの始点として使用 */
  const initialCameraState: {
    position: Position;
    rotation: Rotation;
    viewOffset: CameraViewState;
  } = initialState
    ? {
        position: initialState.position,
        rotation: initialState.rotation,
        viewOffset: initialState.viewOffset,
      }
    : {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
        viewOffset: camera.view ? { ...camera.view } : null,
      };

  const onStart = () => {
    if (IS_DEV) console.log('アニメーション再生開始');
    forceScroll();
  };

  const onComplete = () => {
    if (IS_DEV) console.log('アニメーション再生終了');

    /** スクロール制御の解除 */
    html.style.overflow = '';
    body.style.overflow = '';

    /** ロック解除 */
    window.removeEventListener('wheel', disableScroll);
    window.removeEventListener('touchmove', disableScroll);

    /** 強制スクロール補正の解除 */
    gsap.ticker.remove(forceScroll);

    /** カメラ更新ロックを解除 */
    camera.userData.isLocked = false;

    /** アニメーションの破棄 */
    animation.kill();
  };

  const interpolator = { value: 0 };

  animation.to(
    interpolator,
    {
      value: 1,
      duration: 2,
      ease: 'power2.inOut',
      onStart: onStart,
      onUpdate: () => {
        /** カメラ位置の補間 */
        camera.position.set(
          gsap.utils.interpolate(
            initialCameraState.position.x,
            startPosition.x,
            interpolator.value,
          ),
          gsap.utils.interpolate(
            initialCameraState.position.y,
            startPosition.y,
            interpolator.value,
          ),
          gsap.utils.interpolate(
            initialCameraState.position.z,
            startPosition.z,
            interpolator.value,
          ),
        );

        /** カメラの回転の補間 */
        camera.rotation.set(
          gsap.utils.interpolate(
            initialCameraState.rotation.x,
            startRotation.x,
            interpolator.value,
          ),
          gsap.utils.interpolate(
            initialCameraState.rotation.y,
            startRotation.y,
            interpolator.value,
          ),
          gsap.utils.interpolate(
            initialCameraState.rotation.z,
            startRotation.z,
            interpolator.value,
          ),
        );

        /** カメラの viewOffset の補間 */
        const vo = initialCameraState.viewOffset;
        const currentX = gsap.utils.interpolate(
          vo?.offsetX ?? 0,
          startViewOffset.x,
          interpolator.value,
        );
        const currentY = gsap.utils.interpolate(
          vo?.offsetY ?? 0,
          startViewOffset.y,
          interpolator.value,
        );
        const currentWidth = gsap.utils.interpolate(
          vo?.width ?? 0,
          startViewOffset.width,
          interpolator.value,
        );
        const currentHeight = gsap.utils.interpolate(
          vo?.height ?? 0,
          startViewOffset.height,
          interpolator.value,
        );

        camera.setViewOffset(
          startViewOffset.fullWidth,
          startViewOffset.fullHeight,
          currentX,
          currentY,
          currentWidth,
          currentHeight,
        );

        camera.updateProjectionMatrix();
      },
      onComplete: onComplete,
    },
    0,
  );

  animation.play();
};

/**
 * セクション用アニメーション作成
 * ページの一番下から開始した際に portal から introduction 間で空間に何も映らない課題への対応ロジックを含む。
 *
 * @param props - セクションアニメーション生成に必要なパラメータ
 * @returns {gsap.Context} 生成した GSAP コンテキスト
 *
 * @example
 * createSectionAnimation({});
 */
const createSectionAnimation = ({
  element,
  startPosition,
  targetPosition,
  startRotation,
  targetRotation,
  startViewOffset,
  targetViewOffset,
  updateStartControls,
  setIsNavigationVisible,
  camera,
}: CreateSectionAnimationProps): gsap.Context => {
  return gsap.context(() => {
    /** セクション種別に応じた開始・終了位置情報を取得 */
    const { startPoint, endPoint, sectionName } = getSectionAnimationParams(
      element.id,
    );

    /** カメラの状態を追跡 */
    const lastCameraState: {
      position: Vector3;
      rotation: Euler;
      viewOffset: CameraViewState;
    } = {
      position: camera.position.clone(),
      rotation: camera.rotation.clone(),
      viewOffset: camera.view ? { ...camera.view } : null,
    };

    /** 各セクション・アニメーションタイプの開始前の処理 */
    const handleStart = (): void => {
      /** Controls セクション以外はスキップ */
      if (element.id !== 'controls') {
        return;
      }

      /** Controls セクションに入った状態に更新 */
      updateStartControls && updateStartControls(true);

      /** ナビゲーションの表示を有効化 */
      setIsNavigationVisible && setIsNavigationVisible(true);

      /** カメラ位置の追跡を開始 */
      gsap.ticker.add(() => {
        lastCameraState.position.copy(camera.position);
        lastCameraState.rotation.copy(camera.rotation);
        lastCameraState.viewOffset = camera.view ? { ...camera.view } : null;
      });
    };

    /** セクションを逆方向に離脱した時の処理*/
    const onLeaveBackCallback = (): void => {
      /** Controls セクション以外はスキップ */
      if (element.id !== 'controls') {
        return;
      }

      handleReverseComplete(
        'position',
        element,
        camera,
        startPosition,
        startRotation,
        startViewOffset,
        lastCameraState,
        updateStartControls!,
        setIsNavigationVisible!,
      );
    };

    /** 変更されたカメラアングルを元に戻すアニメーション (将来の実装用) */
    const _reverseAnimation = gsap.timeline({
      paused: true,
      duration: 0.6,
      ease: 'none',
    });
    void _reverseAnimation; /** 未使用変数抑制 */

    /** マスタータイムラインを1つ作成し、ScrollTriggerを設定 */
    const masterTimeline = gsap.timeline({
      ease: 'power4.out',
      duration: 0.7,
      scrollTrigger: {
        trigger: element,
        markers: IS_DEV
          ? {
              startColor: 'green',
              endColor: 'red',
              fontSize: '12px',
              fontWeight: 'bold',
              indent: 20,
            }
          : false,
        scrub: 0.7,
        start: startPoint,
        end: endPoint,
        id: ` ${sectionName}`,
        refreshPriority: 0,
        onEnter: handleStart,
        onLeaveBack: onLeaveBackCallback,
      },
    });

    /** Controls セクションのときはスキップ */
    if (element.id === 'controls') {
      return;
    }

    /** 補間用オブジェクト */
    const interpolator = { value: 0 };

    /** カメラの位置、回転、viewOffset を補間 (アニメーション再生) */
    masterTimeline.to(
      interpolator,
      {
        value: 1,
        ease: 'power4.out',
        duration: 0.7,
        onUpdate: () => {
          /** カメラがブロックされている場合はスキップ */
          if (camera.userData.isLocked) return;

          /** 目標のカメラ位置に移動 */
          if (targetPosition) {
            camera.position.set(
              gsap.utils.interpolate(
                startPosition.x,
                targetPosition.x,
                interpolator.value,
              ),
              gsap.utils.interpolate(
                startPosition.y,
                targetPosition.y,
                interpolator.value,
              ),
              gsap.utils.interpolate(
                startPosition.z,
                targetPosition.z,
                interpolator.value,
              ),
            );
          }

          /** 目標のカメラ回転に移動 */
          if (targetRotation) {
            camera.rotation.set(
              gsap.utils.interpolate(
                startRotation.x,
                targetRotation.x,
                interpolator.value,
              ),
              gsap.utils.interpolate(
                startRotation.y,
                targetRotation.y,
                interpolator.value,
              ),
              gsap.utils.interpolate(
                startRotation.z,
                targetRotation.z,
                interpolator.value,
              ),
            );
          }

          /** 目標のカメラ viewOffset に移動 */
          if (targetViewOffset) {
            /** 目標のカメラ viewOffset の X 座標に移動 */
            const currentX = gsap.utils.interpolate(
              startViewOffset.x,
              targetViewOffset.x,
              interpolator.value,
            );

            /** 目標のカメラ viewOffset の Y 座標に移動 */
            const currentY = gsap.utils.interpolate(
              startViewOffset.y,
              targetViewOffset.y,
              interpolator.value,
            );

            /** 目標のカメラ viewOffset の幅に移動 */
            const currentWidth = gsap.utils.interpolate(
              startViewOffset.width,
              targetViewOffset.width,
              interpolator.value,
            );

            /** 目標のカメラ viewOffset の高さに移動 */
            const currentHeight = gsap.utils.interpolate(
              startViewOffset.height,
              targetViewOffset.height,
              interpolator.value,
            );

            camera.setViewOffset(
              startViewOffset.fullWidth,
              startViewOffset.fullHeight,
              currentX,
              currentY,
              currentWidth,
              currentHeight,
            );

            camera.updateProjectionMatrix();
          }
        },
      },
      0,
    );
  }, element);
};

/**
 * 各セクションに対するスクロール連動カメラアニメーションを生成する。
 *
 * @param props - セクション要素とカメラパラメータ
 * @returns {gsap.Context[]} セクションごとの GSAP コンテキスト配列
 *
 * @example
 * const contexts = sectionsAnimation({
 *   portal,
 *   introduction,
 *   controls,
 *   camera,
 *   setIsStartControls,
 *   setIsNavigationVisible,
 *   cameraParams,
 * });
 */
export const sectionsAnimation = ({
  portal,
  introduction,
  controls,
  camera,
  updateStartControls,
  setIsNavigationVisible,
  cameraParams,
}: SectionsAnimationProps): gsap.Context[] => {
  /** カメラの位置を設定 */
  camera.position.set(
    cameraParams.portal.position.x,
    cameraParams.portal.position.y,
    cameraParams.portal.position.z,
  );

  /** カメラの回転を設定 */
  camera.rotation.set(
    cameraParams.portal.rotation.x,
    cameraParams.portal.rotation.y,
    cameraParams.portal.rotation.z,
  );

  /** カメラの viewOffset を設定 */
  camera.setViewOffset(
    cameraParams.portal.viewOffset.fullWidth,
    cameraParams.portal.viewOffset.fullHeight,
    cameraParams.portal.viewOffset.x,
    cameraParams.portal.viewOffset.y,
    cameraParams.portal.viewOffset.width,
    cameraParams.portal.viewOffset.height,
  );

  /** カメラの投影行列を更新 */
  camera.updateProjectionMatrix();

  /** portal セクションのアニメーションを作成 */
  const portalCtx = createSectionAnimation({
    element: portal,
    startPosition: cameraParams.portal.position,
    startRotation: cameraParams.portal.rotation,
    startViewOffset: cameraParams.portal.viewOffset!,
    targetPosition: cameraParams.introduction.position,
    targetRotation: cameraParams.introduction.rotation,
    targetViewOffset: cameraParams.introduction.viewOffset,
    camera,
  });

  /** introduction セクションのアニメーションを作成 */
  const introductionCtx = createSectionAnimation({
    element: introduction,
    startPosition: cameraParams.introduction.position,
    startRotation: cameraParams.introduction.rotation,
    startViewOffset: cameraParams.introduction.viewOffset!,
    targetPosition: cameraParams.controls.position,
    targetRotation: cameraParams.controls.rotation,
    targetViewOffset: cameraParams.controls.viewOffset,
    camera,
  });

  /** controls セクションのアニメーションを作成 */
  const controlsCtx = createSectionAnimation({
    element: controls,
    startPosition: cameraParams.controls.position,
    startRotation: cameraParams.controls.rotation,
    startViewOffset: cameraParams.controls.viewOffset!,
    updateStartControls,
    setIsNavigationVisible,
    camera,
  });

  return [portalCtx, introductionCtx, controlsCtx];
};

/**
 * Controls セクション内のカメラ位置・回転・viewOffset を補間する。
 *
 * @param props - コントロールアニメーションに必要な状態
 * @returns {gsap.Context} 生成した GSAP コンテキスト
 *
 * @example
 * const ctx = controlsAnimation({
 *   previousPosition,
 *   previousRotation,
 *   cameraRef,
 *   currentIndex,
 *   isInitialControl,
 *   isStartControls,
 *   cameraConfigs,
 *   width,
 *   height,
 *   sceneCenter,
 *   bboxRadius,
 * });
 */
export const controlsAnimation = ({
  cameraRef,
  currentIndex,
  isInitialControl,
  isStartControls,
  cameraConfigs,
  width,
  height,
  sceneCenter,
  bboxRadius,
}: controlsAnimationProps): gsap.Context => {
  /** アニメーションオプション */
  const options = { ease: 'power2.inOut', duration: 2 };

  /** 現在のカメラ設定 */
  const currentCameraConfig = cameraConfigs[currentIndex];

  /** カメラのアスペクト比を更新 */
  cameraRef.current!.aspect = width / height;

  return gsap.context(() => {
    /** Controls セクションに入る前の初期状態で、カメラパラメータが生成されていない場合は中断 */
    if (isInitialControl && !isStartControls && !currentCameraConfig) {
      return;
    }

    /** カメラ位置：弧状補間（Arc-Slerp） */
    const arcProgress = { value: 0 };

    /** カメラ回転：クォータニオン slerp（Euler 直接補間によるぎめり回転を防止） */
    const rotProgress = { value: 0 };

    /** カメラのアニメーション */
    gsap
      .timeline()
      /** カメラ位置の弧状補間 */
      .to(arcProgress, {
        value: 1,
        ...options,
        delay: 0.5,
        onUpdate: () => {
          const pos = computeArcPosition(
            cameraRef.current!.position.clone(),
            new Vector3(
              currentCameraConfig.position.x,
              currentCameraConfig.position.y,
              currentCameraConfig.position.z,
            ),
            sceneCenter,
            arcProgress.value,
            bboxRadius,
            ARC_BIAS,
          );
          cameraRef.current!.position.copy(pos);
        },
      })
      /** カメラ回転のクォータニオン補間 */
      .to(
        rotProgress,
        {
          value: 1,
          ...options,
          delay: 0,
          onUpdate: () => {
            cameraRef.current!.quaternion.slerpQuaternions(
              cameraRef.current!.quaternion.clone(),
              new Quaternion().setFromEuler(
                new Euler(
                  currentCameraConfig.rotation.x,
                  currentCameraConfig.rotation.y,
                  currentCameraConfig.rotation.z,
                ),
              ),
              rotProgress.value,
            );
          },
        },
        '<',
      )
      /** カメラの viewOffset 補間 */
      .to(
        { dummy: 0 },
        {
          dummy: 1,
          onUpdate: () => {
            cameraRef.current!.setViewOffset(
              currentCameraConfig.viewOffset.fullWidth,
              currentCameraConfig.viewOffset.fullHeight,
              currentCameraConfig.viewOffset.x,
              currentCameraConfig.viewOffset.y,
              currentCameraConfig.viewOffset.width,
              currentCameraConfig.viewOffset.height,
            );
            cameraRef.current!.updateProjectionMatrix();
          },
          ...options,
          delay: 0,
        },
        '<',
      );
  }, cameraRef);
};

/**
 * ビューワーモードの開始・終了時アニメーションを生成する。
 *
 * @param props - ビューワーモード切替に必要な参照とパラメータ
 * @returns {gsap.Context} 生成した GSAP コンテキスト
 *
 * @example
 * const ctx = viewerToggleAnimation({
 *   introduction,
 *   toggleButton,
 *   cameraRef,
 *   cameraParams,
 *   zoom,
 *   offset,
 * });
 */
export const viewerToggleAnimation = ({
  introduction,
  toggleButton,
  cameraRef,
  cameraParams,
  zoom,
  offset,
}: ViewerToggleAnimationProps) => {
  const ctx = gsap.context((self) => {
    const camera = cameraRef.current!;
    const duration = 0.6;
    const elementOffsetTop =
      introduction.getBoundingClientRect().top + window.scrollY + offset;
    const html: HTMLElement = document.getElementsByTagName('html')[0];
    const body: HTMLElement = document.body;

    self.add('onStart', () => {
      /** カメラ位置 */
      gsap.to(camera.position, {
        x: cameraParams.position.x,
        y: cameraParams.position.y - zoom,
        z: cameraParams.position.z - zoom,
        duration: duration,
      });

      /** スクロール停止 & セクショントップに移動 */
      window.scrollTo({ top: elementOffsetTop, behavior: 'smooth' });
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    });
    self.add('onEnd', () => {
      /** カメラ位置 */
      gsap.to(camera.position, {
        x: cameraParams.position.x,
        y: cameraParams.position.y,
        z: cameraParams.position.z,
        duration: duration,
      });

      /** カメラアングル */
      gsap.to(camera.rotation, {
        x: cameraParams.rotation.x,
        y: cameraParams.rotation.y,
        z: cameraParams.rotation.z,
        duration: duration,
        delay: duration,
      });

      /** スクロール停止終了 */
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    });
  }, cameraRef);

  /** Start & End ボタン */
  const startButton = toggleButton.children[1].children[0];
  const endButton = toggleButton.children[2].children[0];

  startButton.addEventListener('click', () => ctx.onStart());
  endButton.addEventListener('click', () => ctx.onEnd());

  return ctx;
};

/**
 * ナビゲーション要素の表示/非表示アニメーションを実行する。
 *
 * @param navigation - 対象ナビゲーション要素
 * @param navigationVisible - 表示状態
 * @returns {() => void} アニメーション破棄関数
 */
export const modelAnimation = (
  navigation: HTMLSpanElement | null,
  navigationVisible: boolean,
): (() => void) => {
  const animate = gsap.timeline({ paused: true });

  if (navigationVisible) {
    animate.fromTo(
      navigation,
      { opacity: 0, display: 'block' },
      { opacity: 1, duration: 0.3, ease: 'sine.out' },
    );
  } else {
    animate.fromTo(
      navigation,
      { opacity: 1 },
      { opacity: 0, display: 'none', duration: 0.3, ease: 'sine.out' },
    );
  }

  animate.play();

  return () => animate.kill();
};
