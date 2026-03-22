'use client';

import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { PointLight } from 'three';
import { WeatherItem } from '@/types/api';
import { TimePoint } from '@/types/world';
import { WEATHER_TYPES } from '@/constants/world';
import { getEnvMapIntensity } from '@/utils/world/home';

type Props = {
  weather: WeatherItem[];
  timePoint: TimePoint;
};

const useDoor = ({ weather, timePoint }: Props) => {
  const pointLightRef = useRef<PointLight>(null!);
  const { nodes } = useGLTF('/models/gltf/door.glb');
  const { scene } = useThree();

  const groupScale = 0.02;
  const meshScale = 0.1;
  const meshAngle = 90;

  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  // 環境マップを取得
  const environment = scene.environment;
  // 環境光の輝度を取得
  const envMapIntensity = getEnvMapIntensity(currentWeather!, timePoint, 'model');

  return {
    pointLightRef,
    nodes,
    environment,
    envMapIntensity,
    groupScale,
    meshScale,
    meshAngle,
  };
};

export default useDoor;
