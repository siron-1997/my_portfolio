import React from 'react';
import { CameraShake } from '@react-three/drei';
import { Group } from 'three';
import useRigCamera from './useRigCamera';

type Props = {
  doorRef: React.RefObject<Group>;
};

const RigCamera = ({ doorRef }: Props) => {
  const { cameraContainerRef } = useRigCamera({ doorRef });

  return (
    <group name="camera-container" ref={cameraContainerRef}>
      <CameraShake
        maxYaw={0.01}
        maxPitch={0.01}
        maxRoll={0.01}
        yawFrequency={0.2}
        pitchFrequency={0.2}
      />
    </group>
  );
};

export default React.memo(RigCamera);
