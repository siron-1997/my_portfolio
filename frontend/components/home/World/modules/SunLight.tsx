'use client';

import React, { type JSX, useEffect, useMemo, useRef } from 'react';

import { useFrame, useThree } from '@react-three/fiber';
import type { useCreateStore } from 'leva';
import { buttonGroup, useControls } from 'leva';
import { type DirectionalLight, DirectionalLightHelper } from 'three';

import { IS_DEV } from '@/constants/common';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import {
  HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS,
  HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS,
  HOME_WORLD_SCENE_NAME_SUN_LIGHT_HELPER,
  HOME_WORLD_SHADOW_CAMERA_HALF_SIZE,
  HOME_WORLD_SHADOW_MAP_SIZE,
  WEATHER_CATEGORY_CLEAR_SKY,
  WEATHER_CATEGORY_THICK_CLOUD,
  WEATHER_CATEGORY_THIN_CLOUD,
  WEATHER_DESCRIPTION_BROKEN_CLOUDS,
  WEATHER_DESCRIPTION_CLEAR_SKY,
  WEATHER_DESCRIPTION_FEW_CLOUDS,
  WEATHER_DESCRIPTION_SCATTERED_CLOUDS,
} from '@/constants/home';
import { type TimePoint } from '@/types/api';
import { type WeatherCategory } from '@/utils/world';

type Props = {
  /** 天気カテゴリ */
  weatherCategory: WeatherCategory;

  /** 時間帯 */
  timePoint: TimePoint;

  /** 現在の天気説明 */
  currentWeatherDescription: string | undefined;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

/** 太陽光ヘルパーの名前 */
const SUN_LIGHT_HELPER_NAME = HOME_WORLD_SCENE_NAME_SUN_LIGHT_HELPER;

const SunLight = React.memo(
  ({
    weatherCategory,
    timePoint,
    currentWeatherDescription,
    levaStore,
  }: Props): JSX.Element => {
    /** 太陽光の参照 Ref */
    const ref = useRef<DirectionalLight | null>(null);

    /** シーンの参照 */
    const scene = useThree((state) => state.scene);

    /** ライトヘルパーの更新（開発環境のみ） */
    useFrame(() => {
      if (!IS_DEV) return;

      const helper = scene.getObjectByName(
        SUN_LIGHT_HELPER_NAME,
      ) as DirectionalLightHelper;

      helper?.update();
    });

    /** 太陽光の輝度を天気・時間帯から計算する */
    const defaultSunIntensity = useMemo<number>(() => {
      const base = (() => {
        /** 厚雲の場合 */
        if (weatherCategory === WEATHER_CATEGORY_THICK_CLOUD) return 2.2;

        /** それ以外の天気カテゴリの場合は、詳細な天気情報に基づいて強度を設定 */
        switch (currentWeatherDescription) {
          /** 所々雲の切れ間が見える */
          case WEATHER_DESCRIPTION_BROKEN_CLOUDS:
            return 2.6;
          /** 所々曇り */
          case WEATHER_DESCRIPTION_SCATTERED_CLOUDS:
            return 3.0;
          /** 少し曇り */
          case WEATHER_DESCRIPTION_FEW_CLOUDS:
            return 3.4;
          /** 快晴 */
          case WEATHER_DESCRIPTION_CLEAR_SKY:
            return 3.6;
          default:
            return 0;
        }
      })();

      /** 時間帯によって輝度を調整 */
      switch (timePoint) {
        case 'evening':
          return base;
        case 'night':
          return base + 0.6;
        case 'lunch':
          return base - 0.8;
        default:
          return 0;
      }
    }, [weatherCategory, currentWeatherDescription, timePoint]);

    /** 太陽光の色を天気カテゴリ・時間帯から計算する */
    const defaultSunColor = useMemo<string>(() => {
      const c = TIME_POINT_ENV_COLORS[timePoint];
      if (weatherCategory === WEATHER_CATEGORY_THICK_CLOUD) return c.thickCloud;
      if (weatherCategory === WEATHER_CATEGORY_THIN_CLOUD) return c.thinCloud;
      if (weatherCategory === WEATHER_CATEGORY_CLEAR_SKY) return c.clearSky;
      return c.clearSky;
    }, [weatherCategory, timePoint]);

    /** 太陽光コントロール（開発環境デバッグ用） */
    const { debugColor, debugIntensity, helperVisible } = useControls(
      '太陽光',
      {
        /** 天気カテゴリ・時間帯から計算した色を初期値として設定する */
        debugColor: {
          ...HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.color,
          value: defaultSunColor,
        },
        /** 天気・時間帯から計算した輝度を初期値として設定する */
        debugIntensity: {
          ...HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.intensity,
          value: defaultSunIntensity,
        },
        helperVisible:
          HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS.sunLightHelperVisible,
        _sunLightReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                '太陽光.debugColor': defaultSunColor,
                '太陽光.debugIntensity': defaultSunIntensity,
              },
              false,
            ),
        }),
      },
      { collapsed: true },
      { store: levaStore },
    );

    /** 太陽光の色 */
    const color = IS_DEV ? debugColor : defaultSunColor;

    /** 太陽光の輝度 */
    const intensity = IS_DEV ? debugIntensity : defaultSunIntensity;

    /** ライトヘルパーを生成してシーンに追加 (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV || !ref.current) return;

      /** 太陽光ヘルパー */
      const helper = new DirectionalLightHelper(
        ref.current,
        HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
      );
      helper.name = SUN_LIGHT_HELPER_NAME;
      helper.visible = true;
      scene.add(helper);

      return () => {
        scene.remove(helper);
        helper.dispose();
      };
    }, [scene]);

    /** 時間帯・天気が変わったときに太陽光の色と輝度をリセットする (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV) return;

      levaStore.set(
        {
          '太陽光.debugColor': defaultSunColor,
          '太陽光.debugIntensity': defaultSunIntensity,
        },
        false,
      );
    }, [
      timePoint,
      weatherCategory,
      currentWeatherDescription,
      levaStore,
      defaultSunColor,
      defaultSunIntensity,
    ]);

    /** ライトヘルパーの表示状態を leve コントロール値に同期する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV) return;

      const helper = scene.getObjectByName(SUN_LIGHT_HELPER_NAME);
      if (helper) helper.visible = helperVisible;
    }, [scene, helperVisible]);

    return (
      <directionalLight
        ref={ref}
        castShadow
        color={color}
        intensity={intensity}
        position={[50, 50, 50]}
        shadow-mapSize={[
          HOME_WORLD_SHADOW_MAP_SIZE,
          HOME_WORLD_SHADOW_MAP_SIZE,
        ]}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-HOME_WORLD_SHADOW_CAMERA_HALF_SIZE}
        shadow-camera-right={HOME_WORLD_SHADOW_CAMERA_HALF_SIZE}
        shadow-camera-top={HOME_WORLD_SHADOW_CAMERA_HALF_SIZE}
        shadow-camera-bottom={-HOME_WORLD_SHADOW_CAMERA_HALF_SIZE}
        shadow-radius={10}
        shadow-normalBias={0.11}
      />
    );
  },
);

SunLight.displayName = 'SunLight';

export default SunLight;
