import React from 'react';
import { PointLight } from 'three';
import { WeatherItem } from '@/types/api';
import { COLOR_PALETTE } from '@/constants/colors';
import useLightning from './useLightning';

type Props = {
  weather: WeatherItem[];
  lightningRef: React.RefObject<PointLight>;
};

const Lightning = ({ weather, lightningRef }: Props) => {
  const lightningOccurrence = useLightning({ weather });

  return (
    <pointLight
      color={COLOR_PALETTE.lightning}
      intensity={800000}
      distance={80}
      decay={2}
      position={[-20, 70, -10]}
      name="lightning"
      visible={lightningOccurrence.visible}
      castShadow
      ref={lightningRef}
    />
  );
};

export default React.memo(Lightning);
