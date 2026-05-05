'use client';

import React, { useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import type { Dispatch, JSX, RefObject, SetStateAction } from 'react';

import type { WorkControl } from '@/types/api';

import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera as CustomPerspectiveCamera } from '@react-three/drei';
import { Box3, Sphere, Vector3 } from 'three';
import type { PerspectiveCamera, Euler } from 'three';

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

  /**
   * GLB 数値順にソートされた Controls データを通知するコールバック。
   * Controls セクションのカメラ設定が確定したタイミングで一度だけ呼ばれる。
   */
  onControlsSorted: (sortedControls: WorkControl[]) => void;
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
    viewerStatus,
    currentIndex,
    dispatch,
    onControlsSorted,
  }: Props): JSX.Element => {
    /** 前回のカメラ位置の参照 Ref */
    const previousPositionRef = useRef<Vector3 | null>(null);

    /** 前回のカメラ回転の参照 Ref */
    const previousRotationRef = useRef<Euler | null>(null);

    /** ページアンマウント状態の参照 Ref */
    const isPageUnMountedRef = useRef<boolean>(false);

    /** シーン中心座標の参照 Ref（OrbitControls target 同期用） */
    const sceneCenterRef = useRef<Vector3>(new Vector3());

    /** ウィンドウサイズを取得 */
    const { width, height } = useWindowSize();

    /** WebGL コンテキストを取得 */
    const gl = useThree((state) => state.gl);

    /** OrbitControls インスタンスを取得（makeDefault により登録される） */
    const controls = useThree((state) => state.controls);

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

      /** [DEBUG] sectionsCameraParams の内容確認 */
      if (process.env.NODE_ENV === 'development') {
        console.group('[Camera DEBUG] sectionsAnimation 起動');
        console.group('▼ sectionsCameraParams');
        Object.entries(sectionsCameraParams).forEach(([key, val]) =>
          console.log(`  [${key}]`, val),
        );
        console.groupEnd();
        console.group('▼ modelChildren 名前一覧');
        modelChildren.forEach((child) =>
          console.log(`  [${child.type}] ${child.name}`),
        );
        console.groupEnd();
        console.groupEnd();
      }

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
        /** 開始アニメーション完了後に active へ遷移 */
        onStartComplete: () =>
          dispatch({ type: 'SET_VIEWER_STATUS', payload: 'active' }),
        /** 終了アニメーション完了後に passive へ遷移 */
        onEndComplete: () =>
          dispatch({ type: 'SET_VIEWER_STATUS', payload: 'passive' }),
      });

      /** アニメーションの開始時のイベントハンドラ（entering を即時 dispatch してボタンを切り替える） */
      const handleStart = () => {
        dispatch({ type: 'SET_VIEWER_STATUS', payload: 'entering' });
        viewerAnimationCtx.onStart();
      };

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
    }, [height, modelChildren, width]);

    /** コントロール用のカメラアニメーションを管理 */
    useLayoutEffect(() => {
      if (modelChildren.length === 0 || !cameraRef.current) return;

      /** カメラ初期位置 */
      previousPositionRef.current = cameraRef.current.position.clone();

      /** カメラ初期アングル */
      previousRotationRef.current = cameraRef.current.rotation.clone();

      /** コントロール用のカメラパラメータを生成（GLB 数値インデックス順） */
      const { configs: cameraConfigs, sortedControls } =
        generateControlsCameraConfigs(
          modelChildren,
          width,
          height,
          content.controls || [],
        );

      /** ソート済み Controls データを親に通知 */
      onControlsSorted(sortedControls);

      /** シーンのバウンディングボックス中心と包容球半径を算出（Arc-Slerp 用） */
      const bbox = new Box3();
      modelChildren.forEach((child) => bbox.expandByObject(child));

      /** シーンの包容球を取得 */
      const sphere = bbox.getBoundingSphere(new Sphere());

      /** シーンの中心座標 */
      const sceneCenter = sphere.center;

      /** シーン中心を Ref に保存（active 遷移時の OrbitControls target 同期で使用） */
      sceneCenterRef.current = sceneCenter.clone();

      /** シーンの包容球半径 */
      const bboxRadius = sphere.radius > 0 ? sphere.radius : 5;

      /** [DEBUG] cameraConfigs の内容確認 */
      if (process.env.NODE_ENV === 'development') {
        console.group('[Camera DEBUG] controlsAnimation 起動');
        console.log(
          'isInitialControl:',
          isInitialControl,
          '/ isStartControls:',
          isStartControls,
          '/ currentIndex:',
          currentIndex,
        );
        console.group('▼ cameraConfigs (GLB 数値順)');
        cameraConfigs.forEach((cfg, i) =>
          console.log(
            `  [${i}] name="${cfg.name}"`,
            cfg.position,
            cfg.rotation,
          ),
        );
        console.groupEnd();
        console.group('▼ sortedControls (GLB 数値順)');
        sortedControls.forEach((c, i) =>
          console.log(`  [${i}] animation_name="${c.animation_name}"`, c),
        );
        console.groupEnd();
        console.groupEnd();
      }

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
        /** カメラアニメーション完了後にモデルアニメーション再生を解禁する */
        onComplete: () => dispatch({ type: 'SET_CAMERA_READY', payload: true }),
      });

      return () => {
        /**
         * 旧アニメーションの tween を即座に停止する。
         * `kill(false)` は対象プロパティ（arcProgress / rotProgress / viewProgress）を
         * 初期値に戻すレンダリングを行わないため、カメラ位置はそのまま維持される。
         * 次の useLayoutEffect で startPos = 現在位置としてキャプチャされるため
         * シームレスな遷移が実現される。
         * （`revert()` は t=0 のレンダリングが走りカメラが始点にスナップするため使用しない）
         */
        ctx.kill(false);
      };
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
      gl.domElement.style.zIndex = viewerStatus === 'active' ? '200' : '20';
    }, [gl, viewerStatus]);

    /**
     * active 遷移時に OrbitControls の target をカメラ現在向きに同期する。
     *
     * OrbitControls は enabled=true になった最初のフレームで
     * camera.position → target(デフォルト 0,0,0) の方向へカメラをスナップさせる。
     * これを防ぐため、target をカメラが実際に向いている方向のシーン中心距離分先に設定し、
     * update() で内部状態を同期してからコントロールを渡す。
     */
    useEffect(() => {
      if (viewerStatus !== 'active' || !cameraRef.current || !controls) return;

      const cam = cameraRef.current;
      const dir = new Vector3();
      cam.getWorldDirection(dir);

      /** カメラからシーン中心までの距離を軌道半径として使用 */
      const dist = cam.position.distanceTo(sceneCenterRef.current);

      const orbitControls = controls as unknown as {
        target: Vector3;
        update: () => void;
      };
      orbitControls.target.copy(cam.position).addScaledVector(dir, dist);
      orbitControls.update();
    }, [cameraRef, controls, viewerStatus]);

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
