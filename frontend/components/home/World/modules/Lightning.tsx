'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import { useFrame, useThree } from '@react-three/fiber';
import type { useCreateStore } from 'leva';
import { buttonGroup, useControls } from 'leva';
import { type PointLight, PointLightHelper } from 'three';

import { COLOR_PALETTE } from '@/constants/colors';
import { IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS,
  HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
  HOME_WORLD_DEBUG_LIGHTNING_CONTROLS,
  HOME_WORLD_LIGHTNING_DEFAULT_THRESHOLD,
  HOME_WORLD_LIGHTNING_POSITION_UPDATE_THRESHOLD,
  HOME_WORLD_LIGHTNING_POWER_CONTINUATION_THRESHOLD,
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
  /** 輝度の上限を 5000 に制限し、ランダムに発光強度を返す */
  power: (v) => Math.min(Math.random() * 1000 * v, 5000),
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
  const ref = useRef<PointLight | null>(null);

  /** シーンの参照 */
  const scene = useThree((state) => state.scene);

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
  };

  /** 雷コントロール（開発環境デバッグ用） */
  const {
    debugVisible,
    helperVisible,
    debugThunderstormType,
    debugOccurrenceProbability,
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
      helperVisible:
        HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS.lightningHelperVisible,
      _lightningReset: buttonGroup({
        リセット: () =>
          levaStore.set(
            {
              '雷.debugVisible': defaults.visible,
              '雷.debugThunderstormType': defaults.thunderstormType,
              '雷.debugOccurrenceProbability': defaults.occurrenceProbability,
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
      /**
       * 発光が十分に弱まった段階で次の落雷位置を決定する。
       * X 軸（引数 350）: 弱 [-175, 875] / 通常 [-175, 525] / 強 [-175, 175]
       * Z 軸（引数  25）: 弱 [-12.5, 62.5] / 通常 [-12.5, 37.5] / 強 [-12.5, 12.5]
       */
      if (ref.current.power < HOME_WORLD_LIGHTNING_POSITION_UPDATE_THRESHOLD) {
        ref.current.position.set(
          occurrenceProbability.positionX(350),
          5,
          occurrenceProbability.positionZ(25),
        );
      }
      /** 発光輝度をランダムに設定する（大きい値は次フレームで収束処理が継続する） */
      ref.current.power = occurrenceProbability.power(8);
    }
  });

  /** ライトヘルパーを生成してシーンに追加 (開発環境のみ) */
  useEffect(() => {
    if (!IS_DEV || !ref.current) return;

    const helper = new PointLightHelper(
      ref.current,
      HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
    );
    helper.name = 'lightning_helper';
    helper.visible = true;
    scene.add(helper);

    return () => {
      scene.remove(helper);
      helper.dispose();
    };
  }, [scene]);

  /** ライトヘルパーの表示状態を leva コントロール値に同期 (開発環境のみ) */
  useEffect(() => {
    if (!IS_DEV) return;

    const helper = scene.getObjectByName('lightning_helper');
    if (helper) helper.visible = helperVisible;
  }, [helperVisible, scene]);

  /** 天気説明が変わったときに雷の表示状態をリセットする（開発環境のみ） */
  useEffect(() => {
    if (!IS_DEV) return;
    levaStore.set({ '雷.debugVisible': defaults.visible }, false);
  }, [currentWeather?.description, levaStore, defaults.visible]);
  return (
    <pointLight
      name={HOME_WORLD_SCENE_NAME_LIGHTNING}
      color={COLOR_PALETTE.lightning}
      intensity={800000}
      distance={80}
      decay={2}
      position={[-20, 70, -10]}
      castShadow
      ref={ref}
    />
  );
});

Lightning.displayName = 'Lightning';

export default Lightning;
