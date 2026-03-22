import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  WeatherItem,
  OpenWeatherCurrentData,
  GetCurrentWeatherAPIResponse,
} from '@/types/api';
import { TimePoint } from '@/types/world';
import { useHomeContext } from '@/contexts/homeContext';
import { useGeolocation } from '@/hooks';
import { DEFAULT_WEATHER } from '@/constants/world';
import { DEFAULT_COORDINATES } from '@/constants/common';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';

/**
 * HomeWorld
 * - 天気情報の取得
 * - 時間帯・天気状態の管理
 * - ビューワーローディング状態の管理
 */
const useHomeWorld = () => {
  // 現在の天気データ
  const [currentWeatherData, setCurrentWeatherData] =
    useState<OpenWeatherCurrentData | null>(null);
  // 天気情報リスト
  const [weather, setWeather] = useState<WeatherItem[]>(DEFAULT_WEATHER);
  // 時間帯
  const [timePoint, setTimePoint] = useState<TimePoint>('night');
  // ビューワーローディング状態
  const [isViewerLoading, setIsViewerLoading] = useState<boolean>(false);

  // HomeContextからローディング制御関数を取得
  const { setIsLoading } = useHomeContext();
  // 位置情報取得フック
  const { coordinates, isPermissionHandled } = useGeolocation(DEFAULT_COORDINATES);

  // 背景色を時間帯に応じて設定
  let backgroundColor = '';
  switch (timePoint) {
    case 'evening':
      backgroundColor = TIME_POINT_ENV_COLORS.evening.background;
      break;
    case 'night':
      backgroundColor = TIME_POINT_ENV_COLORS.night.background;
      break;
    case 'lunch':
      backgroundColor = TIME_POINT_ENV_COLORS.lunch.background;
      break;
    default:
      break;
  }

  // 天気情報取得副作用
  useEffect(() => {
    const getCurrentWeather = async () => {
      try {
        // 現在の天気情報をAPIから取得
        const res = await axios.post(
          '/api/getCurrentWeather',
          {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
          {
            headers: {
              'Cache-Control': 'max-age=3600',
            },
          },
        );
        if (res.data.success) {
          const data: GetCurrentWeatherAPIResponse = res.data;
          setCurrentWeatherData(data.data.data); // 現在の天気データを設定
          setTimePoint(data.data.timePoint); // 時間帯を設定
          setWeather(data.data.data.weather); // 天気情報を設定
        } else {
          console.error('API response error:', res.data.message);
        }
      } catch (error) {
        console.error('current weather data error', error);
      } finally {
        setIsViewerLoading(true);
      }
    };
    // 位置情報の共有操作が完了した後に天気情報を取得
    if (isPermissionHandled) {
      getCurrentWeather();
    }
  }, [isPermissionHandled, coordinates.latitude, coordinates.longitude]);

  // 必要な値・関数を返す
  return {
    currentWeatherData,
    weather,
    timePoint,
    setTimePoint,
    isViewerLoading,
    setIsLoading,
    backgroundColor,
  };
};

export default useHomeWorld;
