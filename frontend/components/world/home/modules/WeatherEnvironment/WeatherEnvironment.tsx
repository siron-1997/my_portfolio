import React from 'react';
import { Environment } from '@react-three/drei';
import { BackSide } from 'three';
import { TimePoint } from '@/types/world';
import useWeatherEnvironment from './useWeatherEnvironment';

type Props = {
  timePoint: TimePoint;
};

const WeatherEnvironment = ({ timePoint }: Props) => {
  const { preset } = useWeatherEnvironment({ timePoint });

  return (
    <Environment background={true}>
      <mesh name="env cube">
        <boxGeometry args={[200, 200, 200]} />
        <meshBasicMaterial
          color={preset}
          side={BackSide}
          transparent={true}
          opacity={0.2}
        />
      </mesh>
    </Environment>
  );
};

export default React.memo(WeatherEnvironment);
