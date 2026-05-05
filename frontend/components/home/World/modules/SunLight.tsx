'use client';

import React, {
  type JSX,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useHelper } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { buttonGroup, useControls, type useCreateStore } from 'leva';
import {
  CameraHelper,
  type DirectionalLight,
  DirectionalLightHelper,
  type Object3D,
} from 'three';

import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { IS_DEV } from '@/constants/common';
import {
  HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS,
  HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS,
  HOME_WORLD_SHADOW_BIAS,
  HOME_WORLD_SHADOW_CAMERA_FAR,
  HOME_WORLD_SHADOW_CAMERA_HALF_SIZE,
  HOME_WORLD_SHADOW_CAMERA_NEAR,
  HOME_WORLD_SHADOW_MAP_SIZE,
  HOME_WORLD_SHADOW_NORMAL_BIAS,
  HOME_WORLD_SHADOW_RADIUS,
  HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_BROKEN_CLOUDS,
  HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_CLEAR_SKY,
  HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_FEW_CLOUDS,
  HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_SCATTERED_CLOUDS,
  HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_THICK_CLOUD,
  HOME_WORLD_SUN_LIGHT_INTENSITY_OFFSET_LUNCH,
  HOME_WORLD_SUN_LIGHT_INTENSITY_OFFSET_NIGHT,
  HOME_WORLD_SUN_LIGHT_POSITION,
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

const SunLight = React.memo(
  ({
    weatherCategory,
    timePoint,
    currentWeatherDescription,
    levaStore,
  }: Props): JSX.Element => {
    /** 太陽光の参照 Ref */
    const ref = useRef<DirectionalLight>(null);

    /** Shadow Camera Helper の参照 Ref（開発環境のみ） */
    const cameraHelperRef = useRef<CameraHelper | null>(null);

    /** Three.js シーン */
    const scene = useThree((state) => state.scene);

    /** WebGL レンダラー（シャドウマップ再ベイク用） */
    const gl = useThree((state) => state.gl);

    /** 太陽光の輝度を天気・時間帯から計算する */
    const defaultSunIntensity = useMemo<number>(() => {
      const base = (() => {
        /** 厚雲の場合 */
        if (weatherCategory === WEATHER_CATEGORY_THICK_CLOUD)
          return HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_THICK_CLOUD;

        /** それ以外の天気カテゴリの場合は、詳細な天気情報に基づいて強度を設定 */
        switch (currentWeatherDescription) {
          /** 所々雲の切れ間が見える */
          case WEATHER_DESCRIPTION_BROKEN_CLOUDS:
            return HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_BROKEN_CLOUDS;
          /** 所々曇り */
          case WEATHER_DESCRIPTION_SCATTERED_CLOUDS:
            return HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_SCATTERED_CLOUDS;
          /** 少し曇り */
          case WEATHER_DESCRIPTION_FEW_CLOUDS:
            return HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_FEW_CLOUDS;
          /** 快晴 */
          case WEATHER_DESCRIPTION_CLEAR_SKY:
            return HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_CLEAR_SKY;
          default:
            return 0;
        }
      })();

      /** 時間帯によって輝度を調整 */
      switch (timePoint) {
        case 'evening':
          return base;
        case 'night':
          return base + HOME_WORLD_SUN_LIGHT_INTENSITY_OFFSET_NIGHT;
        case 'lunch':
          return base - HOME_WORLD_SUN_LIGHT_INTENSITY_OFFSET_LUNCH;
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
    const {
      debugColor,
      debugIntensity,
      helperVisible,
      debugShadowCameraLeft,
      debugShadowCameraRight,
      debugShadowCameraTop,
      debugShadowCameraBottom,
      debugShadowCameraFar,
      debugShadowNormalBias,
      debugShadowBias,
    } = useControls(
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
        debugShadowCameraLeft:
          HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraLeft,
        debugShadowCameraRight:
          HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraRight,
        debugShadowCameraTop:
          HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraTop,
        debugShadowCameraBottom:
          HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraBottom,
        debugShadowCameraFar:
          HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraFar,
        debugShadowNormalBias:
          HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowNormalBias,
        debugShadowBias: HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowBias,
        _sunLightReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                '太陽光.debugColor': defaultSunColor,
                '太陽光.debugIntensity': defaultSunIntensity,
                '太陽光.debugShadowCameraLeft':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraLeft.value,
                '太陽光.debugShadowCameraRight':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraRight.value,
                '太陽光.debugShadowCameraTop':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraTop.value,
                '太陽光.debugShadowCameraBottom':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraBottom.value,
                '太陽光.debugShadowCameraFar':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowCameraFar.value,
                '太陽光.debugShadowNormalBias':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowNormalBias.value,
                '太陽光.debugShadowBias':
                  HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS.shadowBias.value,
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

    /** Shadow Camera の左エッジ */
    const shadowCameraLeft = IS_DEV
      ? debugShadowCameraLeft
      : -HOME_WORLD_SHADOW_CAMERA_HALF_SIZE;

    /** Shadow Camera の右エッジ */
    const shadowCameraRight = IS_DEV
      ? debugShadowCameraRight
      : HOME_WORLD_SHADOW_CAMERA_HALF_SIZE;

    /** Shadow Camera の上エッジ */
    const shadowCameraTop = IS_DEV
      ? debugShadowCameraTop
      : HOME_WORLD_SHADOW_CAMERA_HALF_SIZE;

    /** Shadow Camera の下エッジ */
    const shadowCameraBottom = IS_DEV
      ? debugShadowCameraBottom
      : -HOME_WORLD_SHADOW_CAMERA_HALF_SIZE;

    /** Shadow Camera の遠クリップ */
    const shadowCameraFar = IS_DEV
      ? debugShadowCameraFar
      : HOME_WORLD_SHADOW_CAMERA_FAR;

    /** シャドウのノーマルバイアス */
    const shadowNormalBias = IS_DEV
      ? debugShadowNormalBias
      : HOME_WORLD_SHADOW_NORMAL_BIAS;

    /** シャドウのバイアス */
    const shadowBias = IS_DEV ? debugShadowBias : HOME_WORLD_SHADOW_BIAS;

    /** Shadow Camera Helper をシーンに追加（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV || !ref.current) return;

      const helper = new CameraHelper(ref.current.shadow.camera);
      cameraHelperRef.current = helper;
      scene.add(helper);

      return () => {
        scene.remove(helper);
        helper.dispose();
        cameraHelperRef.current = null;
      };
    }, [scene]);

    /** Shadow Camera Helper を毎フレーム更新する（開発環境のみ） */
    useFrame(() => {
      if (!IS_DEV || !cameraHelperRef.current) {
        return;
      }
      cameraHelperRef.current.update();
    });

    /** 太陽光ヘルパー（開発環境のみ） */
    const sunLightHelperRef = useHelper(
      IS_DEV ? (ref as RefObject<Object3D>) : null,
      DirectionalLightHelper,
      HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
    );

    /** ライトヘルパー・Shadow Camera Helper の表示状態を leva コントロール値に同期する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV) return;

      if (sunLightHelperRef.current) {
        sunLightHelperRef.current.visible = helperVisible;
      }

      if (cameraHelperRef.current) {
        cameraHelperRef.current.visible = helperVisible;
      }
    }, [sunLightHelperRef, helperVisible]);

    /** Shadow Camera の矩形範囲とバイアスを直接設定し、投影行列を更新する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV || !ref.current) return;
      const shadow = ref.current.shadow;
      const cam = shadow.camera;
      cam.left = shadowCameraLeft;
      cam.right = shadowCameraRight;
      cam.top = shadowCameraTop;
      cam.bottom = shadowCameraBottom;
      cam.far = shadowCameraFar;
      shadow.normalBias = shadowNormalBias;
      shadow.bias = shadowBias;
      cam.updateProjectionMatrix();
      /** BakeShadows が shadowMap.autoUpdate = false にしているため、
       * 個別 shadow.needsUpdate に加え gl.shadowMap.needsUpdate も true にして
       * 次フレームで確実に再ベイクされるようにする。 */
      shadow.needsUpdate = true;
      gl.shadowMap.needsUpdate = true;
    }, [
      shadowCameraLeft,
      shadowCameraRight,
      shadowCameraTop,
      shadowCameraBottom,
      shadowCameraFar,
      shadowNormalBias,
      shadowBias,
      gl,
    ]);

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

    return (
      <directionalLight
        ref={ref}
        castShadow
        color={color}
        intensity={intensity}
        position={HOME_WORLD_SUN_LIGHT_POSITION}
        shadow-mapSize={[
          HOME_WORLD_SHADOW_MAP_SIZE,
          HOME_WORLD_SHADOW_MAP_SIZE,
        ]}
        shadow-camera-near={HOME_WORLD_SHADOW_CAMERA_NEAR}
        shadow-camera-far={shadowCameraFar}
        shadow-camera-left={shadowCameraLeft}
        shadow-camera-right={shadowCameraRight}
        shadow-camera-top={shadowCameraTop}
        shadow-camera-bottom={shadowCameraBottom}
        shadow-radius={HOME_WORLD_SHADOW_RADIUS}
        shadow-normalBias={shadowNormalBias}
        shadow-bias={shadowBias}
      />
    );
  },
);

SunLight.displayName = 'SunLight';

export default SunLight;
