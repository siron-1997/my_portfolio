import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useMemo, useEffect } from 'react';
import { FrontSide, Mesh, RepeatWrapping, MathUtils, Vector3 } from 'three';

import { BREAK_POINTS } from '@/constants/common';
import { DEFAULT_WEATHER, WEATHER_TYPES } from '@/constants/world';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useIsIos, useWindowSize } from '@/hooks';
import {
  getEnvMapIntensity,
  getWeatherCategory,
  WeatherCategory,
} from '@/utils/world/home';

type CloudConfig = {
  /** デバイスに応じたスケール */
  scale: number;

  /** デバイスに応じた位置 */
  position: Vector3 | [number, number, number];

  /** デバイスに応じた角度（ラジアン） */
  rotation: [number, number, number];
};

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** 薄雲テクスチャを適用するメッシュへの Ref */
  thinCloudRef: React.RefObject<Mesh | null>;

  /** 厚雲テクスチャを適用するメッシュへの Ref */
  thickCloudRef: React.RefObject<Mesh | null>;
};

/** 厚雲の最大不透明度を約 91% に抑えるための除数（iOS 以外で使用） */
const THICK_CLOUD_OPACITY_DIVISOR = 110;

/** 薄雲テクスチャーのファイルパス */
const THIN_CLOUD_TEXTURE = '/images/textures/thin_cloud.png';

/** 厚雲テクスチャーのファイルパス */
const THICK_CLOUD_TEXTURE = '/images/textures/thick_cloud.png';

const Clouds = React.memo(
  ({ currentWeatherData, timePoint, thinCloudRef, thickCloudRef }: Props) => {
    /** iOS 判定 */
    const isIos = useIsIos();

    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** 環境マップを取得 */
    const environment = useThree((state) => state.scene.environment);

    /** 薄雲テクスチャーを読み込み */
    const thinTexture = useTexture(THIN_CLOUD_TEXTURE);

    /** 厚雲テクスチャーを読み込み */
    const thickTexture = useTexture(THICK_CLOUD_TEXTURE);

    /** 雲量を取得（デフォルトは 0） */
    const cloudsAll = currentWeatherData?.clouds?.all || 0;

    /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
    const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

    /** 現在の天気を取得 */
    const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

    /** 天気カテゴリを取得 */
    const weatherCategory = useMemo<WeatherCategory>(
      () => getWeatherCategory(currentWeather?.description),
      [currentWeather],
    );

    /** 環境光の輝度を取得 */
    const envMapIntensity = useMemo<number>(
      () => getEnvMapIntensity(currentWeather!, timePoint, 'cloud'),
      [currentWeather, timePoint],
    );

    /** 薄雲の設定 */
    const thinCloudConfig = useMemo<CloudConfig>(
      () => ({
        /** デバイスに応じたスケール */
        scale: width > BREAK_POINTS.XS ? 1 : 0.9,
        /** デバイスに応じた位置 */
        position: width > BREAK_POINTS.XS ? [0, -0.5, -41] : [-5, 18, 10],
        /** デバイスに応じた角度（ラジアン） */
        rotation: (width > BREAK_POINTS.XS
          ? [75, 0, 0].map(MathUtils.degToRad)
          : [55, 0, 180].map(MathUtils.degToRad)) as CloudConfig['rotation'],
      }),
      [width],
    );

    /** 厚雲の設定 */
    const thickCloudConfig = useMemo<CloudConfig>(
      () => ({
        /** デバイスに応じたスケール */
        scale: width > BREAK_POINTS.XS ? 1.3 : 2,
        /** デバイスに応じた位置 */
        position: [0, 5.3, -10],
        /** デバイスに応じた角度（ラジアン） */
        rotation: [75, 0, -90].map(MathUtils.degToRad) as CloudConfig['rotation'],
      }),
      [width],
    );

    /** テクスチャーの wrapS と wrapT を RepeatWrapping に設定 */
    useEffect(() => {
      thinTexture.wrapS = thinTexture.wrapT = RepeatWrapping;
      thinTexture.repeat.set(1, 1);
      thickTexture.wrapS = thickTexture.wrapT = RepeatWrapping;
      thickTexture.repeat.set(7, 7);
    }, [thinTexture, thickTexture]);

    return (
      <group name="clouds" renderOrder={2}>
        {/* 薄雲 */}
        <mesh
          ref={thinCloudRef}
          name="thin cloud"
          /** 天気カテゴリが薄雲の場合は表示 */
          visible={weatherCategory === 'thinCloud'}
          scale={thinCloudConfig.scale}
          position={thinCloudConfig.position}
          rotation={thinCloudConfig.rotation}
        >
          <planeGeometry args={[85, 85]} />

          <meshStandardMaterial
            map={thinTexture}
            side={FrontSide}
            transparent
            opacity={cloudsAll / 100}
            envMap={environment}
            envMapIntensity={
              width > BREAK_POINTS.XS ? envMapIntensity : envMapIntensity + 20
            }
            depthTest
            depthWrite
          />
        </mesh>

        {/* 厚雲 */}
        <mesh
          ref={thickCloudRef}
          name="thick cloud"
          /** 天気カテゴリが厚雲の場合は表示 */
          visible={weatherCategory === 'thickCloud'}
          scale={thickCloudConfig.scale}
          position={thickCloudConfig.position}
          rotation={thickCloudConfig.rotation}
        >
          <planeGeometry args={[100, 100]} />

          <meshStandardMaterial
            map={thickTexture}
            side={FrontSide}
            transparent
            opacity={isIos ? 1.0 : cloudsAll / THICK_CLOUD_OPACITY_DIVISOR}
            envMap={environment}
            envMapIntensity={envMapIntensity}
            depthTest
            depthWrite
          />
        </mesh>
      </group>
    );
  },
);

Clouds.displayName = 'Clouds';

useTexture.preload(THIN_CLOUD_TEXTURE);
useTexture.preload(THICK_CLOUD_TEXTURE);

export default Clouds;
