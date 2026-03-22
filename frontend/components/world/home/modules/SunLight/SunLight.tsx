import React from 'react';
import { DirectionalLight } from 'three';
import { WeatherItem } from '@/types/api';
import { TimePoint } from '@/types/world';
import useSunLight from './useSunLight';

type Props = {
  weather: WeatherItem[];
  timePoint: TimePoint;
  sunLightRef: React.RefObject<DirectionalLight>;
};

const SunLight = ({ weather, timePoint, sunLightRef }: Props) => {
  const { sunLightColor, sunIntensity, mapSize, halfSize } = useSunLight({
    weather,
    timePoint,
  });

  return (
    <directionalLight
      ref={sunLightRef}
      castShadow
      color={sunLightColor}
      intensity={sunIntensity}
      position={[50, 50, 50]}
      shadow-mapSize={[mapSize, mapSize]}
      shadow-camera-near={1}
      shadow-camera-far={100}
      shadow-camera-left={-halfSize}
      shadow-camera-right={halfSize}
      shadow-camera-top={halfSize}
      shadow-camera-bottom={-halfSize}
      shadow-radius={10}
      shadow-normalBias={0.11}
    />
  );
};

export default React.memo(SunLight);
