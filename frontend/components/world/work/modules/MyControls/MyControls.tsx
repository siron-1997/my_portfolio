'use client';

import React from 'react';

import { OrbitControls } from '@react-three/drei';
import { MathUtils } from 'three';

import useMyControls from './useMyControls';

const MyControls = () => {
  const { isViewerActive } = useMyControls();

  return (
    /** ビューワーモード時のみ OrbitControls を有効化 */
    <OrbitControls
      enabled={isViewerActive}
      enablePan={false}
      enableZoom={false}
      enableDamping={true}
      dampingFactor={0.07}
      minAzimuthAngle={MathUtils.degToRad(-180)}
      maxAzimuthAngle={MathUtils.degToRad(180)}
      maxPolarAngle={MathUtils.degToRad(85)}
    />
  );
};

export default React.memo(MyControls);
