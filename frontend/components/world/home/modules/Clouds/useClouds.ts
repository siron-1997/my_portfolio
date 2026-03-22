import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { RepeatWrapping, MathUtils, Vector3 } from 'three';
import { WeatherItem, OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useIsIos, useWindowSize } from '@/hooks';
import { WEATHER_TYPES } from '@/constants/world';
import { getEnvMapIntensity } from '@/utils/world/home';
import { BREAK_POINTS } from '@/constants/common';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  weather: WeatherItem[];
  timePoint: TimePoint;
};

const useClouds = ({ currentWeatherData, weather, timePoint }: Props) => {
  const isIos = useIsIos();
  const { width = 0 } = useWindowSize();
  const { scene } = useThree();
  const cloudsAll = currentWeatherData?.clouds?.all || 0;

  // 現在の天気を取得
  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  // 圧雲・薄雲テクスチャーの表示切り替え
  let thin = false;
  let thick = false;

  // 天気ごとに雲の表示状態を設定
  switch (currentWeather?.description) {
    // 雨・雷・霧など厚い雲
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
      thick = true;
      break;
    // 曇り（薄い雲）
    case 'few clouds':
    case 'scattered clouds':
    case 'broken clouds':
      thin = true;
      break;
    // 快晴
    case 'clear sky':
      thick = thin = false;
    default:
      break;
  }

  // const { thin, thick } = useMemo(() => setCloudsVisible(currentWeather), [currentWeather]);
  // 環境光の輝度を取得
  const envMapIntensity = useMemo(
    () => getEnvMapIntensity(currentWeather!, timePoint, 'cloud'),
    [currentWeather, timePoint],
  );
  // 薄雲・厚雲用のテクスチャーを読み込み
  const thinTexture = useTexture('/images/textures/thin_cloud.png');
  const thickTexture = useTexture('/images/textures/thick_cloud.png');
  // テクスチャーの wrapS と wrapT を RepeatWrapping に設定
  useMemo(() => {
    thinTexture.wrapS = thinTexture.wrapT = RepeatWrapping;
    thinTexture.repeat.set(1, 1);
    thickTexture.wrapS = thickTexture.wrapT = RepeatWrapping;
    thickTexture.repeat.set(7, 7);
  }, [thinTexture, thickTexture]);

  const clouds = useMemo(
    () => ({
      // 薄雲
      thin: {
        texture: thinTexture,
        // デバイスに応じてスケールを切り替え
        scale: width > BREAK_POINTS.XS ? 1 : 0.9,
        // デバイスに応じて位置を切り替え
        position:
          width > BREAK_POINTS.XS ? new Vector3(0, -0.5, -41) : new Vector3(-5, 18, 10),
        // デバイスに応じて角度を切り替え
        rotation:
          width > BREAK_POINTS.XS
            ? ([MathUtils.degToRad(75), 0, 0] as [number, number, number])
            : ([MathUtils.degToRad(55), 0, MathUtils.degToRad(180)] as [
                number,
                number,
                number,
              ]),
      },
      // 厚雲
      thick: {
        texture: thickTexture,
        // デバイスに応じてスケールを切り替え
        scale: width > BREAK_POINTS.XS ? 1.3 : 2,
        position: new Vector3(0, 5.3, -10),
        rotation: [MathUtils.degToRad(75), 0, MathUtils.degToRad(-90)] as [
          number,
          number,
          number,
        ],
      },
    }),
    [thinTexture, thickTexture, width],
  );

  return {
    isIos,
    width,
    scene,
    cloudsAll,
    thin,
    thick,
    envMapIntensity,
    clouds,
  };
};

export default useClouds;
