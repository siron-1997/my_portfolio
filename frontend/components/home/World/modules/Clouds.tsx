'use client';

import React, { type JSX, useEffect, useMemo } from 'react';

import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { buttonGroup, useControls, type useCreateStore } from 'leva';
import { FrontSide, MathUtils, RepeatWrapping } from 'three';

import { IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  ENV_MAP_MODEL_TYPE_CLOUD,
  HOME_WORLD_DEBUG_CLOUD_CONTROLS,
  HOME_WORLD_SCENE_NAME_CLOUDS,
  HOME_WORLD_SCENE_NAME_THICK_CLOUD,
  HOME_WORLD_SCENE_NAME_THIN_CLOUD,
  HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP,
  HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE,
  HOME_WORLD_THICK_CLOUD_OPACITY_DIVISOR,
  HOME_WORLD_THICK_CLOUD_TEXTURE,
  HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP,
  HOME_WORLD_THIN_CLOUD_GEOMETRY_HEIGHT,
  HOME_WORLD_THIN_CLOUD_GEOMETRY_WIDTH,
  HOME_WORLD_THIN_CLOUD_OPACITY_DIVISOR,
  HOME_WORLD_THIN_CLOUD_TEXTURE,
  WEATHER_CATEGORY_THICK_CLOUD,
  WEATHER_CATEGORY_THIN_CLOUD,
  WEATHER_TYPES,
} from '@/constants/home';
import { useIsIos } from '@/hooks';
import { type OpenWeatherCurrentData, type TimePoint } from '@/types/api';
import {
  getEnvMapIntensity,
  getWeatherCategory,
  type WeatherCategory,
} from '@/utils/world';

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
      debugThinCloudPosX,
      debugThinCloudPosY,
      debugThinCloudPosZ,
      debugThinCloudRotX,
      debugThinCloudRotY,
      debugThinCloudRotZ,
      debugThickCloudPosX,
      debugThickCloudPosY,
      debugThickCloudPosZ,
      debugThickCloudRotX,
      debugThickCloudRotY,
      debugThickCloudRotZ,
      debugThinCloudWidth,
      debugThinCloudHeight,
      debugThickCloudWidth,
      debugThickCloudHeight,
      debugThinCloudRepeatX,
      debugThinCloudRepeatY,
      debugThickCloudRepeatX,
      debugThickCloudRepeatY,
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
        debugThinCloudPosX: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudPosX,
        debugThinCloudPosY: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudPosY,
        debugThinCloudPosZ: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudPosZ,
        debugThinCloudRotX: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRotX,
        debugThinCloudRotY: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRotY,
        debugThinCloudRotZ: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRotZ,
        debugThickCloudPosX: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudPosX,
        debugThickCloudPosY: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudPosY,
        debugThickCloudPosZ: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudPosZ,
        debugThickCloudRotX: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRotX,
        debugThickCloudRotY: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRotY,
        debugThickCloudRotZ: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRotZ,
        debugThinCloudWidth: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudWidth,
        debugThinCloudHeight: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudHeight,
        debugThickCloudWidth: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudWidth,
        debugThickCloudHeight: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudHeight,
        debugThinCloudRepeatX: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRepeatX,
        debugThinCloudRepeatY: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRepeatY,
        debugThickCloudRepeatX:
          HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRepeatX,
        debugThickCloudRepeatY:
          HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRepeatY,
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
                '雲.debugThinCloudPosX':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudPosX.value,
                '雲.debugThinCloudPosY':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudPosY.value,
                '雲.debugThinCloudPosZ':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudPosZ.value,
                '雲.debugThinCloudRotX':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRotX.value,
                '雲.debugThinCloudRotY':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRotY.value,
                '雲.debugThinCloudRotZ':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRotZ.value,
                '雲.debugThickCloudPosX':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudPosX.value,
                '雲.debugThickCloudPosY':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudPosY.value,
                '雲.debugThickCloudPosZ':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudPosZ.value,
                '雲.debugThickCloudRotX':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRotX.value,
                '雲.debugThickCloudRotY':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRotY.value,
                '雲.debugThickCloudRotZ':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRotZ.value,
                '雲.debugThinCloudWidth':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudWidth.value,
                '雲.debugThinCloudHeight':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudHeight.value,
                '雲.debugThickCloudWidth':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudWidth.value,
                '雲.debugThickCloudHeight':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudHeight.value,
                '雲.debugThinCloudRepeatX':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRepeatX.value,
                '雲.debugThinCloudRepeatY':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRepeatY.value,
                '雲.debugThickCloudRepeatX':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRepeatX.value,
                '雲.debugThickCloudRepeatY':
                  HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRepeatY.value,
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

    /** 薄雲の設定 */
    const thinCloudConfig = {
      scale: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.scale,
      position: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.position,
      rotation: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.rotationDeg.map(
        MathUtils.degToRad,
      ) as [number, number, number],
    };

    const thickCloudConfig = {
      scale: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.scale,
      position: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.position,
      rotation: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.rotationDeg.map(
        MathUtils.degToRad,
      ) as [number, number, number],
    };

    /**
     * 薄雲の実効位置。
     * 開発環境では Leva スライダー値を優先し、本番ではデバイスに応じた設定値を使用する。
     */
    const thinCloudPosition = IS_DEV
      ? ([debugThinCloudPosX, debugThinCloudPosY, debugThinCloudPosZ] as [
          number,
          number,
          number,
        ])
      : thinCloudConfig.position;

    /**
     * 薄雲の実効回転（ラジアン）。
     * 開発環境では Leva スライダー値（°）をラジアンに変換して使用する。
     */
    const thinCloudRotation = IS_DEV
      ? ([
          MathUtils.degToRad(debugThinCloudRotX),
          MathUtils.degToRad(debugThinCloudRotY),
          MathUtils.degToRad(debugThinCloudRotZ),
        ] as [number, number, number])
      : thinCloudConfig.rotation;

    /**
     * 厚雲の実効位置。
     * 開発環境では Leva スライダー値を優先し、本番ではデバイスに応じた設定値を使用する。
     */
    const thickCloudPosition = IS_DEV
      ? ([debugThickCloudPosX, debugThickCloudPosY, debugThickCloudPosZ] as [
          number,
          number,
          number,
        ])
      : thickCloudConfig.position;

    /**
     * 厚雲の実効回転（ラジアン）。
     * 開発環境では Leva スライダー値（°）をラジアンに変換して使用する。
     */
    const thickCloudRotation = IS_DEV
      ? ([
          MathUtils.degToRad(debugThickCloudRotX),
          MathUtils.degToRad(debugThickCloudRotY),
          MathUtils.degToRad(debugThickCloudRotZ),
        ] as [number, number, number])
      : thickCloudConfig.rotation;

    /** 薄雲の実効幅。開発環境では Leva 値、本番では定数値を使用する。 */
    const thinCloudWidth = IS_DEV
      ? debugThinCloudWidth
      : HOME_WORLD_THIN_CLOUD_GEOMETRY_WIDTH;

    /** 薄雲の実効高さ。開発環境では Leva 値、本番では定数値を使用する。 */
    const thinCloudHeight = IS_DEV
      ? debugThinCloudHeight
      : HOME_WORLD_THIN_CLOUD_GEOMETRY_HEIGHT;

    /** 厚雲の実効幅。開発環境では Leva 値、本番では定数値を使用する。 */
    const thickCloudWidth = IS_DEV
      ? debugThickCloudWidth
      : HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE;

    /** 厚雲の実効高さ。開発環境では Leva 値、本番では定数値を使用する。 */
    const thickCloudHeight = IS_DEV
      ? debugThickCloudHeight
      : HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE;

    /** 薄雲の実効 RepeatX。開発環境では Leva 値、本番では定数値を使用する。 */
    const thinCloudRepeatX = IS_DEV
      ? debugThinCloudRepeatX
      : HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRepeatX.value;

    /** 薄雲の実効 RepeatY。開発環境では Leva 値、本番では定数値を使用する。 */
    const thinCloudRepeatY = IS_DEV
      ? debugThinCloudRepeatY
      : HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudRepeatY.value;

    /** 厚雲の実効 RepeatX。開発環境では Leva 値、本番では定数値を使用する。 */
    const thickCloudRepeatX = IS_DEV
      ? debugThickCloudRepeatX
      : HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRepeatX.value;

    /** 厚雲の実効 RepeatY。開発環境では Leva 値、本番では定数値を使用する。 */
    const thickCloudRepeatY = IS_DEV
      ? debugThickCloudRepeatY
      : HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudRepeatY.value;

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

    /**
     * テクスチャーの wrapS と wrapT を RepeatWrapping に設定し、
     * ジオメトリサイズに比例して repeat を更新する。
     * 幅・高さが変わるたびに再計算することで、テクスチャーが引き伸ばされるのを防ぐ。
     */
    useEffect(() => {
      thinTexture.wrapS = thinTexture.wrapT = RepeatWrapping;
      thinTexture.repeat.set(thinCloudRepeatX, thinCloudRepeatY);
      thickTexture.wrapS = thickTexture.wrapT = RepeatWrapping;
      thickTexture.repeat.set(thickCloudRepeatX, thickCloudRepeatY);
      thinTexture.needsUpdate = true;
      thickTexture.needsUpdate = true;
    }, [
      thinTexture,
      thickTexture,
      thinCloudWidth,
      thinCloudHeight,
      thickCloudWidth,
      thickCloudHeight,
      thinCloudRepeatX,
      thinCloudRepeatY,
      thickCloudRepeatX,
      thickCloudRepeatY,
    ]);

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
          position={thinCloudPosition}
          rotation={thinCloudRotation}
        >
          <planeGeometry
            args={[thinCloudWidth as number, thinCloudHeight as number]}
          />

          <meshStandardMaterial
            map={thinTexture}
            side={FrontSide}
            transparent
            opacity={thinCloudOpacity}
            envMap={environment}
            envMapIntensity={envMapIntensity}
            depthTest
            depthWrite
          />
        </mesh>

        {/* 厚雲 */}
        <mesh
          name={HOME_WORLD_SCENE_NAME_THICK_CLOUD}
          visible={thickCloudVisible}
          scale={thickCloudConfig.scale}
          position={thickCloudPosition}
          rotation={thickCloudRotation}
        >
          <planeGeometry args={[thickCloudWidth, thickCloudHeight]} />

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
