'use client';

import React from 'react';

import { DepthOfField,EffectComposer } from '@react-three/postprocessing';

import { MyCamera, MyControls, MyModel } from '@/components/world/work/modules';
import { WORK_WORLD_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import { type WorkDetail } from '@/types/api';

import useExperience from './useExperience';

/** Props の型定義 */
type Props = {
  /** content */
  content: WorkDetail;
};

const Experience = ({ content }: Props) => {
  const {
    ambientLightRef,
    directionalLightRef,
    cameraRef,
    isNavigationVisible,
    setIsNavigationVisible,
    modelChildren,
    setModelChildren,
    width,
  } = useExperience();

  return (
    <>
      <MyCamera
        cameraRef={cameraRef}
        setIsNavigationVisible={setIsNavigationVisible}
        modelChildren={modelChildren}
        content={content}
      />
      <ambientLight
        color={WORK_WORLD_ENV_COLORS.ambientLight}
        intensity={0.6}
        ref={ambientLightRef}
      />
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
      <MyModel
        content={content}
        isNavigationVisible={isNavigationVisible}
        setModelChildren={setModelChildren}
        modelChildren={modelChildren}
      />
      <MyControls />
      <axesHelper args={[10]} visible={false} />
      <EffectComposer>
        {/** 被写界深度の設定 */}
        <DepthOfField
          focusDistance={0}
          focalLength={0.1}
          bokehScale={8}
          height={1080}
        />
      </EffectComposer>
    </>
  );
};

export default Experience;
