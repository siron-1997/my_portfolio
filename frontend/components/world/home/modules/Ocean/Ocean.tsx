import React from 'react';
import { extend, ThreeElement } from '@react-three/fiber';
import { MathUtils } from 'three';
// @ts-expect-error -- three/examples/jsm モジュールに型定義が存在しないため
import { Water } from 'three/examples/jsm/objects/Water';
import { OpenWeatherCurrentData } from '@/types/api';
import useOcean from './useOcean';

extend({ Water });

// TypeScript に water コンポーネントを認識させるための宣言
declare module '@react-three/fiber' {
  interface ThreeElements {
    water: ThreeElement<typeof Water>;
  }
}

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
};

const Ocean = ({ currentWeatherData }: Props) => {
  const { waterRef, geom, config, isVisible } = useOcean({ currentWeatherData });

  return (
    <group name="water" visible={isVisible} position-y={-0.095}>
      <water ref={waterRef} args={[geom, config]} rotation-x={MathUtils.degToRad(-90)} />
    </group>
  );
};

export default React.memo(Ocean);
