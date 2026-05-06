import type { Dispatch, RefObject, SetStateAction } from 'react';

import { gsap } from 'gsap';
import { Euler, type PerspectiveCamera, Quaternion, Vector3 } from 'three';

import { IS_DEV } from '@/constants/common';
import {
  CAMERA_ARC_BIAS,
  CONTROLS_ANIMATION_DELAY,
  CONTROLS_ANIMATION_DURATION,
  NAVIGATION_ANIMATION_DURATION,
  REVERSE_COMPLETE_DURATION,
  SECTION_ANIMATION_DURATION,
  SECTION_ANIMATION_SCRUB,
  VIEWER_TOGGLE_END_DURATION,
  VIEWER_TOGGLE_START_DURATION,
} from '@/constants/workThreeD';
import {
  computeArcPosition,
  computeFocusPoint,
  computeLookAtQuaternion,
} from '@/utils/world/work/cameraArc';
import {
  type CameraParams,
  type ControlCameraConfigs,
  type Position,
  type Rotation,
  type ViewOffset,
  type WorkWorldSectionsCameraParams,
} from '@/types/world';

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
  /**  */
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

  /** カメラの参照 Ref */
  cameraRef: RefObject<PerspectiveCamera | null>;

  /** カメラの基本パラメータ */
  cameraParams: CameraParams;

  /** ズーム */
  zoom: number;

  /** オフセット */
  offset: number;

  /** 開始アニメーション完了時に呼ぶコールバック */
  onStartComplete: () => void;

  /** 終了アニメーション完了時に呼ぶコールバック */
  onEndComplete: () => void;
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

  /**
   * true のとき、カメラ終端回転をバウンディングボックス中心への lookAt で決定する。
   * false のとき、cameraConfigs の rotation（Euler 角）を使用する（デフォルト）。
   */
  useBBoxLookAt?: boolean;

  /** カメラアニメーション完了時に呼び出すコールバック */
  onComplete?: () => void;
};

type NavigationVisibleAnimationProps = {
  /** ナビゲーション要素の参照 Ref */
  ref: RefObject<HTMLSpanElement | null>;

  /** ナビゲーションの表示フラグ */
  isVisible: boolean;
};

/**
 * カメラの位置・回転・viewOffset を `t`（0〜1）で線形補間し、カメラに反映する。
 *
 * @param camera - 対象の PerspectiveCamera
 * @param from - 補間の開始状態
 * @param to - 補間の終了状態（各プロパティは省略可能）
 * @param t - 補間係数（0 = from, 1 = to）
 */
const interpolateCameraState = (
  camera: PerspectiveCamera,
  from: {
    position: Position;
    rotation: Rotation;
    viewOffset: { x: number; y: number; width: number; height: number };
  },
  to: {
    position?: Position;
    rotation?: Rotation;
    viewOffset?: ViewOffset;
  },
  t: number,
): void => {
  if (to.position) {
    camera.position.set(
      gsap.utils.interpolate(from.position.x, to.position.x, t),
      gsap.utils.interpolate(from.position.y, to.position.y, t),
      gsap.utils.interpolate(from.position.z, to.position.z, t),
    );
  }

  if (to.rotation) {
    camera.rotation.set(
      gsap.utils.interpolate(from.rotation.x, to.rotation.x, t),
      gsap.utils.interpolate(from.rotation.y, to.rotation.y, t),
      gsap.utils.interpolate(from.rotation.z, to.rotation.z, t),
    );
  }

  if (
    to.viewOffset &&
    to.viewOffset.fullWidth > 0 &&
    to.viewOffset.fullHeight > 0
  ) {
    camera.setViewOffset(
      to.viewOffset.fullWidth,
      to.viewOffset.fullHeight,
      gsap.utils.interpolate(from.viewOffset.x, to.viewOffset.x, t),
      gsap.utils.interpolate(from.viewOffset.y, to.viewOffset.y, t),
      gsap.utils.interpolate(from.viewOffset.width, to.viewOffset.width, t),
      gsap.utils.interpolate(from.viewOffset.height, to.viewOffset.height, t),
    );
    camera.updateProjectionMatrix();
  }
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
 * 各セクション・アニメーションタイプごとの逆再生完了時の処理
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
 *
 * @example
 * handleReverseComplete(
 *  type,
 *  element,
 *  camera,
 *  startPosition,
 *  startRotation,
 *  startViewOffset,
 *  initialState,
 *  setIsStartControls,
 *  setIsNavigationVisible
 * );
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
): void => {
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
      duration: REVERSE_COMPLETE_DURATION,
      ease: 'power2.inOut',
      onStart: onStart,
      onUpdate: () => {
        const vo = initialCameraState.viewOffset;

        /** カメラの状態を補間 */
        interpolateCameraState(
          camera,
          {
            position: initialCameraState.position,
            rotation: initialCameraState.rotation,
            viewOffset: {
              x: vo?.offsetX ?? 0,
              y: vo?.offsetY ?? 0,
              width: vo?.width ?? 0,
              height: vo?.height ?? 0,
            },
          },
          {
            position: startPosition,
            rotation: startRotation,
            viewOffset: startViewOffset,
          },
          interpolator.value,
        );
      },
      onComplete: onComplete,
    },
    0,
  );

  animation.play();
};

/**
 * Portal → Introduction の2区間をカバーするカメラジャーニーアニメーション。
 * 1つの ScrollTrigger + 1つのタイムラインで区間間の onUpdate 競合を根本的に解消する。
 *
 * @param portal - Portal セクション要素
 * @param introduction - Introduction セクション要素
 * @param cameraParams - 各セクションのカメラパラメータ
 * @param camera - 操作対象のカメラ
 * @returns {gsap.Context} 生成した GSAP コンテキスト
 */
const createJourneyAnimation = ({
  portal,
  introduction,
  cameraParams,
  camera,
}: {
  portal: HTMLElement;
  introduction: HTMLElement;
  cameraParams: WorkWorldSectionsCameraParams;
  camera: PerspectiveCamera;
}): gsap.Context => {
  return gsap.context(() => {
    /** ドキュメント絶対座標を取得するヘルパー */
    const absTop = (el: HTMLElement): number =>
      el.getBoundingClientRect().top + window.scrollY;

    /** Portal アニメーション区間（px）: 'top top' → '85% top' */
    const portalRange = portal.offsetHeight * 0.85;

    /** Introduction アニメーション区間（px）: '0% top' → '90% top' */
    const introRange = introduction.offsetHeight * 0.9;

    /** Portal 終端から Introduction 先端までのギャップ（px） */
    const gapRange = Math.max(
      0,
      absTop(introduction) - absTop(portal) - portalRange,
    );

    /** ジャーニー全体のスクロール距離（px） */
    const totalRange = portalRange + gapRange + introRange;

    if (totalRange <= 0) return;

    /** タイムライン内での portal アニメーションの終端位置（正規化 0〜1） */
    const portalTweenEnd = portalRange / totalRange;

    /** タイムライン内での introduction アニメーションの開始位置（正規化 0〜1） */
    const introTweenStart = (portalRange + gapRange) / totalRange;

    const portalInterp = { value: 0 };
    const introInterp = { value: 0 };

    gsap
      .timeline({
        scrollTrigger: {
          trigger: portal,
          start: 'top top',
          end: `+=${totalRange}`,
          scrub: SECTION_ANIMATION_SCRUB,
          id: 'Journey',
          markers: IS_DEV
            ? {
                startColor: 'blue',
                endColor: 'orange',
                fontSize: '12px',
                fontWeight: 'bold',
                indent: 20,
              }
            : false,
        },
      })
      /** Portal 区間: portal_params → introduction_params */
      .to(
        portalInterp,
        {
          value: 1,
          duration: portalTweenEnd,
          ease: 'power4.out',
          onUpdate: () => {
            if (camera.userData.isLocked) return;
            interpolateCameraState(
              camera,
              {
                position: cameraParams.portal.position,
                rotation: cameraParams.portal.rotation,
                viewOffset: {
                  x: cameraParams.portal.viewOffset.x,
                  y: cameraParams.portal.viewOffset.y,
                  width: cameraParams.portal.viewOffset.width,
                  height: cameraParams.portal.viewOffset.height,
                },
              },
              {
                position: cameraParams.introduction.position,
                rotation: cameraParams.introduction.rotation,
                viewOffset: cameraParams.introduction.viewOffset,
              },
              portalInterp.value,
            );
          },
        },
        0,
      )
      /** Introduction 区間: introduction_params → controls_params */
      .to(
        introInterp,
        {
          value: 1,
          duration: 1 - introTweenStart,
          ease: 'power4.out',
          onUpdate: () => {
            if (camera.userData.isLocked) return;
            interpolateCameraState(
              camera,
              {
                position: cameraParams.introduction.position,
                rotation: cameraParams.introduction.rotation,
                viewOffset: {
                  x: cameraParams.introduction.viewOffset.x,
                  y: cameraParams.introduction.viewOffset.y,
                  width: cameraParams.introduction.viewOffset.width,
                  height: cameraParams.introduction.viewOffset.height,
                },
              },
              {
                position: cameraParams.controls.position,
                rotation: cameraParams.controls.rotation,
                viewOffset: cameraParams.controls.viewOffset,
              },
              introInterp.value,
            );
          },
        },
        introTweenStart,
      );
  }, portal);
};

/**
 * セクション用のアニメーションを作成する処理
 *
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

    /** カメラ追跡 ticker のコールバック参照（多重登録・リーク防止用） */
    let trackingTickerCb: (() => void) | null = null;

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

      /** 多重登録を防いでから追跡を開始 */
      if (trackingTickerCb) gsap.ticker.remove(trackingTickerCb);
      trackingTickerCb = () => {
        lastCameraState.position.copy(camera.position);
        lastCameraState.rotation.copy(camera.rotation);
        lastCameraState.viewOffset = camera.view ? { ...camera.view } : null;
      };
      gsap.ticker.add(trackingTickerCb);
    };

    /** セクションを逆方向に離脱した時の処理*/
    const onLeaveBackCallback = (): void => {
      /** Controls セクション以外はスキップ */
      if (element.id !== 'controls') {
        return;
      }

      /** 追跡を停止（スナップショット採取前に止めることで from 位置を安定させる） */
      if (trackingTickerCb) {
        gsap.ticker.remove(trackingTickerCb);
        trackingTickerCb = null;
      }

      /** lastCameraState のスナップショットを渡す（参照渡しによる from 変動を防ぐ） */
      const snapshot = {
        position: lastCameraState.position.clone(),
        rotation: lastCameraState.rotation.clone(),
        viewOffset: lastCameraState.viewOffset
          ? { ...lastCameraState.viewOffset }
          : null,
      };

      handleReverseComplete(
        'position',
        element,
        camera,
        startPosition,
        startRotation,
        startViewOffset,
        snapshot,
        updateStartControls!,
        setIsNavigationVisible!,
      );
    };

    /** マスタータイムラインを1つ作成し、ScrollTriggerを設定 */
    const masterTimeline = gsap.timeline({
      ease: 'power4.out',
      duration: SECTION_ANIMATION_DURATION,
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
        scrub: SECTION_ANIMATION_SCRUB,
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
        duration: SECTION_ANIMATION_DURATION,
        onUpdate: () => {
          /** カメラがブロックされている場合はスキップ */
          if (camera.userData.isLocked) return;

          interpolateCameraState(
            camera,
            {
              position: startPosition,
              rotation: startRotation,
              viewOffset: {
                x: startViewOffset.x,
                y: startViewOffset.y,
                width: startViewOffset.width,
                height: startViewOffset.height,
              },
            },
            {
              position: targetPosition,
              rotation: targetRotation,
              viewOffset: targetViewOffset,
            },
            interpolator.value,
          );
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

  /** カメラの viewOffset を設定（fullWidth/fullHeight が 0 の場合は updateProjectionMatrix で NaN が発生するためスキップ） */
  const portalVo = cameraParams.portal.viewOffset;
  if (portalVo.fullWidth > 0 && portalVo.fullHeight > 0) {
    camera.setViewOffset(
      portalVo.fullWidth,
      portalVo.fullHeight,
      portalVo.x,
      portalVo.y,
      portalVo.width,
      portalVo.height,
    );
  }

  /** カメラの投影行列を更新 */
  camera.updateProjectionMatrix();

  /** portal → introduction の2区間を1つの ScrollTrigger で処理（onUpdate 競合解消） */
  const journeyCtx = createJourneyAnimation({
    portal,
    introduction,
    cameraParams,
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

  return [journeyCtx, controlsCtx];
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
  useBBoxLookAt = false,
  onComplete,
}: controlsAnimationProps): gsap.Context => {
  /** アニメーションオプション */
  const options = {
    ease: 'power2.inOut',
    duration: CONTROLS_ANIMATION_DURATION,
  };

  /** 現在のカメラ設定 */
  const currentCameraConfig = cameraConfigs[currentIndex];

  /** カメラのアスペクト比を更新 */
  cameraRef.current!.aspect = width / height;

  return gsap.context(() => {
    /** Controls セクション未入場の状態では中断 */
    if (!isStartControls) {
      return;
    }

    /** カメラパラメータが生成されていない場合は中断 */
    if (!currentCameraConfig) {
      return;
    }

    /**
     * アーク補間の始点位置。
     * アニメーション開始前に一度だけキャプチャすることで、
     * 毎フレーム現在値を始点にする指数的アプローチを防ぎ、真の Arc 補間を実現する。
     */
    const startPos = cameraRef.current!.position.clone();

    /** カメラ位置・回転の共通プログレス（Arc-Slerp + ブレンド回転） */
    const arcProgress = { value: 0 };

    /** viewOffset 補間プログレス */
    const viewProgress = { value: 0 };

    /** slerp の始点クォータニオン。
     * アニメーション開始前に一度だけキャプチャすることで、
     * 毎フレーム現在値を始点にする指数的アプローチを防ぎ、真の slerp 補間を実現する。
     */
    const startQuat = cameraRef.current!.quaternion.clone();

    /** カメラ終端位置（Arc 補間と lookAt 計算の両方で使用） */
    const endPos = new Vector3(
      currentCameraConfig.position.x,
      currentCameraConfig.position.y,
      currentCameraConfig.position.z,
    );

    /**
     * slerp の終点クォータニオン。
     * `useBBoxLookAt` が true の場合はバウンディングボックス中心への lookAt から計算し、
     * false の場合は cameraConfigs の Euler 角から生成する。
     */
    const endQuat = useBBoxLookAt
      ? computeLookAtQuaternion(endPos, sceneCenter)
      : new Quaternion().setFromEuler(
          new Euler(
            currentCameraConfig.rotation.x,
            currentCameraConfig.rotation.y,
            currentCameraConfig.rotation.z,
          ),
        );

    /**
     * viewOffset の始点値。
     * アニメーション開始前に一度だけキャプチャし、from→to 補間を実現する。
     * view が null（clearViewOffset 状態）の場合はフルビューポート相当の値を使用する。
     */
    const currentView = cameraRef.current!.view;
    const fw = currentCameraConfig.viewOffset.fullWidth;
    const fh = currentCameraConfig.viewOffset.fullHeight;
    const fromViewX = currentView?.enabled ? (currentView.offsetX ?? 0) : 0;
    const fromViewY = currentView?.enabled ? (currentView.offsetY ?? 0) : 0;
    const fromViewW = currentView?.enabled ? (currentView.width ?? fw) : fw;
    const fromViewH = currentView?.enabled ? (currentView.height ?? fh) : fh;

    /**
     * 対蹠点補正のバイアス方向符号を自動判定するための中間前方ベクトル。
     * startQuat と endQuat の中点クォータニオンからカメラの前方向を取得し、
     * biasDir との XZ ドット積でシーンを向く側へ弧が曲がるよう符号を決める。
     */
    const midQuat = new Quaternion().slerpQuaternions(startQuat, endQuat, 0.5);
    const midCameraForward = new Vector3(0, 0, -1).applyQuaternion(midQuat);

    /** フォーカス点：各端点でカメラが実質的に「見ている」地点。
     * sceneCenter を前方ベクトルへ投影することで、roll や微小ズレを保ったまま
     * 「対象方向」を抽出する。両端では startQuat / endQuat を厳密に再現する。
     */
    const startTarget = computeFocusPoint(startPos, startQuat, sceneCenter);
    const endTarget = computeFocusPoint(endPos, endQuat, sceneCenter);

    /** onUpdate 用の再利用バッファ（毎フレーム new すると GC が走る） */
    const _curTarget = new Vector3();

    /** カメラのアニメーション */
    gsap
      .timeline()
      /** カメラ位置の弧状補間 + 注視点追従 */
      .to(arcProgress, {
        value: 1,
        ...options,
        delay: CONTROLS_ANIMATION_DELAY,
        onUpdate: () => {
          const t = arcProgress.value;

          const pos = computeArcPosition(
            startPos,
            endPos,
            sceneCenter,
            t,
            bboxRadius,
            CAMERA_ARC_BIAS,
            midCameraForward,
          );
          cameraRef.current!.position.copy(pos);

          /**
           * 注視点を startTarget → endTarget で線形補間し、常にフレームに収め続ける。
           * t=0 では startQuat、t=1 では endQuat と一致する（computeFocusPoint の性質）。
           * 中間では注視点が画面内を移動し続けるため、フレームアウトが発生しない。
           */
          _curTarget.lerpVectors(startTarget, endTarget, t);
          cameraRef.current!.lookAt(_curTarget);
        },
      })
      /** カメラの viewOffset 補間（始点→終点の線形補間） */
      .to(
        viewProgress,
        {
          value: 1,
          onUpdate: () => {
            cameraRef.current!.setViewOffset(
              fw,
              fh,
              gsap.utils.interpolate(
                fromViewX,
                currentCameraConfig.viewOffset.x,
                viewProgress.value,
              ),
              gsap.utils.interpolate(
                fromViewY,
                currentCameraConfig.viewOffset.y,
                viewProgress.value,
              ),
              gsap.utils.interpolate(
                fromViewW,
                currentCameraConfig.viewOffset.width,
                viewProgress.value,
              ),
              gsap.utils.interpolate(
                fromViewH,
                currentCameraConfig.viewOffset.height,
                viewProgress.value,
              ),
            );
            cameraRef.current!.updateProjectionMatrix();
          },
          onComplete,
          ...options,
          delay: 0,
        },
        '<',
      );
  }, cameraRef);
};

/**
 * ビューワーモードの開始・終了時アニメーションを作成する処理
 *
 * @param props - ビューワーモード切替に必要な参照とパラメータ
 * @returns {gsap.Context} 生成した GSAP コンテキスト
 *
 * @example
 * const ctx = viewerToggleAnimation({
 *   introduction,
 *   cameraRef,
 *   cameraParams,
 *   zoom,
 *   offset,
 * });
 */
export const viewerToggleAnimation = ({
  introduction,
  cameraRef,
  cameraParams,
  zoom,
  offset,
  onStartComplete,
  onEndComplete,
}: ViewerToggleAnimationProps): gsap.Context => {
  return gsap.context((self) => {
    /** Introduction セクションのトップ位置を計算 */
    const elementOffsetTop =
      introduction.getBoundingClientRect().top + window.scrollY + offset;

    /** html と body 要素を取得 */
    const html = document.getElementsByTagName('html')[0];
    const body = document.body;

    /** 開始イベントを登録 */
    self.add('onStart', () => {
      /** ScrollTrigger による干渉をブロック */
      cameraRef.current!.userData.isLocked = true;

      /** スクロールを停止 */
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';

      /** セクショントップに移動 */
      window.scrollTo({ top: elementOffsetTop, behavior: 'instant' });

      /** カメラ位置を更新 */
      gsap.to(cameraRef.current!.position, {
        x: cameraParams.position.x,
        y: cameraParams.position.y - zoom,
        z: cameraParams.position.z - zoom,
        duration: VIEWER_TOGGLE_START_DURATION,
        ease: 'power1.in',
        onComplete: onStartComplete,
      });
    });

    /** 終了イベントを登録 */
    self.add('onEnd', () => {
      /** アニメーションの開始・終了時のカメラ位置 */
      const startPos = cameraRef.current!.position.clone();
      const endPos = new Vector3(
        cameraParams.position.x,
        cameraParams.position.y,
        cameraParams.position.z,
      );

      /** 現在の視線方向を取得 */
      const startDir = new Vector3();
      cameraRef.current!.getWorldDirection(startDir);

      /** 開始 lookAt ターゲットを計算 */
      const startLookAt = startPos.clone().addScaledVector(startDir, 10);

      /** 終了 lookAt ターゲット：終端回転からクォータニオン経由で計算 */
      const endQuat = new Quaternion().setFromEuler(
        new Euler(
          cameraParams.rotation.x,
          cameraParams.rotation.y,
          cameraParams.rotation.z,
        ),
      );
      const endDir = new Vector3(0, 0, -1).applyQuaternion(endQuat);
      const endLookAt = endPos.clone().addScaledVector(endDir, 10);

      /** 単一プログレス値で位置・lookAt ターゲットを同期補間 */
      const progress = { value: 0 };

      /** ScrollTrigger による干渉をブロック */
      cameraRef.current!.userData.isLocked = true;

      gsap.to(progress, {
        value: 1,
        duration: VIEWER_TOGGLE_END_DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          /** 位置を補間 */
          cameraRef.current!.position.lerpVectors(
            startPos,
            endPos,
            progress.value,
          );
          /** lookAt ターゲットを補間 */
          const lookTarget = new Vector3().lerpVectors(
            startLookAt,
            endLookAt,
            progress.value,
          );
          cameraRef.current!.lookAt(lookTarget);
        },
        onComplete: () => {
          /** スクロール制御の解除 */
          html.style.overflow = 'auto';
          body.style.overflow = 'auto';
          /** カメラ更新ロックを解除 */
          cameraRef.current!.userData.isLocked = false;
          /** 終了アニメーション完了を通知 */
          onEndComplete();
        },
      });
    });
  }, cameraRef);
};

/**
 * ナビゲーション要素の表示/非表示アニメーションを実行する処理
 *
 * @param props - ナビゲーションの参照と状態
 * @returns {gsap.Context} 生成した GSAP コンテキスト
 */
export const navigationVisibleAnimation = ({
  ref,
  isVisible,
}: NavigationVisibleAnimationProps): gsap.Context => {
  return gsap.context(() => {
    const animate = gsap.timeline({ paused: true });

    /** ナビゲーションの表示が有効な場合、透明度を変更して表示 */
    if (isVisible) {
      animate.fromTo(
        ref.current!,
        { opacity: 0, display: 'block' },
        {
          opacity: 1,
          duration: NAVIGATION_ANIMATION_DURATION,
          ease: 'sine.out',
        },
      );
    } else {
      /** ナビゲーションの表示が無効な場合、透明度を変更して非表示 */
      animate.fromTo(
        ref.current!,
        { opacity: 1 },
        {
          opacity: 0,
          display: 'none',
          duration: NAVIGATION_ANIMATION_DURATION,
          ease: 'sine.out',
        },
      );
    }

    animate.play();
  }, ref);
};
