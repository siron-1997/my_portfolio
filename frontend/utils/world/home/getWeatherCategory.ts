import {
  WEATHER_DESCRIPTIONS_THICK_CLOUDS,
  WEATHER_DESCRIPTIONS_THIN_CLOUDS,
  WEATHER_DESCRIPTIONS_CLEAR_SKY,
} from '@/constants/world';

/**
 * 天気の視覚的カテゴリ。
 * null は未対応の天気（Drizzle / Snow など保留分）を示す。
 */
export type WeatherCategory = 'thickCloud' | 'thinCloud' | 'clearSky' | null;

/**
 * weather.description を視覚的カテゴリに分類する。
 *
 * 各コンポーネント（SunLight / Clouds / getEnvMapIntensity）で重複していた
 * switch 文を一元化し、未対応 description の追加漏れを防ぐ。
 *
 * @param {string | undefined} description - weather.description の値
 * @returns {WeatherCategory} thickCloud / thinCloud / clearSky / null
 *
 * @example
 * const category = getWeatherCategory('fog'); // 'thickCloud'
 * const category = getWeatherCategory('few clouds'); // 'thinCloud'
 * const category = getWeatherCategory('clear sky'); // 'clearSky'
 * const category = getWeatherCategory(undefined); // null
 */
const getWeatherCategory = (description: string | undefined): WeatherCategory => {
  if (!description) return null;

  if ((WEATHER_DESCRIPTIONS_THICK_CLOUDS as readonly string[]).includes(description)) {
    return 'thickCloud';
  }

  if ((WEATHER_DESCRIPTIONS_THIN_CLOUDS as readonly string[]).includes(description)) {
    return 'thinCloud';
  }

  if ((WEATHER_DESCRIPTIONS_CLEAR_SKY as readonly string[]).includes(description)) {
    return 'clearSky';
  }

  return null;
};

export default getWeatherCategory;
