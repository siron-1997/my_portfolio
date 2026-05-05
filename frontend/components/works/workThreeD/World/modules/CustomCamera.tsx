'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { PerspectiveCamera as CustomPerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { Dispatch, JSX, RefObject, SetStateAction } from 'react';
import type { Euler, PerspectiveCamera, Vector3 } from 'three';
import { Box3, Sphere } from 'three';

import {
  controlsAnimation,
  sectionsAnimation,
  viewerToggleAnimation,
} from '@/animations/workWorld';
import type { WorldProps } from '@/components/works/workThreeD/World';
import { BREAK_POINTS } from '@/constants/common';
import { useWindowSize } from '@/hooks';
import { type ModelChildren } from '@/types/world';
import {
  generateControlsCameraConfigs,
  getSectionsCameraParams,
  getViwerToggleCameraParams,
} from '@/utils/world/work/getCameraParams';

type Props = Omit<WorldProps, 'isLoading'> & {
  /** カメラの参照 Ref */
  cameraRef: RefObject<PerspectiveCamera | null>;

  /** ナビゲーションの表示フラグの状態 */
  setIsNavigationVisible: Dispatch<SetStateAction<boolean>>;

  /** モデルの子要素リスト */
  modelChildren: ModelChildren;
};

const CustomCamera = React.memo(
  ({
    cameraRef,
    setIsNavigationVisible,
    modelChildren,
    content,
    portalRef,
    introductionRef,
    controlsRef,
    toggleButtonRef,
    isInitialControl,
    isStartControls,
    isViewerActive,
    currentIndex,
    dispatch,
  }: Props): JSX.Element => {
    /** 前回のカメラ位置の参照 Ref */
    const previousPositionRef = useRef<Vector3 | null>(null);

    /** 前回のカメラ回転の参照 Ref */
    const previousRotationRef = useRef<Euler | null>(null);

    /** ページアンマウント状態の参照 Ref */
    const isPageUnMountedRef = useRef<boolean>(false);

    /** ウィンドウサイズを取得 */
    const { width, height } = useWindowSize();

    /** WebGL コンテキストを取得 */
    const gl = useThree((state) => state.gl);

    /**
     * コントロール開始フラグを更新するコールバック
     *
     * @param valueOrUpdater - 更新する値または updater 関数
     */
    const updateStartControls = useCallback(
      (valueOrUpdater: boolean | ((prev: boolean) => boolean)): void => {
        dispatch({
          type: 'SET_START_CONTROLS',
          payload:
            typeof valueOrUpdater === 'function'
              ? valueOrUpdater(isStartControls)
              : valueOrUpdater,
        });
      },
      [dispatch, isStartControls],
    );

    /** カメラの位置・アングルを更新 */
    useFrame(() => {
      if (!cameraRef.current) return;
      const previousPosition = cameraRef.current.position.clone();
      const previousRotation = cameraRef.current.rotation.clone();
      previousPositionRef.current = previousPosition;
      previousRotationRef.current = previousRotation;
      cameraRef.current.updateProjectionMatrix();
    });

    /** 各セクションのアニメーションを管理 */
    useLayoutEffect(() => {
      if (
        modelChildren.length === 0 ||
        !cameraRef.current ||
        !portalRef.current ||
        !introductionRef.current ||
        !controlsRef.current
      )
        return;

      /** ブレークポイントに応じた、各セクションのカメラパラメータを取得 */
      const sectionsCameraParams = getSectionsCameraParams(
        modelChildren,
        width,
        height,
      );

      /** 各セクションのカメラアニメーションを初期化 */
      const sectionsAnimationCtx = sectionsAnimation({
        portal: portalRef.current,
        introduction: introductionRef.current,
        controls: controlsRef.current,
        camera: cameraRef.current,
        updateStartControls,
        setIsNavigationVisible,
        cameraParams: sectionsCameraParams,
      });

      return () => {
        sectionsAnimationCtx.forEach((ctx) => ctx.revert());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- cameraRef/controlsRef/introductionRef/portalRef は安定参照、updateStartControls はアニメーション再初期化防止のため除外
    }, [height, modelChildren, setIsNavigationVisible, width]);

    /** ビュワーモードのアニメーションを管理 */
    useLayoutEffect(() => {
      if (
        modelChildren.length === 0 ||
        !introductionRef.current ||
        !toggleButtonRef.current
      )
        return;

      /** ブレークポイントに応じた、ビュワーモードのカメラパラメータを取得 */
      const {
        cameraParams: viewerCameraParams,
        zoom,
        offset,
      } = getViwerToggleCameraParams(modelChildren, width, height);

      /** ビュワーモードのアニメーションを初期化 */
      const viewerAnimationCtx = viewerToggleAnimation({
        introduction: introductionRef.current,
        cameraRef,
        cameraParams: viewerCameraParams,
        zoom,
        offset,
      });

      /** アニメーションの開始時のイベントハンドラ */
      const handleStart = () => viewerAnimationCtx.onStart();

      /** アニメーションの終了時のイベントハンドラ */
      const handleEnd = () => viewerAnimationCtx.onEnd();

      /** 開始ボタンの要素を取得 */
      const startButton = toggleButtonRef.current.children[1].children[0];

      /** 終了ボタンの要素を取得 */
      const endButton = toggleButtonRef.current.children[2].children[0];

      /** 開始ボタンにアニメーション開始時のイベントハンドラを追加 */
      startButton.addEventListener('click', handleStart);

      /** 終了ボタンにアニメーション終了時のイベントハンドラを追加 */
      endButton.addEventListener('click', handleEnd);

      return () => {
        viewerAnimationCtx.revert();
        startButton.removeEventListener('click', handleStart);
        endButton.removeEventListener('click', handleEnd);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- cameraRef/introductionRef/toggleButtonRef は安定参照のため除外
    }, [height, modelChildren, width]);

    useLayoutEffect(() => {
      if (modelChildren.length === 0 || !cameraRef.current) return;

      /** カメラ初期位置 */
      previousPositionRef.current = cameraRef.current.position.clone();

      /** カメラ初期アングル */
      previousRotationRef.current = cameraRef.current.rotation.clone();

      /** コントロール用のカメラパラメータを生成 */
      const cameraConfigs = generateControlsCameraConfigs(
        modelChildren,
        width,
        height,
        content.controls || [],
      );

      /** シーンのバウンディングボックス中心と包容球半径を算出（Arc-Slerp 用） */
      const bbox = new Box3();
      modelChildren.forEach((child) => bbox.expandByObject(child));

      /** シーンの包容球を取得 */
      const sphere = bbox.getBoundingSphere(new Sphere());

      /** シーンの中心座標 */
      const sceneCenter = sphere.center;

      /** シーンの包容球半径 */
      const bboxRadius = sphere.radius > 0 ? sphere.radius : 5;

      /** コントロール用のアニメーションを初期化 */
      const ctx = controlsAnimation({
        previousPosition: previousPositionRef.current,
        previousRotation: previousRotationRef.current,
        cameraRef,
        currentIndex,
        isInitialControl,
        isStartControls,
        cameraConfigs,
        width,
        height,
        sceneCenter,
        bboxRadius,
      });

      return () => {
        if (isPageUnMountedRef.current) ctx.revert();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- cameraRef は安定参照のため除外
    }, [
      content.controls,
      currentIndex,
      height,
      isInitialControl,
      isStartControls,
      modelChildren,
      width,
    ]);

    /** ページアンマウント時に更新 */
    useLayoutEffect(() => {
      return () => {
        isPageUnMountedRef.current = true;
      };
    }, []);

    /** ビュワーモードの活性状態に応じて Canvas の z-index を更新 */
    useEffect(() => {
      const canvas: HTMLCanvasElement = gl.domElement;
      canvas.style.zIndex = isViewerActive ? '200' : '20';
    }, [gl, isViewerActive]);

    return (
      <CustomPerspectiveCamera
        ref={cameraRef}
        name="my-camera"
        fov={
          width < BREAK_POINTS.XS ? 50 : width < BREAK_POINTS.SM ? 45 : 26.9915
        }
        near={0.1}
        far={200}
        makeDefault
        onUpdate={(c) => c.updateProjectionMatrix()}
      />
    );
  },
);

CustomCamera.displayName = 'CustomCamera';

export default CustomCamera;
