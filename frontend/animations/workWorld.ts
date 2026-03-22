import React from 'react';
import { PerspectiveCamera, Euler, Quaternion, Vector3 } from 'three';
import { gsap } from 'gsap';
import { computeArcPosition } from '@/utils/world/work/cameraArc';

/** 弧状補間の横バイアス強度（0=直線, 1=デフォルト） */
const ARC_BIAS = 0.3;
import {
  Position,
  Rotation,
  ViewOffset,
  ControlCameraConfigs,
  CameraParams,
  WorkWorldSectionsCameraParams,
} from '@/types/world';

type CreateSectionAnimationProps = {
  element: HTMLElement;
  startPosition: Position;
  startRotation: Rotation;
  startViewOffset: ViewOffset;
  targetPosition?: Position;
  targetRotation?: Rotation;
  targetViewOffset?: ViewOffset;
  setIsStartControls?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  width?: number;
  height?: number;
  camera: PerspectiveCamera;
};

type SectionsAnimationProps = {
  portal: HTMLElement;
  introduction: HTMLElement;
  controls: HTMLElement;
  camera: PerspectiveCamera;
  setIsStartControls: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  cameraParams: WorkWorldSectionsCameraParams;
};

type ViewerToggleAnimationProps = {
  introduction: HTMLElement;
  toggleButton: HTMLElement;
  cameraRef: React.RefObject<PerspectiveCamera>;
  cameraParams: CameraParams;
  zoom: number;
  offset: number;
};

type controlsAnimationProps = {
  previousPosition: Position;
  previousRotation: Rotation;
  cameraRef: React.RefObject<PerspectiveCamera>;
  currentIndex: number;
  isInitialControl: boolean;
  isStartControls: boolean;
  cameraConfigs: ControlCameraConfigs;
  width: number;
  height: number;
  sceneCenter: Vector3;
  bboxRadius: number;
};

/* 各セクション・アニメーションタイプごとの逆再生完了時の処理 */
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
    viewOffset: any;
  },
  setIsStartControls: React.Dispatch<React.SetStateAction<boolean>>,
  setIsNavigationVisible: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const animation = gsap.timeline({ paused: true });

  /* カメラ位置のとき */
  if (type === 'position') {
    /* Controls セクション内アニメーション再生の無効およびコントロールボタンの非表示。
            カメラ位置・アングルを元に戻すアニメーションを再生（再生が終了するまでスクロール位置を固定）。 */
    if (element.id === 'controls') {
      setIsStartControls && setIsStartControls(() => false);
      setIsNavigationVisible && setIsNavigationVisible(() => false);
      const html = document.documentElement;
      const body = document.body;

      // コントロールセクション要素の絶対位置を取得
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollTop;

      // ★ スクロール位置を強制的に固定する関数
      const forceScroll = () => {
        if (window.scrollY !== elementTop) {
          window.scrollTo(0, elementTop);
        }
      };

      // ★ スクロール操作を無効化する関数
      const preventDefault = (e: Event) => e.preventDefault();

      // 即座に位置を戻してロック
      forceScroll();
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';

      // 慣性スクロールや追加入力を防ぐためにイベントを無効化 (passive: false が重要)
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });

      // アニメーション中は毎フレーム強制的に位置を補正し続ける
      gsap.ticker.add(forceScroll);

      // ★ 追加: 他のScrollTriggerによる干渉を防ぐためにカメラ更新をロックする
      camera.userData.isLocked = true;

      // ★ カメラ位置を「スクロールされる前の位置（initialState）」に強制的に戻す
      // これにより、行き過ぎたスクロールによるズレを解消し、ユーザーが操作していた位置からアニメーションを開始する
      if (initialState) {
        camera.position.copy(initialState.position as any);
        camera.rotation.copy(initialState.rotation as any);
        if (initialState.viewOffset && initialState.viewOffset.enabled) {
          camera.setViewOffset(
            initialState.viewOffset.fullWidth,
            initialState.viewOffset.fullHeight,
            initialState.viewOffset.offsetX,
            initialState.viewOffset.offsetY,
            initialState.viewOffset.width,
            initialState.viewOffset.height,
          );
        }
        camera.updateProjectionMatrix();
      }

      // アニメーションの始点として使用
      const initialCameraState = initialState
        ? {
            position: initialState.position,
            rotation: initialState.rotation,
            viewOffset: initialState.viewOffset,
          }
        : {
            position: camera.position.clone(),
            rotation: camera.rotation.clone(),
            viewOffset: { ...camera.view },
          };

      const onStart = () => {
        console.log('アニメーション再生開始');
        forceScroll();
      };
      const onComplete = () => {
        console.log('アニメーション再生終了');
        html.style.overflow = '';
        body.style.overflow = '';

        // ★ ロック解除
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        gsap.ticker.remove(forceScroll);

        // ★ カメラ更新ロックを解除
        camera.userData.isLocked = false;

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
            // position
            camera.position.x = gsap.utils.interpolate(
              initialCameraState.position.x,
              startPosition.x,
              interpolator.value,
            );
            camera.position.y = gsap.utils.interpolate(
              initialCameraState.position.y,
              startPosition.y,
              interpolator.value,
            );
            camera.position.z = gsap.utils.interpolate(
              initialCameraState.position.z,
              startPosition.z,
              interpolator.value,
            );
            // rotation
            camera.rotation.x = gsap.utils.interpolate(
              initialCameraState.rotation.x,
              startRotation.x,
              interpolator.value,
            );
            camera.rotation.y = gsap.utils.interpolate(
              initialCameraState.rotation.y,
              startRotation.y,
              interpolator.value,
            );
            camera.rotation.z = gsap.utils.interpolate(
              initialCameraState.rotation.z,
              startRotation.z,
              interpolator.value,
            );
            // viewOffset
            const currentX = gsap.utils.interpolate(
              initialCameraState.viewOffset.offsetX ?? 0,
              startViewOffset.x,
              interpolator.value,
            );
            const currentY = gsap.utils.interpolate(
              initialCameraState.viewOffset.offsetY ?? 0,
              startViewOffset.y,
              interpolator.value,
            );
            const currentWidth = gsap.utils.interpolate(
              initialCameraState.viewOffset.width ?? 0,
              startViewOffset.width,
              interpolator.value,
            );
            const currentHeight = gsap.utils.interpolate(
              initialCameraState.viewOffset.height ?? 0,
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
    }
  }
};

/* ============================================================
セクション用 アニメーション 作成
-----------------------------------
ページの一番下から開始、portalからintroduction間で空間に何も映らない
=============================================================*/
const createSectionAnimation = ({
  element,
  startPosition,
  targetPosition,
  startRotation,
  targetRotation,
  startViewOffset,
  targetViewOffset,
  setIsStartControls,
  setIsNavigationVisible,
  camera,
}: CreateSectionAnimationProps) => {
  const ctx = gsap.context(() => {
    let startPoint = '';
    let endPoint = '';
    let sectionName = '';

    /* 各セクションのアニメーション開始・終了位置を設定 */
    switch (element.id) {
      case 'model-viewer':
        startPoint = 'top top';
        endPoint = '85% top';
        sectionName = 'Model Viewer';
        break;
      case 'introduction':
        startPoint = '0% top';
        endPoint = '90% top';
        sectionName = 'Introduction';
        break;
      case 'controls':
        startPoint = '0% top';
        endPoint = '100% top';
        sectionName = 'Controls';
        break;
      default:
        sectionName = 'Unknown';
        break;
    }

    /** カメラの状態を追跡 */
    const lastCameraState = {
      position: camera.position.clone(),
      rotation: camera.rotation.clone(),
      viewOffset: { ...camera.view },
    };

    /** 毎フレームカメラの状態を保存 */
    const updateLastCameraState = () => {
      lastCameraState.position.copy(camera.position);
      lastCameraState.rotation.copy(camera.rotation);
      lastCameraState.viewOffset = { ...camera.view };
    };

    /* 各セクション・アニメーションタイプの開始前の処理 */
    const handleStart = () => {
      /** コントロールセクションに入ったとき */
      if (element.id === 'controls') {
        setIsStartControls && setIsStartControls(true);
        setIsNavigationVisible && setIsNavigationVisible(true);
        /** カメラ位置の追跡を開始 */
        gsap.ticker.add(updateLastCameraState);
      }
    };

    /* 変更されたカメラアングルを元に戻すアニメーション */
    const reverseAnimation = gsap.timeline({ paused: true, duration: 0.6, ease: 'none' });

    const onLeaveBackCallback = () => {
      if (element.id === 'controls') {
        handleReverseComplete(
          'position',
          // reverseAnimation,
          element,
          camera,
          startPosition,
          startRotation,
          startViewOffset,
          lastCameraState,
          setIsStartControls!,
          setIsNavigationVisible!,
        );
      }
    };

    // 1. マスタータイムラインを1つ作成し、ScrollTriggerを設定
    const masterTimeline = gsap.timeline({
      ease: 'power4.out',
      duration: 0.7,
      scrollTrigger: {
        trigger: element,
        markers:
          process.env.NODE_ENV === 'development'
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

    // Controls セクション以外
    if (element.id !== 'controls') {
      const interpolator = { value: 0 };

      masterTimeline.to(
        interpolator,
        {
          value: 1,
          ease: 'power4.out',
          duration: 0.7,
          onUpdate: () => {
            // カメラがブロックされている場合はスキップ
            if (camera.userData.isLocked) return;

            // position
            if (targetPosition) {
              camera.position.x = gsap.utils.interpolate(
                startPosition.x,
                targetPosition.x,
                interpolator.value,
              );
              camera.position.y = gsap.utils.interpolate(
                startPosition.y,
                targetPosition.y,
                interpolator.value,
              );
              camera.position.z = gsap.utils.interpolate(
                startPosition.z,
                targetPosition.z,
                interpolator.value,
              );
            }
            // rotation
            if (targetRotation) {
              camera.rotation.x = gsap.utils.interpolate(
                startRotation.x,
                targetRotation.x,
                interpolator.value,
              );
              camera.rotation.y = gsap.utils.interpolate(
                startRotation.y,
                targetRotation.y,
                interpolator.value,
              );
              camera.rotation.z = gsap.utils.interpolate(
                startRotation.z,
                targetRotation.z,
                interpolator.value,
              );
            }
            // viewOffset
            if (targetViewOffset) {
              const currentX = gsap.utils.interpolate(
                startViewOffset.x,
                targetViewOffset.x,
                interpolator.value,
              );
              const currentY = gsap.utils.interpolate(
                startViewOffset.y,
                targetViewOffset.y,
                interpolator.value,
              );
              const currentWidth = gsap.utils.interpolate(
                startViewOffset.width,
                targetViewOffset.width,
                interpolator.value,
              );
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
    }
  }, element);

  return ctx;
};

/* ============================================================
セクションアニメーション
=============================================================*/
export const sectionsAnimation = ({
  portal,
  introduction,
  controls,
  camera,
  setIsStartControls,
  setIsNavigationVisible,
  cameraParams,
}: SectionsAnimationProps) => {
  // カメラの初期状態を即座に設定
  const initParams = cameraParams.portal;
  camera.position.set(
    initParams.position.x,
    initParams.position.y,
    initParams.position.z,
  );
  camera.rotation.set(
    initParams.rotation.x,
    initParams.rotation.y,
    initParams.rotation.z,
  );
  camera.setViewOffset(
    initParams.viewOffset.fullWidth,
    initParams.viewOffset.fullHeight,
    initParams.viewOffset.x,
    initParams.viewOffset.y,
    initParams.viewOffset.width,
    initParams.viewOffset.height,
  );
  camera.updateProjectionMatrix();

  /* portal セクション */
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
  /* introduction セクション */
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
  /* controls セクション */
  const controlsCtx = createSectionAnimation({
    element: controls,
    startPosition: cameraParams.controls.position,
    startRotation: cameraParams.controls.rotation,
    startViewOffset: cameraParams.controls.viewOffset!,
    setIsStartControls,
    setIsNavigationVisible,
    camera,
  });

  return [portalCtx, introductionCtx, controlsCtx];
};

/* ============================================================
コントロールアニメーション
=============================================================*/
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
}: controlsAnimationProps) => {
  const camera = cameraRef.current!;
  const duration = 2;
  const options = { ease: 'power2.inOut', duration };
  const item = cameraConfigs[currentIndex];
  const delay = 0.5; // 0.5秒遅延
  camera.aspect = width / height; // アスペクト比の設定
  const ctx = gsap.context(() => {
    if (!isInitialControl && isStartControls && item) {
      const timeline = gsap.timeline();

      /** カメラ位置：弧状補間（Arc-Slerp） */
      const startPos = camera.position.clone();
      const endPos = new Vector3(item.position.x, item.position.y, item.position.z);
      const arcProgress = { value: 0 };
      timeline.to(arcProgress, {
        value: 1,
        ...options,
        delay,
        onUpdate: () => {
          const pos = computeArcPosition(
            startPos,
            endPos,
            sceneCenter,
            arcProgress.value,
            bboxRadius,
            ARC_BIAS,
          );
          camera.position.copy(pos);
        },
      });

      /** カメラ回転：クォータニオン slerp（Euler 直接補間によるぎめり回転を防止） */
      const startQuaternion = camera.quaternion.clone();
      const endQuaternion = new Quaternion().setFromEuler(
        new Euler(item.rotation.x, item.rotation.y, item.rotation.z),
      );
      const rotProgress = { value: 0 };
      timeline.to(
        rotProgress,
        {
          value: 1,
          ...options,
          delay: 0,
          onUpdate: () => {
            camera.quaternion.slerpQuaternions(
              startQuaternion,
              endQuaternion,
              rotProgress.value,
            );
          },
        },
        '<',
      );

      timeline.to(
        { dummy: 0 },
        {
          dummy: 1,
          onUpdate: () => {
            camera.setViewOffset(
              item.viewOffset.fullWidth,
              item.viewOffset.fullHeight,
              item.viewOffset.x,
              item.viewOffset.y,
              item.viewOffset.width,
              item.viewOffset.height,
            );
            camera.updateProjectionMatrix();
          },
          ...options,
          delay: 0, // positionと同時
        },
        '<',
      );
    }
  }, cameraRef);

  return ctx;
};

/* ==========================================================================================
ビューワーモード切り替えアニメーション
===========================================================================================*/
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
      /* カメラ位置 */
      gsap.to(camera.position, {
        x: cameraParams.position.x,
        y: cameraParams.position.y - zoom,
        z: cameraParams.position.z - zoom,
        duration: duration,
      });
      /* スクロール停止 & セクショントップに移動 */
      window.scrollTo({ top: elementOffsetTop, behavior: 'smooth' });
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    });
    self.add('onEnd', () => {
      /* カメラ位置 */
      gsap.to(camera.position, {
        x: cameraParams.position.x,
        y: cameraParams.position.y,
        z: cameraParams.position.z,
        duration: duration,
      });
      /* カメラアングル */
      gsap.to(camera.rotation, {
        x: cameraParams.rotation.x,
        y: cameraParams.rotation.y,
        z: cameraParams.rotation.z,
        duration: duration,
        delay: duration,
      });
      /* スクロール停止終了 */
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    });
  }, cameraRef);

  /* Start & End ボタン */
  const startButton = toggleButton.children[1].children[0];
  const endButton = toggleButton.children[2].children[0];

  startButton.addEventListener('click', () => ctx.onStart());
  endButton.addEventListener('click', () => ctx.onEnd());

  return ctx;
};

/* ============================================================
モデルアニメーション
=============================================================*/
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
