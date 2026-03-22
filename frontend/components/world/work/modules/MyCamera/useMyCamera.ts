'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler, PerspectiveCamera, Box3, Sphere } from 'three';
import { WorkDetail } from '@/types/api';
import { ModelChildren } from '@/types/world';
import { useWorkThreeDContext } from '@/contexts';
import { useWindowSize } from '@/hooks';
import {
  sectionsAnimation,
  viewerToggleAnimation,
  controlsAnimation,
} from '@/animations/workWorld';
import {
  getSectionsCameraParams,
  getViwerToggleCameraParams,
  generateControlsCameraConfigs,
} from '@/utils/world/work/getCameraParams';

type Props = {
  cameraRef: React.MutableRefObject<PerspectiveCamera>;
  setIsNavigationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modelChildren: ModelChildren;
  content: WorkDetail;
};

const useMyCamera = ({
  cameraRef,
  setIsNavigationVisible,
  modelChildren,
  content,
}: Props) => {
  const {
    refs: { portalRef, introductionRef, controlsRef, toggleButtonRef },
    state: { isInitialControl, isStartControls, isViewerActive, currentIndex },
    dispatch,
  } = useWorkThreeDContext();
  const setIsStartControls = (
    valueOrUpdater: boolean | ((prev: boolean) => boolean),
  ): void => {
    const payload =
      typeof valueOrUpdater === 'function'
        ? valueOrUpdater(isStartControls)
        : valueOrUpdater;
    dispatch({ type: 'SET_START_CONTROLS', payload });
  };

  const previousPositionRef = useRef<Vector3>(null!); // カメラ位置を監視
  const previousRotationRef = useRef<Euler>(null!); // カメラアングルを監視
  const isPageUnMountedRef = useRef<boolean>(false);

  const { gl } = useThree();
  const { width, height } = useWindowSize();

  /* カメラの位置・アングルを更新 */
  useFrame(() => {
    const previousPosition = cameraRef.current.position.clone();
    const previousRotation = cameraRef.current.rotation.clone();
    previousPositionRef.current = previousPosition;
    previousRotationRef.current = previousRotation;
    cameraRef.current.updateProjectionMatrix();
  });

  /* セクション・ビュワーモード アニメーション */
  useLayoutEffect(() => {
    // ブレークポイントに応じて、各セクションのカメラパラメータを取得
    const sectionsCameraParams = getSectionsCameraParams(modelChildren, width, height);
    // カメラアニメーションを作成 (セクションごとにカメラの位置・アングルを設定)
    const sectionsAnimations = sectionsAnimation({
      portal: portalRef.current,
      introduction: introductionRef.current,
      controls: controlsRef.current,
      camera: cameraRef.current,
      setIsStartControls,
      setIsNavigationVisible,
      cameraParams: sectionsCameraParams,
    });

    // ブレークポイントに応じて、ビュワーモードのカメラパラメータを取得
    const {
      cameraParams: viewerCameraParams,
      zoom,
      offset,
    } = getViwerToggleCameraParams(modelChildren, width, height);
    // アニメーション作成 (ビュワーモードのカメラ位置・アングルを設定)
    const viewerAnimation = viewerToggleAnimation({
      introduction: introductionRef.current,
      toggleButton: toggleButtonRef.current,
      cameraRef,
      cameraParams: viewerCameraParams,
      zoom,
      offset,
    });

    return () => {
      sectionsAnimations.forEach((ctx) => ctx.revert());
      viewerAnimation.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelChildren]);

  useLayoutEffect(() => {
    if (modelChildren.length === 0) return;
    previousPositionRef.current = cameraRef.current.position.clone(); // カメラ初期位置
    previousRotationRef.current = cameraRef.current.rotation.clone(); // カメラ初期アングル

    // コントロール用のカメラパラメータを生成
    const cameraConfigs = generateControlsCameraConfigs(
      modelChildren,
      width,
      height,
      content.controls || [],
    );

    // シーンのバウンディングボックス中心と包容球半径を算出（Arc-Slerp 用）
    const bbox = new Box3();
    modelChildren.forEach((child) => bbox.expandByObject(child));
    const sphere = bbox.getBoundingSphere(new Sphere());
    const sceneCenter = sphere.center;
    const bboxRadius = sphere.radius > 0 ? sphere.radius : 5;

    // コントロール用のアニメーションを作成
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isInitialControl, isStartControls, modelChildren, width]);

  /* ページアンマウント時に更新 */
  useLayoutEffect(() => {
    return () => {
      isPageUnMountedRef.current = true;
    };
  }, []);

  // カメラの z-index をビュワーモードの状態に応じて変更
  useEffect(() => {
    const canvas: HTMLCanvasElement = gl.domElement;
    canvas.style.zIndex = isViewerActive ? '200' : '20';
  }, [gl, isViewerActive]);

  return { width };
};

export default useMyCamera;
