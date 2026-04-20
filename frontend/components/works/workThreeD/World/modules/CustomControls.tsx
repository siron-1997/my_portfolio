'use client';

import React from 'react';
import type { JSX } from 'react';

import { OrbitControls } from '@react-three/drei';
import { MathUtils } from 'three';

import { WORK_WORLD_ORBIT_CONTROLS } from '@/constants/workThreeD';

type Props = {
  /** ビュワーアクティブフラグ */
  isViewerActive: boolean;
};

const CustomControls = React.memo(({ isViewerActive }: Props): JSX.Element => {
  return (
    <OrbitControls
      enabled={isViewerActive}
      enablePan={false}
      enableZoom={false}
      enableDamping={true}
      dampingFactor={WORK_WORLD_ORBIT_CONTROLS.dampingFactor}
      minAzimuthAngle={MathUtils.degToRad(
        WORK_WORLD_ORBIT_CONTROLS.minAzimuthAngleDeg,
      )}
      maxAzimuthAngle={MathUtils.degToRad(
        WORK_WORLD_ORBIT_CONTROLS.maxAzimuthAngleDeg,
      )}
      maxPolarAngle={MathUtils.degToRad(
        WORK_WORLD_ORBIT_CONTROLS.maxPolarAngleDeg,
      )}
    />
  );
});

CustomControls.displayName = 'CustomControls';

export default CustomControls;
