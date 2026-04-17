import {
  ENV_MAP_MODEL_TYPE_CLOUD,
  ENV_MAP_MODEL_TYPE_MODEL,
  WEATHER_CATEGORY_CLEAR_SKY,
  WEATHER_CATEGORY_THICK_CLOUD,
  WEATHER_CATEGORY_THIN_CLOUD,
} from '@/constants/home';
import { type TimePoint } from '@/types/api';
import { type WeatherItem } from '@/types/api';

import getWeatherCategory from './getWeatherCategory';

type ModelType =
  | typeof ENV_MAP_MODEL_TYPE_MODEL
  | typeof ENV_MAP_MODEL_TYPE_CLOUD;

/**
 * 時間帯ごとの環境光強度を返す処理（type: model/cloud）
 *
 * @param value - 強度のベース値
 * @param timePoint - 時間帯
 * @param type - モデル種別
 * @returns {number} 補正後の環境光強度
 */
const _setTimePointIntensity = (
  value: number,
  timePoint: TimePoint,
  type: ModelType,
): number => {
  switch (timePoint) {
    case 'night':
      return type === ENV_MAP_MODEL_TYPE_MODEL
        ? value + 6
        : type === ENV_MAP_MODEL_TYPE_CLOUD
          ? value + 50
          : 0;
    case 'evening':
      return type === ENV_MAP_MODEL_TYPE_MODEL
        ? value - 2
        : type === ENV_MAP_MODEL_TYPE_CLOUD
          ? value + 20
          : 0;
    case 'lunch':
      return type === ENV_MAP_MODEL_TYPE_MODEL
        ? value + 12
        : type === ENV_MAP_MODEL_TYPE_CLOUD
          ? value + 200
          : 0;
  }
};

/**
 * 天気・時間帯・モデル種別ごとに環境光強度を返す処理
 *
 * @param currentWeather - 現在の天気情報
 * @param timePoint - 時間帯
 * @param type - モデル種別
 * @returns {number} 環境光強度
 */
const getEnvMapIntensity = (
  currentWeather: WeatherItem,
  timePoint: TimePoint,
  type: ModelType,
): number => {
  /** 天気カテゴリを取得 */
  const category = getWeatherCategory(currentWeather.description);

  /** 天気カテゴリに応じて環境光強度を設定 */
  switch (category) {
    case WEATHER_CATEGORY_THICK_CLOUD:
      return _setTimePointIntensity(
        type === ENV_MAP_MODEL_TYPE_MODEL
          ? 5.4
          : type === ENV_MAP_MODEL_TYPE_CLOUD
            ? 1
            : 0,
        timePoint,
        type,
      );
    case WEATHER_CATEGORY_THIN_CLOUD:
      return _setTimePointIntensity(
        type === ENV_MAP_MODEL_TYPE_MODEL
          ? 8.6
          : type === ENV_MAP_MODEL_TYPE_CLOUD
            ? 3.0
            : 0,
        timePoint,
        type,
      );
    case WEATHER_CATEGORY_CLEAR_SKY:
      return _setTimePointIntensity(
        type === ENV_MAP_MODEL_TYPE_MODEL ? 8.8 : 0,
        timePoint,
        type,
      );
    default:
      return 0;
  }
};

export default getEnvMapIntensity;
