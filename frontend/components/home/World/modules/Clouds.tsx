'use client';

import React, { type JSX, useEffect, useMemo } from 'react';

import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { buttonGroup, type useCreateStore, useControls } from 'leva';
import { FrontSide, MathUtils, RepeatWrapping, type Vector3 } from 'three';

import { BREAK_POINTS, IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  ENV_MAP_MODEL_TYPE_CLOUD,
  HOME_WORLD_DEBUG_CLOUD_CONTROLS,
  HOME_WORLD_SCENE_NAME_CLOUDS,
  HOME_WORLD_SCENE_NAME_THICK_CLOUD,
  HOME_WORLD_SCENE_NAME_THIN_CLOUD,
  HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP,
  HOME_WORLD_THICK_CLOUD_CONFIG_MOBILE,
  HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE,
  HOME_WORLD_THICK_CLOUD_OPACITY_DIVISOR,
  HOME_WORLD_THICK_CLOUD_TEXTURE,
  HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP,
  HOME_WORLD_THIN_CLOUD_CONFIG_MOBILE,
  HOME_WORLD_THIN_CLOUD_ENV_INTENSITY_MOBILE_OFFSET,
  HOME_WORLD_THIN_CLOUD_GEOMETRY_SIZE,
  HOME_WORLD_THIN_CLOUD_OPACITY_DIVISOR,
  HOME_WORLD_THIN_CLOUD_TEXTURE,
  WEATHER_CATEGORY_THICK_CLOUD,
  WEATHER_CATEGORY_THIN_CLOUD,
  WEATHER_TYPES,
} from '@/constants/home';
import { useIsIos, useWindowSize } from '@/hooks';
import { type OpenWeatherCurrentData, type TimePoint } from '@/types/api';
import {
  getEnvMapIntensity,
  getWeatherCategory,
  type WeatherCategory,
} from '@/utils/world';

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

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

const Clouds = React.memo(
  ({ currentWeatherData, timePoint, levaStore }: Props): JSX.Element => {
    /** iOS 判定 */
    const isIos = useIsIos();

    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** 環境マップを取得 */
    const environment = useThree((state) => state.scene.environment);

    /** 薄雲テクスチャーを読み込み */
    const thinTexture = useTexture(HOME_WORLD_THIN_CLOUD_TEXTURE);

    /** 厚雲テクスチャーを読み込み */
    const thickTexture = useTexture(HOME_WORLD_THICK_CLOUD_TEXTURE);

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

    /** 雲コントロールのデフォルト値 */
    const defaults = {
      thinCloudVisible: weatherCategory === WEATHER_CATEGORY_THIN_CLOUD,
      thinCloudOpacity: cloudsAll / HOME_WORLD_THIN_CLOUD_OPACITY_DIVISOR,
      thickCloudVisible: weatherCategory === WEATHER_CATEGORY_THICK_CLOUD,
      thickCloudOpacity: cloudsAll / HOME_WORLD_THICK_CLOUD_OPACITY_DIVISOR,
    };

    /** 雲コントロール（開発環境デバッグ用） */
    const {
      debugThinCloudVisible,
      debugThinCloudOpacity,
      debugThickCloudVisible,
      debugThickCloudOpacity,
    } = useControls(
      '雲',
      {
        debugThinCloudVisible: {
          ...HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudVisible,
          value: defaults.thinCloudVisible,
        },
        debugThinCloudOpacity: {
          ...HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudOpacity,
        },
        debugThickCloudVisible: {
          ...HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudVisible,
          value: defaults.thickCloudVisible,
        },
        debugThickCloudOpacity: {
          ...HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudOpacity,
        },
        _cloudReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                '雲.debugThinCloudVisible': defaults.thinCloudVisible,
                '雲.debugThinCloudOpacity':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudOpacity.value,
                '雲.debugThickCloudVisible': defaults.thickCloudVisible,
                '雲.debugThickCloudOpacity':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudOpacity.value,
              },
              false,
            ),
        }),
      },
      { collapsed: true },
      { store: levaStore },
    );

    /** 薄雲の表示状態 */
    const thinCloudVisible = IS_DEV
      ? debugThinCloudVisible
      : defaults.thinCloudVisible;

    /** 薄雲の透明度 */
    const thinCloudOpacity = IS_DEV
      ? debugThinCloudOpacity
      : defaults.thinCloudOpacity;

    /** 厚雲の表示状態 */
    const thickCloudVisible = IS_DEV
      ? debugThickCloudVisible
      : defaults.thickCloudVisible;

    /** 厚雲の透明度 */
    const thickCloudOpacity = IS_DEV
      ? debugThickCloudOpacity
      : defaults.thickCloudOpacity;

    /** 環境光の輝度を取得 */
    const envMapIntensity = useMemo<number>(
      () =>
        getEnvMapIntensity(
          currentWeather ?? DEFAULT_WEATHER[0],
          timePoint,
          ENV_MAP_MODEL_TYPE_CLOUD,
        ),
      [currentWeather, timePoint],
    );

    /** 薄雲の設定 */
    const thinCloudConfig = useMemo<CloudConfig>(
      () => ({
        scale:
          width > BREAK_POINTS.XS
            ? HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.scale
            : HOME_WORLD_THIN_CLOUD_CONFIG_MOBILE.scale,
        position:
          width > BREAK_POINTS.XS
            ? HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.position
            : HOME_WORLD_THIN_CLOUD_CONFIG_MOBILE.position,
        rotation: (width > BREAK_POINTS.XS
          ? HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.rotationDeg.map(
              MathUtils.degToRad,
            )
          : HOME_WORLD_THIN_CLOUD_CONFIG_MOBILE.rotationDeg.map(
              MathUtils.degToRad,
            )) as CloudConfig['rotation'],
      }),
      [width],
    );

    /** 厚雲の設定 */
    const thickCloudConfig = useMemo<CloudConfig>(
      () => ({
        scale:
          width > BREAK_POINTS.XS
            ? HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.scale
            : HOME_WORLD_THICK_CLOUD_CONFIG_MOBILE.scale,
        position: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.position,
        rotation: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.rotationDeg.map(
          MathUtils.degToRad,
        ) as CloudConfig['rotation'],
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

    /** 天気カテゴリ・雲量が変わったときに雲の表示状態と透明度をリセットする（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;
      levaStore.set(
        {
          '雲.debugThinCloudVisible': defaults.thinCloudVisible,
          '雲.debugThinCloudOpacity': defaults.thinCloudOpacity,
          '雲.debugThickCloudVisible': defaults.thickCloudVisible,
          '雲.debugThickCloudOpacity': defaults.thickCloudOpacity,
        },
        false,
      );
    }, [
      weatherCategory,
      cloudsAll,
      levaStore,
      defaults.thinCloudVisible,
      defaults.thinCloudOpacity,
      defaults.thickCloudVisible,
      defaults.thickCloudOpacity,
    ]);

    return (
      <group name={HOME_WORLD_SCENE_NAME_CLOUDS} renderOrder={2}>
        {/* 薄雲 */}
        <mesh
          name={HOME_WORLD_SCENE_NAME_THIN_CLOUD}
          visible={thinCloudVisible}
          scale={thinCloudConfig.scale}
          position={thinCloudConfig.position}
          rotation={thinCloudConfig.rotation}
        >
          <planeGeometry
            args={[
              HOME_WORLD_THIN_CLOUD_GEOMETRY_SIZE,
              HOME_WORLD_THIN_CLOUD_GEOMETRY_SIZE,
            ]}
          />

          <meshStandardMaterial
            map={thinTexture}
            side={FrontSide}
            transparent
            opacity={thinCloudOpacity}
            envMap={environment}
            envMapIntensity={
              width > BREAK_POINTS.XS
                ? envMapIntensity
                : envMapIntensity +
                  HOME_WORLD_THIN_CLOUD_ENV_INTENSITY_MOBILE_OFFSET
            }
            depthTest
            depthWrite
          />
        </mesh>

        {/* 厚雲 */}
        <mesh
          name={HOME_WORLD_SCENE_NAME_THICK_CLOUD}
          visible={thickCloudVisible}
          scale={thickCloudConfig.scale}
          position={thickCloudConfig.position}
          rotation={thickCloudConfig.rotation}
        >
          <planeGeometry
            args={[
              HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE,
              HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE,
            ]}
          />

          <meshStandardMaterial
            map={thickTexture}
            side={FrontSide}
            transparent
            opacity={isIos ? 1.0 : thickCloudOpacity}
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

useTexture.preload(HOME_WORLD_THIN_CLOUD_TEXTURE);
useTexture.preload(HOME_WORLD_THICK_CLOUD_TEXTURE);

export default Clouds;
