import { TimePoint } from '@/types/world';
import { WeatherItem } from '@/types/api';
import getWeatherCategory from './getWeatherCategory';

type ModelType = 'model' | 'cloud';

/**
 * 時間帯ごとの環境光強度を返す（type: model/cloud）。
 *
 * @param value - 強度のベース値
 * @param timePoint - 時間帯
 * @param type - モデル種別
 * @returns {number} 補正後の環境光強度
 
 *
 * @example
 * _setTimePointIntensity(value, timePoint, type);
 */
const _setTimePointIntensity = (value: number, timePoint: TimePoint, type: ModelType) => {
  let intensity = 0;

  /** 時間帯ごとにベース値を調整 */
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

/**
 * 天気・時間帯・モデル種別ごとに環境光強度を返す。
 *
 * @param currentWeather - 現在の天気情報
 * @param timePoint - 時間帯
 * @param type - モデル種別
 * @returns {number} 環境光強度
 
 *
 * @example
 * getEnvMapIntensity(currentWeather, timePoint, type);
 */
const getEnvMapIntensity = (
  currentWeather: WeatherItem,
  timePoint: TimePoint,
  type: ModelType,
) => {
  let envMapIntensity = 0;

  /** 天気カテゴリで分岐し、_setTimePointIntensity で時間帯補正を適用 */
  const category = getWeatherCategory(currentWeather.description);

  if (category === 'thickCloud') {
    envMapIntensity = _setTimePointIntensity(
      type === 'model' ? 5.4 : type === 'cloud' ? 1 : 0,
      timePoint,
      type,
    );
  } else if (category === 'thinCloud') {
    envMapIntensity = _setTimePointIntensity(
      type === 'model' ? 8.6 : type === 'cloud' ? 3.0 : 0,
      timePoint,
      type,
    );
  } else if (category === 'clearSky') {
    envMapIntensity = _setTimePointIntensity(type === 'model' ? 8.8 : 0, timePoint, type);
  }
  return envMapIntensity;
};

export default getEnvMapIntensity;
