'use client';

import React from 'react';
import { BakeShadows } from '@react-three/drei';
import {
  Clouds,
  Door,
  Fog,
  Lightning,
  Model,
  Ocean,
  RigCamera,
  Star,
  SunLight,
  WeatherEnvironment,
} from '@/components/world/home/modules';
import { WeatherItem, OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import useExperience from './useExperience';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  weather: WeatherItem[];
  timePoint: TimePoint;
  setTimePoint: React.Dispatch<React.SetStateAction<TimePoint>>;
};

const Experience = ({ currentWeatherData, weather, timePoint, setTimePoint }: Props) => {
  const { doorRef, sunLightRef, lightningRef, fogRef, thinCloudRef, thickCloudRef } =
    useExperience({ setTimePoint });

  return (
    <>
      {/* 薄曇、散在雲、切雲、厚雲のとき追加。曇り度によって透明度を制御 */}
      <WeatherEnvironment timePoint={timePoint} />
      {/* 霧 */}
      <Fog
        currentWeatherData={currentWeatherData}
        timePoint={timePoint}
        fogRef={fogRef}
      />
      {/* 太陽 */}
      <SunLight weather={weather} timePoint={timePoint} sunLightRef={sunLightRef} />
      {/* メイン */}
      <group name="models">
        {/* 薄曇、散在雲、切雲、厚雲、晴れ、雨の状態によって環境光の輝度を制御 */}
        <Model weather={weather} timePoint={timePoint} />
        {/* ドア */}
        <Door weather={weather} timePoint={timePoint} doorRef={doorRef} />
        {/* 雨の時、シーンに追加 */}
        <Ocean currentWeatherData={currentWeatherData} />
      </group>
      {/* 星 */}
      <Star currentWeatherData={currentWeatherData} timePoint={timePoint} />
      {/* 薄曇、散在雲、切雲のときはBrokenCloudでそれ以外はCloud */}
      <Clouds
        currentWeatherData={currentWeatherData}
        weather={weather}
        timePoint={timePoint}
        thinCloudRef={thinCloudRef}
        thickCloudRef={thickCloudRef}
      />
      {/* 雷 */}
      <Lightning weather={weather} lightningRef={lightningRef} />
      {/* カメラ */}
      <RigCamera doorRef={doorRef} />
      {/* シャドウベイク */}
      <BakeShadows />
    </>
  );
};

export default React.memo(Experience);
