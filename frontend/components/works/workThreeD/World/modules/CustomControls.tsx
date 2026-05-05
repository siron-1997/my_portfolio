'use client';

import React from 'react';

import { OrbitControls } from '@react-three/drei';
import type { JSX } from 'react';
import { MathUtils } from 'three';

import { WORK_WORLD_ORBIT_CONTROLS } from '@/constants/workThreeD';
import { type ViewerStatus } from '@/types/contexts';

type Props = {
  /** ビュワーモードの状態 */
  viewerStatus: ViewerStatus;
};

const CustomControls = React.memo(({ viewerStatus }: Props): JSX.Element => {
  return (
    <OrbitControls
      makeDefault
      enabled={viewerStatus === 'active'}
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
