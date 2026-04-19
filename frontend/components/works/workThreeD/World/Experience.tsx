'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { JSX } from 'react';

import { DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { useCubeTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import {
  type AmbientLight,
  type DirectionalLight,
  type PerspectiveCamera,
} from 'three';

import type { WorldProps } from '@/components/works/workThreeD/World';
import {
  CustomModel,
  CustomCamera,
  CustomControls,
} from '@/components/works/workThreeD/World/modules';
import { WORK_WORLD_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS, IS_DEV } from '@/constants/common';
import {
  DEBUG_AMBIENT_LIGHT_PARAMS,
  DEBUG_CAMERA_PARAMS,
  DEBUG_DIRECTIONAL_LIGHT_PARAMS,
} from '@/constants/workThreeD';
import { useWindowSize } from '@/hooks';
import { type ModelChildren } from '@/types/world';

type Props = WorldProps;

const Experience = React.memo(
  ({
    content,
    isInitialControl,
    isStartControls,
    isViewerActive,
    isLoading,
    currentIndex,
    dispatch,
    portalRef,
    introductionRef,
    controlsRef,
    toggleButtonRef,
  }: Props): JSX.Element => {
    /** 環境光の参照 Ref */
    const ambientLightRef = useRef<AmbientLight | null>(null);

    /** 太陽光の参照 Ref */
    const directionalLightRef = useRef<DirectionalLight | null>(null);

    /** カメラの参照 Ref */
    const cameraRef = useRef<PerspectiveCamera | null>(null);

    /** ナビゲーションの表示フラグの状態 */
    const [isNavigationVisible, setIsNavigationVisible] =
      useState<boolean>(false);

    /** モデルの子要素 */
    const [modelChildren, setModelChildren] = useState<ModelChildren>([]);

    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** Three.js のシーンオブジェクトを取得 */
    const scene = useThree((state) => state.scene);

    /** キューブマップを設定 */
    const cubeTexture = useCubeTexture(
      ['px.webp', 'nx.webp', 'py.webp', 'ny.webp', 'pz.webp', 'nz.webp'],
      { path: '/images/maps/workWorld/' },
    );

    /** カメラパラメータ（開発環境デバッグ用 leva コントロール） */
    const {
      fov,
      near,
      far,
      camPosX,
      camPosY,
      camPosZ,
      camRotX,
      camRotY,
      camRotZ,
    } = useControls('カメラ', {
      fov: {
        value: DEBUG_CAMERA_PARAMS.fov,
        min: 0,
        max: 100,
        label: '視野角',
      },
      near: {
        value: DEBUG_CAMERA_PARAMS.near,
        min: 0,
        max: 100,
        label: '近さ',
      },
      far: { value: DEBUG_CAMERA_PARAMS.far, min: 0, max: 200, label: '遠さ' },
      位置: folder({
        camPosX: {
          value: DEBUG_CAMERA_PARAMS.position.x,
          min: -50,
          max: 50,
          label: 'x',
        },
        camPosY: {
          value: DEBUG_CAMERA_PARAMS.position.y,
          min: -20,
          max: 30,
          label: 'y',
        },
        camPosZ: {
          value: DEBUG_CAMERA_PARAMS.position.z,
          min: -40,
          max: 40,
          label: 'z',
        },
      }),
      回転: folder({
        camRotX: {
          value: DEBUG_CAMERA_PARAMS.rotation.x,
          min: -Math.PI,
          max: Math.PI,
          label: 'x',
        },
        camRotY: {
          value: DEBUG_CAMERA_PARAMS.rotation.y,
          min: -Math.PI,
          max: Math.PI,
          label: 'y',
        },
        camRotZ: {
          value: DEBUG_CAMERA_PARAMS.rotation.z,
          min: -Math.PI,
          max: Math.PI,
          label: 'z',
        },
      }),
    });

    /** 環境光パラメータ（開発環境デバッグ用 leva コントロール） */
    const { ambientColor, ambientIntensity } = useControls(
      '環境光 (Ambient Light)',
      {
        ambientColor: {
          value: DEBUG_AMBIENT_LIGHT_PARAMS.color,
          label: '配色',
        },
        ambientIntensity: {
          value: DEBUG_AMBIENT_LIGHT_PARAMS.intensity,
          min: 0,
          max: 10,
          label: '光強度',
        },
      },
    );

    /** 太陽光パラメータ（開発環境デバッグ用 leva コントロール） */
    const { directionalColor, directionalIntensity } = useControls(
      '太陽光 (Directional Light)',
      {
        directionalColor: {
          value: DEBUG_DIRECTIONAL_LIGHT_PARAMS.color,
          label: '配色',
        },
        directionalIntensity: {
          value: DEBUG_DIRECTIONAL_LIGHT_PARAMS.intensity,
          min: 0,
          max: 100000,
          label: '光強度',
        },
      },
    );

    /** Three.js のシーンオブジェクトへ環境マップを適用する */
    useEffect(() => {
      scene.environment = cubeTexture;
      scene.background = cubeTexture;
      scene.environmentIntensity = 0.5;
    }, [cubeTexture, scene]);

    /** カメラの leva コントロール値を Three.js オブジェクトへ同期する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV || !cameraRef.current) return;
      cameraRef.current.fov = fov;
      cameraRef.current.near = near;
      cameraRef.current.far = far;
      cameraRef.current.position.set(camPosX, camPosY, camPosZ);
      cameraRef.current.rotation.set(camRotX, camRotY, camRotZ);
      cameraRef.current.updateProjectionMatrix();
    }, [fov, near, far, camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ]);

    /** 環境光の leva コントロール値を Three.js オブジェクトへ同期する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV || !ambientLightRef.current) return;
      ambientLightRef.current.color.set(ambientColor);
      ambientLightRef.current.intensity = ambientIntensity;
    }, [ambientColor, ambientIntensity]);

    /** 太陽光の leva コントロール値を Three.js オブジェクトへ同期する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV || !directionalLightRef.current) return;
      directionalLightRef.current.color.set(directionalColor);
      directionalLightRef.current.intensity = directionalIntensity;
    }, [directionalColor, directionalIntensity]);

    return (
      <>
        {/* カスタムカメラ */}
        <CustomCamera
          cameraRef={cameraRef}
          setIsNavigationVisible={setIsNavigationVisible}
          modelChildren={modelChildren}
          content={content}
          portalRef={portalRef}
          introductionRef={introductionRef}
          controlsRef={controlsRef}
          toggleButtonRef={toggleButtonRef}
          isInitialControl={isInitialControl}
          isStartControls={isStartControls}
          isViewerActive={isViewerActive}
          currentIndex={currentIndex}
          dispatch={dispatch}
        />

        {/* 環境光 */}
        <ambientLight
          color={WORK_WORLD_ENV_COLORS.ambientLight}
          intensity={0.6}
          ref={ambientLightRef}
        />

        {/* 平行光源 */}
        <directionalLight
          color={WORK_WORLD_ENV_COLORS.directionalLight}
          intensity={1.5}
          position={[-4, 15, -8]}
          ref={directionalLightRef}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={30}
          shadow-camera-left={-1}
          shadow-camera-right={1}
          shadow-camera-top={1}
          shadow-camera-bottom={-1}
          shadow-bias={-0.0005}
        />

        {/* 霧 */}
        <fog
          attach="fog"
          args={[
            WORK_WORLD_ENV_COLORS.fog,
            width! > BREAK_POINTS.SM ? 4 : 3,
            width! > BREAK_POINTS.SM ? 12 : 11,
          ]}
          color={WORK_WORLD_ENV_COLORS.fog}
          near={width! > BREAK_POINTS.SM ? 4 : 3}
          far={width! > BREAK_POINTS.SM ? 12 : 11}
        />

        <CustomModel
          content={content}
          isNavigationVisible={isNavigationVisible}
          setModelChildren={setModelChildren}
          modelChildren={modelChildren}
          isInitialControl={isInitialControl}
          isStartControls={isStartControls}
          currentIndex={currentIndex}
          dispatch={dispatch}
        />

        {/* カスタムコントロール */}
        <CustomControls isViewerActive={isViewerActive} />

        <axesHelper args={[10]} visible={false} />

        {/** Canvas 作成完了（isLoading = false）後に EffectComposer を描画する。
         *   WebGL コンテキストが安定する前に addPass が呼ばれるエラーを防ぐ。 */}
        {!isLoading && (
          <EffectComposer>
            {/** 被写界深度の設定 */}
            <DepthOfField
              focusDistance={0}
              focalLength={0.1}
              bokehScale={8}
              height={1080}
            />
          </EffectComposer>
        )}
      </>
    );
  },
);

Experience.displayName = 'Experience';

export default Experience;
