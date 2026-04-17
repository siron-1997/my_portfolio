import {
  WEATHER_CATEGORY_CLEAR_SKY,
  WEATHER_CATEGORY_THICK_CLOUD,
  WEATHER_CATEGORY_THIN_CLOUD,
  WEATHER_DESCRIPTIONS_CLEAR_SKY,
  WEATHER_DESCRIPTIONS_THICK_CLOUDS,
  WEATHER_DESCRIPTIONS_THIN_CLOUDS,
} from '@/constants/home';

/**
 * 天気カテゴリ。
 * null は未対応の天気（Snow など保留分）を示す。
 */
export type WeatherCategory =
  | typeof WEATHER_CATEGORY_THICK_CLOUD
  | typeof WEATHER_CATEGORY_THIN_CLOUD
  | typeof WEATHER_CATEGORY_CLEAR_SKY
  | null;

/**
 * 天気の説明をカテゴリに分類する処理
 *
 * @param {string | undefined} description - 天気の説明
 * @returns {WeatherCategory} 天気カテゴリ
 */
const getWeatherCategory = (
  description: string | undefined,
): WeatherCategory => {
  if (!description) return null;

  /** 厚い雲の天気説明に一致するか確認 */
  if (
    (WEATHER_DESCRIPTIONS_THICK_CLOUDS as readonly string[]).includes(
      description,
    )
  ) {
    return WEATHER_CATEGORY_THICK_CLOUD;
  }

  /** 薄い雲の天気説明に一致するか確認 */
  if (
    (WEATHER_DESCRIPTIONS_THIN_CLOUDS as readonly string[]).includes(
      description,
    )
  ) {
    return WEATHER_CATEGORY_THIN_CLOUD;
  }

  /** 晴天の天気説明に一致するか確認 */
  if (
    (WEATHER_DESCRIPTIONS_CLEAR_SKY as readonly string[]).includes(description)
  ) {
    return WEATHER_CATEGORY_CLEAR_SKY;
  }

  return null;
};

export default getWeatherCategory;
