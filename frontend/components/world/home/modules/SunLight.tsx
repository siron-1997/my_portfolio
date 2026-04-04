import React from 'react';
import { DirectionalLight } from 'three';

import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { DEFAULT_WEATHER, WEATHER_TYPES } from '@/constants/world';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint, TimePointSkyColor } from '@/types/world';
import { getWeatherCategory, WeatherCategory } from '@/utils/world/home';

/**
 * SunLight コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** 太陽光の参照 Ref */
  ref: React.RefObject<DirectionalLight | null>;
};

const SunLight = React.memo(({ currentWeatherData, timePoint, ref }: Props) => {
  const mapSize = 512;
  const halfSize = 20;

  /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
  const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

  /** 現在の天気を取得 */
  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  let sunIntensity = 0;

  /** 天気カテゴリを取得 */
  const weatherCategory = getWeatherCategory(currentWeather?.description);

  /** 時間帯ごとに TIME_POINT_ENV_COLORS から色セットを選択し、天気カテゴリから色を取得 */
  const sunLightColor = _setCurrentWeatherColor(
    weatherCategory,
    TIME_POINT_ENV_COLORS[timePoint],
  );

  /** thickCloud は一括処理、thinCloud は段階別に強度を設定 */
  if (weatherCategory === 'thickCloud') {
    sunIntensity = _setTimePointIntensity(2.2, timePoint);
  } else {
    switch (currentWeather?.description) {
      /** 曇り（段階別） */
      case 'broken clouds':
        sunIntensity = _setTimePointIntensity(2.6, timePoint);
        break;
      case 'scattered clouds':
        sunIntensity = _setTimePointIntensity(3.0, timePoint);
        break;
      case 'few clouds':
        sunIntensity = _setTimePointIntensity(3.4, timePoint);
        break;
      /** 快晴 */
      case 'clear sky':
        sunIntensity = _setTimePointIntensity(3.6, timePoint);
        break;
      default:
        break;
    }
  }

  return (
    <directionalLight
      ref={ref}
      castShadow
      color={sunLightColor}
      intensity={sunIntensity}
      position={[50, 50, 50]}
      shadow-mapSize={[mapSize, mapSize]}
      shadow-camera-near={1}
      shadow-camera-far={100}
      shadow-camera-left={-halfSize}
      shadow-camera-right={halfSize}
      shadow-camera-top={halfSize}
      shadow-camera-bottom={-halfSize}
      shadow-radius={10}
      shadow-normalBias={0.11}
    />
  );
});

SunLight.displayName = 'SunLight';

export default SunLight;

/**
 * 天気カテゴリと時間帯から太陽光の色を返す。
 * getWeatherCategory の戻り値で分岐するため、未対応 description に追従しない。
 *
 * @param {WeatherCategory} category - 天気カテゴリ（getWeatherCategory の戻り値）
 * @param {TimePointSkyColor} timePointColor - 時間帯ごとの色セット
 * @returns {string} 太陽光の色
 */
const _setCurrentWeatherColor = (
  category: WeatherCategory,
  timePointColor: TimePointSkyColor,
): string => {
  if (category === 'thickCloud') return timePointColor.thickCloud;
  if (category === 'thinCloud') return timePointColor.thinCloud;
  if (category === 'clearSky') return timePointColor.clearSky;
  return '';
};

/**
 * 時間帯ごとの太陽光強度を返す。
 *
 * @param {number} value - 天気種別のベース値
 * @param {TimePoint} timePoint - 時間帯
 * @returns {number} 時間帯補正後の強度
 */
const _setTimePointIntensity = (value: number, timePoint: TimePoint): number => {
  /** 時間帯によって輝度を調整 */
  switch (timePoint) {
    case 'evening':
      return value;
    case 'night':
      return value + 0.6;
    case 'lunch':
      return value - 0.8;
    default:
      return 0;
  }
};
