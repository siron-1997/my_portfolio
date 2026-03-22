'use client';

import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { MathUtils } from 'three';
import useMyControls from './useMyControls';

const MyControls = () => {
  const { isViewerActive } = useMyControls();

  return (
    <OrbitControls
      enabled={isViewerActive} // コントロール制御の許可
      enablePan={false} // 水平移動の制御
      enableZoom={false} // ズーム移動の制御
      enableDamping={true} // 減衰効果の許可
      dampingFactor={0.07} // 減衰効果の強さ
      minAzimuthAngle={MathUtils.degToRad(-180)} // 最少水平角度を -180deg に制限
      maxAzimuthAngle={MathUtils.degToRad(180)} // 最大水平角度を 180deg に制限
      maxPolarAngle={MathUtils.degToRad(85)} // 最大垂直角度を 90deg に制限
    />
  );
};

export default React.memo(MyControls);
