'use client';

import React, { type RefObject, useEffect, useMemo, useRef } from 'react';

import { useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { buttonGroup, useControls, type useCreateStore } from 'leva';
import { type Object3D, type PointLight, PointLightHelper } from 'three';

import { WORLD_COLOR_PALETTE } from '@/constants/colors';
import { IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS,
  HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
  HOME_WORLD_DEBUG_LIGHTNING_CONTROLS,
  HOME_WORLD_LIGHTNING_DEFAULT_THRESHOLD,
  HOME_WORLD_LIGHTNING_LIGHT_DECAY,
  HOME_WORLD_LIGHTNING_LIGHT_DEFAULT_POSITION,
  HOME_WORLD_LIGHTNING_LIGHT_DISTANCE,
  HOME_WORLD_LIGHTNING_LIGHT_INTENSITY,
  HOME_WORLD_LIGHTNING_LIGHT_POWER_CAP,
  HOME_WORLD_LIGHTNING_POSITION_UPDATE_THRESHOLD,
  HOME_WORLD_LIGHTNING_POSITION_X_RANGE,
  HOME_WORLD_LIGHTNING_POSITION_Y,
  HOME_WORLD_LIGHTNING_POSITION_Z_RANGE,
  HOME_WORLD_LIGHTNING_POWER_CONTINUATION_THRESHOLD,
  HOME_WORLD_LIGHTNING_POWER_SCALE,
  HOME_WORLD_SCENE_NAME_LIGHTNING,
  THUNDERSTORM_TYPE_HEAVY,
  THUNDERSTORM_TYPE_LIGHT,
  THUNDERSTORM_TYPE_NORMAL,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_ALL,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL,
  WEATHER_TYPES,
} from '@/constants/home';
import { type OpenWeatherCurrentData } from '@/types/api';
import { type LightningState } from '@/types/home';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

/** 雷雨（弱）の発光パラメータ */
const LIGHTNING_STATE_LIGHT: LightningState = {
  visible: true,
  /** 輝度上限を HOME_WORLD_LIGHTNING_LIGHT_POWER_CAP に制限し、ランダムに発光強度を返す */
  power: (v) =>
    Math.min(Math.random() * 1000 * v, HOME_WORLD_LIGHTNING_LIGHT_POWER_CAP),
  /** 係数 3 で最も広い散らばり範囲 [-v/2, 2.5v] を確保する（弱い雷は遠方に分散して出現） */
  positionX: (v) => Math.random() * (v * 3) - v / 2,
  positionZ: (v) => Math.random() * (v * 3) - v / 2,
};

/** 雷雨（通常）の発光パラメータ */
const LIGHTNING_STATE_NORMAL: LightningState = {
  visible: true,
  /** 輝度上限なし。LIGHT（上限 5000）より高い輝度が出る */
  power: (v) => Math.random() * 1000 * v,
  /** 係数 2 で中程度の散らばり範囲 [-v/2, 1.5v]（弱い雷より集中、強い雷より広い） */
  positionX: (v) => Math.random() * (v * 2) - v / 2,
  positionZ: (v) => Math.random() * (v * 2) - v / 2,
};

/** 雷雨（強）の発光パラメータ */
const LIGHTNING_STATE_HEAVY: LightningState = {
  visible: true,
  /** 輝度上限なし。最大値は useFrame 側の power > 8000 の条件で制御する */
  power: (v) => Math.random() * 1000 * v,
  /** 係数 1 で最も狭い散らばり範囲 [-v/2, 0.5v]（強い雷は中心付近に集中して落ちる） */
  positionX: (v) => Math.random() * v - v / 2,
  positionZ: (v) => Math.random() * v - v / 2,
};

const Lightning = React.memo(({ currentWeatherData, levaStore }: Props) => {
  /** 雷の参照 Ref */
  const ref = useRef<PointLight>(null);

  /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
  const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

  /** 現在の天気を取得 */
  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  /** 雷コントロールのデフォルト値 */
  const defaults = {
    visible:
      /** 雷雨天気の場合のみ表示する */
      currentWeather?.description !== undefined &&
      (WEATHER_DESCRIPTIONS_THUNDERSTORM_ALL as readonly string[]).includes(
        currentWeather.description,
      ),
    /** 現在の天気説明からデフォルトタイプを特定する */
    thunderstormType:
      HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.thunderstormType.value,
    occurrenceProbability:
      HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.occurrenceProbability.value,
    positionXRange: HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.positionXRange.value,
    positionZRange: HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.positionZRange.value,
    positionY: HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.positionY.value,
    powerScale: HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.powerScale.value,
    distance: HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.distance.value,
    decay: HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.decay.value,
  };

  /** 雷コントロール（開発環境デバッグ用） */
  const {
    debugVisible,
    helperVisible,
    debugThunderstormType,
    debugOccurrenceProbability,
    debugPositionXRange,
    debugPositionZRange,
    debugPositionY,
    debugPowerScale,
    debugDistance,
    debugDecay,
  } = useControls(
    '雷',
    {
      debugVisible: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.visible,
        value: defaults.visible,
      },
      debugThunderstormType: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.thunderstormType,
        value: defaults.thunderstormType,
      },
      debugOccurrenceProbability: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.occurrenceProbability,
        value: defaults.occurrenceProbability,
      },
      debugPositionXRange: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.positionXRange,
        value: defaults.positionXRange,
      },
      debugPositionZRange: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.positionZRange,
        value: defaults.positionZRange,
      },
      debugPositionY: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.positionY,
        value: defaults.positionY,
      },
      debugPowerScale: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.powerScale,
        value: defaults.powerScale,
      },
      debugDistance: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.distance,
        value: defaults.distance,
      },
      debugDecay: {
        ...HOME_WORLD_DEBUG_LIGHTNING_CONTROLS.decay,
        value: defaults.decay,
      },
      helperVisible:
        HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS.lightningHelperVisible,
      _lightningReset: buttonGroup({
        リセット: () =>
          levaStore.set(
            {
              '雷.debugVisible': defaults.visible,
              '雷.debugThunderstormType': defaults.thunderstormType,
              '雷.debugOccurrenceProbability': defaults.occurrenceProbability,
              '雷.debugPositionXRange': defaults.positionXRange,
              '雷.debugPositionZRange': defaults.positionZRange,
              '雷.debugPositionY': defaults.positionY,
              '雷.debugPowerScale': defaults.powerScale,
              '雷.debugDistance': defaults.distance,
              '雷.debugDecay': defaults.decay,
            },
            false,
          ),
      }),
    },
    { collapsed: true },
    { store: levaStore },
  );

  /** 天気の説明に基づく雷の発生パラメータを設定 (デバッグ用の雷雨タイプが指定されている場合は上書きする) */
  const occurrenceProbability = useMemo<LightningState>(() => {
    let base: LightningState = {
      visible: false,
      power: () => 0,
      positionX: () => 0,
      positionZ: () => 0,
    };

    const desc = currentWeather?.description;

    /** 天気情報の説明が存在しない場合はベースの状態を返す */
    if (!desc) return base;

    /** 天気情報の説明が軽い雷雨の場合 */
    if (
      (WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT as readonly string[]).includes(
        desc,
      )
    ) {
      base = LIGHTNING_STATE_LIGHT;
    }

    /** 天気情報の説明が通常の雷雨の場合 */
    if (
      (WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL as readonly string[]).includes(
        desc,
      )
    ) {
      base = LIGHTNING_STATE_NORMAL;
    }

    /** 天気情報の説明が強い雷雨の場合 */
    if (
      (WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY as readonly string[]).includes(
        desc,
      )
    ) {
      base = LIGHTNING_STATE_HEAVY;
    }

    /** 開発環境でない場合はベースの状態を返す */
    if (!IS_DEV) return base;

    /** デバッグ用の雷雨タイプが指定されている場合は、「天気の説明に基づく雷の発生パラメータ」を上書きする */
    switch (debugThunderstormType) {
      case THUNDERSTORM_TYPE_LIGHT:
        return LIGHTNING_STATE_LIGHT;
      case THUNDERSTORM_TYPE_NORMAL:
        return LIGHTNING_STATE_NORMAL;
      case THUNDERSTORM_TYPE_HEAVY:
        return LIGHTNING_STATE_HEAVY;
    }

    /** 雷雨タイプが 'none' の場合はベースの状態を返す */
    return base;
  }, [currentWeather?.description, debugThunderstormType]);

  /**
   * 雷発光の発生確率しきい値。
   * 開発環境では Leva の入力値（発生確率 %）から逆算して設定する。
   */
  const occurrenceProbabilityThreshold = IS_DEV
    ? 1 - debugOccurrenceProbability / 100
    : HOME_WORLD_LIGHTNING_DEFAULT_THRESHOLD;

  useFrame(() => {
    if (!ref.current) return;

    /** 現在のフレームで雷を表示するかどうか */
    const isVisible = IS_DEV ? debugVisible : occurrenceProbability.visible;

    /** 非表示は 0 で表現する */
    if (!isVisible) {
      ref.current.power = 0;
      return;
    }

    /**
     * 発生しきい値を超えたフレームで新たな発光を開始する。
     * 大きな輝度で発光した直後のフレームも処理を継続し、輝度を毎フレーム書き換えることで収束を表現する。
     */
    if (
      Math.random() > occurrenceProbabilityThreshold ||
      ref.current.power > HOME_WORLD_LIGHTNING_POWER_CONTINUATION_THRESHOLD
    ) {
      /** 発光が十分に弱まった段階で次の落雷位置を決定する */
      if (ref.current.power < HOME_WORLD_LIGHTNING_POSITION_UPDATE_THRESHOLD) {
        /** X 軸: 弱 [-v/2, 2.5v] / 通常 [-v/2, 1.5v] / 強 [-v/2, 0.5v] */
        const xRange = IS_DEV
          ? debugPositionXRange
          : HOME_WORLD_LIGHTNING_POSITION_X_RANGE;

        /** Z 軸: 同スケール */
        const zRange = IS_DEV
          ? debugPositionZRange
          : HOME_WORLD_LIGHTNING_POSITION_Z_RANGE;

        /** Y 軸: 同スケール */
        const posY = IS_DEV ? debugPositionY : HOME_WORLD_LIGHTNING_POSITION_Y;

        ref.current.position.set(
          occurrenceProbability.positionX(xRange),
          posY,
          occurrenceProbability.positionZ(zRange),
        );
      }

      /** 発光輝度のスケールを設定 */
      const powerScale = IS_DEV
        ? debugPowerScale
        : HOME_WORLD_LIGHTNING_POWER_SCALE;

      /** 発光輝度をランダムに設定する（大きい値は次フレームで収束処理が継続する） */
      ref.current.power = occurrenceProbability.power(powerScale);
    }
  });

  /** 雷ライトヘルパー（開発環境のみ生成） */
  const lightningHelperRef = useHelper(
    IS_DEV ? (ref as RefObject<Object3D>) : null,
    PointLightHelper,
    HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
  );

  /** ライトヘルパーの表示状態を leva コントロール値に同期 (開発環境のみ) */
  useEffect(() => {
    if (!IS_DEV || !lightningHelperRef.current) return;
    lightningHelperRef.current.visible = helperVisible;
  }, [lightningHelperRef, helperVisible]);

  /** 天気説明が変わったときに雷の表示状態をリセットする（開発環境のみ） */
  useEffect(() => {
    if (!IS_DEV) return;
    levaStore.set({ '雷.debugVisible': defaults.visible }, false);
  }, [currentWeather?.description, levaStore, defaults.visible]);

  return (
    <pointLight
      name={HOME_WORLD_SCENE_NAME_LIGHTNING}
      color={WORLD_COLOR_PALETTE.lightning}
      intensity={HOME_WORLD_LIGHTNING_LIGHT_INTENSITY}
      distance={IS_DEV ? debugDistance : HOME_WORLD_LIGHTNING_LIGHT_DISTANCE}
      decay={IS_DEV ? debugDecay : HOME_WORLD_LIGHTNING_LIGHT_DECAY}
      position={HOME_WORLD_LIGHTNING_LIGHT_DEFAULT_POSITION}
      castShadow
      ref={ref}
    />
  );
});

Lightning.displayName = 'Lightning';

export default Lightning;
