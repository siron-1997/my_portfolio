import React from 'react';
import { Fog as ThreeFog } from 'three';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { BREAK_POINTS } from '@/constants/common';
import useFog from './useFog';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  timePoint: TimePoint;
  fogRef: React.RefObject<ThreeFog>;
};

const Fog = ({ currentWeatherData, timePoint, fogRef }: Props) => {
  const { width, fogColor, humidity } = useFog({ currentWeatherData, timePoint });

  return (
    <fog
      ref={fogRef}
      attach="fog"
      args={[
        fogColor,
        width! > BREAK_POINTS.XS ? 4 : 5,
        width! > BREAK_POINTS.XS ? 140 - humidity : 160 - humidity,
      ]}
      color={fogColor}
      // 湿度に応じて霧の最少距離を制御
      near={width! > BREAK_POINTS.XS ? 4 : 5}
      // 湿度に応じて霧の最大距離を制御
      far={width! > BREAK_POINTS.XS ? 140 - humidity : 160 - humidity}
    />
  );
};

export default React.memo(Fog);
