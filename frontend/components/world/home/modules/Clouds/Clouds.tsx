import React from 'react';
import { FrontSide, Mesh } from 'three';
import { WeatherItem, OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { BREAK_POINTS } from '@/constants/common';
import useClouds from './useClouds';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  weather: WeatherItem[];
  timePoint: TimePoint;
  thinCloudRef: React.RefObject<Mesh>;
  thickCloudRef: React.RefObject<Mesh>;
};

const Clouds = ({
  currentWeatherData,
  weather,
  timePoint,
  thinCloudRef,
  thickCloudRef,
}: Props) => {
  const { isIos, width, scene, cloudsAll, thin, thick, envMapIntensity, clouds } =
    useClouds({ currentWeatherData, weather, timePoint });

  return (
    <group name="clouds" renderOrder={2}>
      {/* 薄雲 */}
      <mesh
        ref={thinCloudRef}
        scale={clouds.thin.scale}
        position={clouds.thin.position}
        rotation={clouds.thin.rotation}
        visible={thin}
        name="thin cloud"
      >
        <planeGeometry args={[85, 85]} />
        <meshStandardMaterial
          map={clouds.thin.texture}
          side={FrontSide}
          transparent={true}
          opacity={isIos ? cloudsAll / 100 : cloudsAll / 100}
          envMap={scene.environment}
          envMapIntensity={
            width > BREAK_POINTS.XS ? envMapIntensity : envMapIntensity + 20
          }
          depthTest={true}
          depthWrite={true}
        />
      </mesh>
      {/* 厚雲 */}
      <mesh
        ref={thickCloudRef}
        scale={clouds.thick.scale}
        position={clouds.thick.position}
        rotation={clouds.thick.rotation}
        visible={thick}
        name="thick cloud"
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          map={clouds.thick.texture}
          side={FrontSide}
          transparent={true}
          opacity={isIos ? cloudsAll : cloudsAll / 110}
          envMap={scene.environment}
          envMapIntensity={envMapIntensity}
          depthTest={true}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
};

export default React.memo(Clouds);
