'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ReinhardToneMapping } from 'three';
import { ModelViewerLoading } from '@/components/home';
import { Experience } from '@/components/world/home/Experience';
import { Rain } from '../modules';
import useHomeWorld from './useHomeWorld';
import s from '@/styles/home/HomeWorld.module.css';

const HomeWorld = () => {
  const {
    currentWeatherData,
    weather,
    timePoint,
    setTimePoint,
    isViewerLoading,
    setIsLoading,
    backgroundColor,
  } = useHomeWorld();

  if (isViewerLoading) {
    return (
      <Suspense fallback={<ModelViewerLoading />}>
        <div className={s.home_world}>
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, toneMapping: ReinhardToneMapping }}
            camera={{ fov: 45, near: 0.01, far: 200 }}
            className={s.canvas}
            style={{ background: backgroundColor }}
            onCreated={() => setIsLoading(() => false)}
          >
            <Experience
              currentWeatherData={currentWeatherData}
              weather={weather}
              timePoint={timePoint}
              setTimePoint={setTimePoint}
            />
          </Canvas>
          {/* 雨 */}
          <Rain currentWeatherData={currentWeatherData} weather={weather} />
        </div>
      </Suspense>
    );
  } else {
    return <ModelViewerLoading />;
  }
};

export default React.memo(HomeWorld);
