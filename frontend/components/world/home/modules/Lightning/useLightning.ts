import { useFrame } from '@react-three/fiber';
import { PointLight } from 'three';
import { WeatherItem } from '@/types/api';
import { LightningState } from '@/types/world';
import { WEATHER_TYPES } from '@/constants/world';

type Props = {
  weather: WeatherItem[];
};

/**
 * HomeWorld の雷のロジックを管理するカスタムフック
 * @param weather - 天気情報
 */
const useLightning = ({ weather }: Props) => {
  const relevantWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  const lightningOccurrence: LightningState = {
    power: () => 0, // 輝度
    positionX: () => 0,
    positionZ: () => 0,
    visible: false,
  };

  let currentPower = 0;

  switch (relevantWeather?.description) {
    // 弱い雷
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
    // 通常の雷
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
    // 強い雷
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

  useFrame((state) => {
    state.scene.children.forEach((child) => {
      // 雷の発生
      if (child.name === 'lightning' && child instanceof PointLight) {
        // 雷の発生確率
        if (Math.random() > 0.93 || child.power > 8000) {
          if (child.power < 5000) {
            child.position.set(
              Math.random() * 40 - 20,
              Math.random() * 20 + 50,
              Math.random() * 40 - 20,
            );
          }
          child.power = lightningOccurrence.power && lightningOccurrence.power(8);
        }
      }
    });
  });

  return lightningOccurrence;
};

export default useLightning;
