'use client';

import React from 'react';
import { PerspectiveCamera as CustomPerspectiveCamera } from '@react-three/drei';
import { PerspectiveCamera } from 'three';
import { WorkDetail } from '@/types/api';
import { ModelChildren } from '@/types/world';
import { BREAK_POINTS } from '@/constants/common';
import useMyCamera from './useMyCamera';

/** Props の型定義 */
type Props = {
  /** cameraRef */
  cameraRef: React.MutableRefObject<PerspectiveCamera>;
  /** setIsNavigationVisible */
  setIsNavigationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  /** modelChildren */
  modelChildren: ModelChildren;
  /** content */
  content: WorkDetail;
};

const MyCamera = ({
  cameraRef,
  setIsNavigationVisible,
  modelChildren,
  content,
}: Props) => {
  const { width } = useMyCamera({
    cameraRef,
    setIsNavigationVisible,
    modelChildren,
    content,
  });

  return (
    <CustomPerspectiveCamera
      ref={cameraRef}
      name="my-camera"
      fov={width < BREAK_POINTS.XS ? 50 : width < BREAK_POINTS.SM ? 45 : 26.9915}
      near={0.1}
      far={200}
      makeDefault
      onUpdate={(c) => c.updateProjectionMatrix()}
    />
  );
};

export default React.memo(MyCamera);
