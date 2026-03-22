'use client';

import React from 'react';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import { MyCamera, MyControls, MyModel } from '@/components/world/work/modules';
import { WorkDetail } from '@/types/api';
import { WORK_WORLD_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import useExperience from './useExperience';

type Props = {
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
        <DepthOfField
          focusDistance={0} // ピントが合うカメラからの距離
          focalLength={0.1} // 焦点距離（ボケの強さに影響）
          bokehScale={8} // ボケの大きさ
          height={1080} // エフェクトの解像度
        />
      </EffectComposer>
    </>
  );
};

export default Experience;
