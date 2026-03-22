import React from 'react';
import { WeatherItem } from '@/types/api';
import { TimePoint } from '@/types/world';
import useModel from './useModel';

type Props = {
  weather: WeatherItem[];
  timePoint: TimePoint;
};

const Model = ({ weather, timePoint }: Props) => {
  const { model } = useModel({ weather, timePoint });

  return (
    <group renderOrder={0} name="mountain">
      <primitive object={model.scene} />
    </group>
  );
};

export default React.memo(Model);
