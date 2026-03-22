import { WeatherItem } from '@/types/api';
import { TimePoint, TimePointSkyColor } from '@/types/world';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { WEATHER_TYPES } from '@/constants/world';

type Props = {
  weather: WeatherItem[];
  timePoint: TimePoint;
};

/**
 * HomeWorld の太陽光の計算ロジックを管理するカスタムフック
 * @param weather - 天気情報の配列
 * @param timePoint - 時間帯
 */
const useSunLight = ({ weather, timePoint }: Props) => {
  const mapSize = 512;
  const halfSize = 20;

  // 現在の天気を取得
  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  let sunLightColor = '';
  let sunIntensity = 0;

  // 時間帯ごとにTIME_POINT_ENV_COLORSから色セットを選択し、天気ごとの色を取得
  switch (timePoint) {
    case 'evening':
      sunLightColor = _setCurrentWeatherColor(
        currentWeather,
        TIME_POINT_ENV_COLORS.evening,
      );
      break;
    case 'night':
      sunLightColor = _setCurrentWeatherColor(
        currentWeather,
        TIME_POINT_ENV_COLORS.night,
      );
      break;
    case 'lunch':
      sunLightColor = _setCurrentWeatherColor(
        currentWeather,
        TIME_POINT_ENV_COLORS.lunch,
      );
      break;
    default:
      break;
  }

  // 天気ごとにベース値を決定し、_setTimePointIntensityで時間帯補正
  switch (currentWeather?.description) {
    // 雨・雷・霧
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
      sunIntensity = _setTimePointIntensity(2.2, timePoint);
      break;
    // 曇り
    case 'broken clouds':
      sunIntensity = _setTimePointIntensity(2.6, timePoint);
      break;
    case 'scattered clouds':
      sunIntensity = _setTimePointIntensity(3.0, timePoint);
      break;
    case 'few clouds':
      sunIntensity = _setTimePointIntensity(3.4, timePoint);
      break;
    // 快晴
    case 'clear sky':
      sunIntensity = _setTimePointIntensity(3.6, timePoint);
      break;
    default:
      break;
  }

  return { sunLightColor, sunIntensity, mapSize, halfSize };
};

// 天気・時間帯ごとに太陽光の色を返す
// - 天気ごとの色を取得し、時間帯ごとにTIME_POINT_ENV_COLORSから色セットを選択
const _setCurrentWeatherColor = (
  currentWeather: WeatherItem | undefined,
  timePointColor: TimePointSkyColor,
): string => {
  let color = '';
  // 天気ごとに色を決定
  switch (currentWeather?.description) {
    // 雨・雷・霧
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
      color = timePointColor.thickCloud;
      break;
    // 曇り
    case 'few clouds':
    case 'scattered clouds':
    case 'broken clouds':
      color = timePointColor.thinCloud;
      break;
    // 快晴
    case 'clear sky':
      color = timePointColor.clearSky;
      break;
    default:
      break;
  }
  return color;
};

// 時間帯ごとの太陽光強度を返す（天気・時間帯ごとに調整）
const _setTimePointIntensity = (value: number, timePoint: TimePoint): number => {
  let intensity = 0;
  // 時間帯によって輝度を調整
  switch (timePoint) {
    case 'evening':
      intensity = value - 0.0;
      break;
    case 'night':
      intensity = value + 0.6;
      break;
    case 'lunch':
      intensity = value - 0.8;
      break;
    default:
      break;
  }
  return intensity;
};

export default useSunLight;
