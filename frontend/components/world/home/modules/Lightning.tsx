import React from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight } from 'three';
import { OpenWeatherCurrentData } from '@/types/api';
import { LightningState } from '@/types/world';
import { COLOR_PALETTE } from '@/constants/colors';
import { DEFAULT_WEATHER, WEATHER_TYPES } from '@/constants/world';

/**
 * Lightning コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 雷ポイントライトへの Ref */
  ref: React.RefObject<PointLight | null>;
};

const Lightning = React.memo(({ currentWeatherData, ref }: Props) => {
  /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
  const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

  /** 現在の天気を取得 */
  const relevantWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  /** 雷の発生状態を初期化 */
  const lightningOccurrence: LightningState = {
    power: () => 0,
    positionX: () => 0,
    positionZ: () => 0,
    visible: false,
  };

  let currentPower = 0;

  /** 天気の種類に応じて雷の強度・位置・可視状態を設定 */
  switch (relevantWeather?.description) {
    /** 弱い雷 */
    case 'thunderstorm with light rain':
    case 'light thunderstorm':
    case 'thunderstorm with light drizzle':
      lightningOccurrence.power = (value) => {
        currentPower = Math.random() * 1000 * value;
        return currentPower >= 5000 ? 5000 : currentPower;
      };
      lightningOccurrence.positionX = (value) => Math.random() * (value * 3) - value / 2;
      lightningOccurrence.positionZ = (value) => Math.random() * (value * 3) - value / 2;
      lightningOccurrence.visible = true;
      break;
    /** 通常の雷 */
    case 'thunderstorm with rain':
    case 'thunderstorm':
    case 'thunderstorm with drizzle':
      lightningOccurrence.power = (value) => {
        currentPower = Math.random() * 1000 * value;
        return currentPower >= 1000 ? 1000 : currentPower;
      };
      lightningOccurrence.positionX = (value) => Math.random() * (value * 2) - value / 2;
      lightningOccurrence.positionZ = (value) => Math.random() * (value * 2) - value / 2;
      lightningOccurrence.visible = true;
      break;
    /** 強い雷 */
    case 'thunderstorm with heavy rain':
    case 'heavy thunderstorm':
    case 'thunderstorm with heavy drizzle':
      lightningOccurrence.power = (value) => Math.random() * 1000 * value;
      lightningOccurrence.positionX = (value) => Math.random() * value - value / 2;
      lightningOccurrence.positionZ = (value) => Math.random() * value - value / 2;
      lightningOccurrence.visible = true;
      break;
    default:
      break;
  }

  /** フレームごとに雷の発生をアニメーション */
  useFrame(() => {
    const light = ref.current;
    if (!light) return;
    /** 確率的に雷を発生させる */
    if (Math.random() > 0.93 || light.power > 8000) {
      if (light.power < 5000) {
        light.position.set(
          Math.random() * 40 - 20,
          Math.random() * 20 + 50,
          Math.random() * 40 - 20,
        );
      }
      light.power = lightningOccurrence.power(8);
    }
  });

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
      ref={ref}
    />
  );
});

Lightning.displayName = 'Lightning';

export default Lightning;
