import React from 'react';
import { WeatherItem, OpenWeatherCurrentData } from '@/types/api';
import useRain from './useRain';
import s from '@/styles/home/HomeWorld.module.css';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  weather: WeatherItem[];
};

const Rain = ({ currentWeatherData, weather }: Props) => {
  const { windSpeed, canvasRef } = useRain({ currentWeatherData, weather });

  return (
    <div className={s.rain_container}>
      <canvas
        ref={canvasRef}
        className={s.rain_canvas}
        style={{ transform: `rotateZ(${windSpeed}deg)` }}
      />
    </div>
  );
};

export default React.memo(Rain);
