import { TimePoint } from '@/types/world';
import { WeatherItem } from '@/types/api';

type ModelType = 'model' | 'cloud';

// 時間帯ごとの環境光強度を返す（type: model/cloud）
const _setTimePointIntensity = (value: number, timePoint: TimePoint, type: ModelType) => {
  let intensity = 0;
  // 時間帯ごとにベース値を調整
  switch (timePoint) {
    case 'night':
      intensity = type === 'model' ? value + 6 : type === 'cloud' ? value + 50 : 0;
      break;
    case 'evening':
      intensity = type === 'model' ? value - 2 : type === 'cloud' ? value + 20 : 0;
      break;
    case 'lunch':
      intensity = type === 'model' ? value + 12 : type === 'cloud' ? value + 200 : 0;
      break;
    default:
      break;
  }
  return intensity;
};

// 天気・時間帯・モデル種別ごとに環境光強度を返す
const getEnvMapIntensity = (
  currentWeather: WeatherItem,
  timePoint: TimePoint,
  type: ModelType,
) => {
  let envMapIntensity = 0;
  // 天気ごとにベース値を決定し、_setTimePointIntensityで時間帯補正
  switch (currentWeather.description) {
    // 雨・雷・霧・曇天
    case 'light rain':
    case 'moderate rain':
    case 'heavy intensity rain':
    case 'very heavy rain':
    case 'extreme rain':
    case 'freezing rain':
    case 'light intensity shower rain':
    case 'shower rain':
    case 'heavy intensity shower rain':
    case 'ragged shower rain':
    case 'thunderstorm with light rain':
    case 'thunderstorm with rain':
    case 'thunderstorm with heavy rain':
    case 'thunderstorm with light drizzle':
    case 'thunderstorm with drizzle':
    case 'thunderstorm with heavy drizzle':
    case 'light thunderstorm':
    case 'thunderstorm':
    case 'heavy thunderstorm':
    case 'ragged thunderstorm':
    case 'overcast clouds':
    case 'mist':
      envMapIntensity = _setTimePointIntensity(
        type === 'model' ? 5.4 : type === 'cloud' ? 1 : 0,
        timePoint,
        type,
      );
      break;
    // 曇り
    case 'broken clouds':
    case 'scattered clouds':
    case 'few clouds':
      envMapIntensity = _setTimePointIntensity(
        type === 'model' ? 8.6 : type === 'cloud' ? 3.0 : 0,
        timePoint,
        type,
      );
      break;
    // 快晴
    case 'clear sky':
      envMapIntensity = _setTimePointIntensity(
        type === 'model' ? 8.8 : 0,
        timePoint,
        type,
      );
      break;
    default:
      break;
  }
  return envMapIntensity;
};

export default getEnvMapIntensity;
