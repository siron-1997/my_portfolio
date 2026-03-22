import React from 'react';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import useStar from './useStar';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  timePoint: TimePoint;
};

const Star = ({ currentWeatherData, timePoint }: Props) => {
  const { star } = useStar({ currentWeatherData, timePoint });

  return (
    <group renderOrder={1} name="star-container">
      <primitive object={star} />
    </group>
  );
};

export default React.memo(Star);
