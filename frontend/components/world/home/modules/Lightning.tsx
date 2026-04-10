import { useFrame } from '@react-three/fiber';
import React, { useMemo } from 'react';
import { PointLight } from 'three';

import { COLOR_PALETTE } from '@/constants/colors';
import {
  DEFAULT_WEATHER,
  WEATHER_TYPES,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL,
  WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY,
} from '@/constants/world';
import { OpenWeatherCurrentData } from '@/types/api';
import { LightningState } from '@/types/world';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 雷ポイントライトへの Ref */
  ref: React.RefObject<PointLight | null>;
};

const Lightning = React.memo(({ currentWeatherData, ref }: Props) => {
  /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
  const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

  /** 現在の天気を取得 */
  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  /** 天気の description に基づく雷の発生パラメータを設定 */
  const occurrenceProbability = useMemo<LightningState>(() => {
    const base = {
      visible: false,
      power: () => 0,
      positionX: () => 0,
      positionZ: () => 0,
    };

    const desc = currentWeather?.description;

    /** 天気情報の説明が存在しない場合はベースの状態を返す */
    if (!desc) return base;

    /** 天気情報の説明が軽い雷雨の場合 */
    if ((WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT as readonly string[]).includes(desc)) {
      return {
        visible: true,
        /** 輝度の上限を 5000 に制限し、ランダムに発光強度を返す */
        power: (v) => Math.min(Math.random() * 1000 * v, 5000),
        /** 係数 3 で最も広い散らばり範囲 [-v/2, 2.5v] を確保する（弱い雷は遠方に分散して出現） */
        positionX: (v) => Math.random() * (v * 3) - v / 2,
        positionZ: (v) => Math.random() * (v * 3) - v / 2,
      };
    }

    /** 天気情報の説明が通常の雷雨の場合 */
    if ((WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL as readonly string[]).includes(desc)) {
      return {
        visible: true,
        /** 輝度の上限を 1000 に制限し、弱い雷より低い輝度に抑える */
        power: (v) => Math.min(Math.random() * 1000 * v, 1000),
        /** 係数 2 で中程度の散らばり範囲 [-v/2, 1.5v]（弱い雷より集中、強い雷より広い） */
        positionX: (v) => Math.random() * (v * 2) - v / 2,
        positionZ: (v) => Math.random() * (v * 2) - v / 2,
      };
    }

    /** 天気情報の説明が強い雷雨の場合 */
    if ((WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY as readonly string[]).includes(desc)) {
      return {
        visible: true,
        /** 輝度上限なし。最大値は useFrame 側の power > 8000 の条件で制御する */
        power: (v) => Math.random() * 1000 * v,
        /** 係数 1 で最も狭い散らばり範囲 [-v/2, 0.5v]（強い雷は中心付近に集中して落ちる） */
        positionX: (v) => Math.random() * v - v / 2,
        positionZ: (v) => Math.random() * v - v / 2,
      };
    }

    return base;
  }, [currentWeather?.description]);

  useFrame(() => {
    /**
     * 以下のいずれかに該当する場合はフレームをスキップする。
     *
     * - ref が未マウント
     * - 現在の天気が雷雨でない
     * - 乱数が 0.93 を超えた（フレームごとの発生確率 7%、約 60fps 換算で 4～5 秒に 1 回）
     * - 前フレームの輝度がまだ 8000 を超えている（前の発光が収束し切っていない）
     */
    if (
      !ref.current ||
      !occurrenceProbability.visible ||
      Math.random() > 0.93 ||
      ref.current.power > 8000
    )
      return;

    ref.current.power = occurrenceProbability.power(8);

    /** 輝度が 5000 未満の弱い発光時は位置を更新せず同じ場所で点滅させる */
    if (ref.current.power < 5000) return;

    /** 輝度が 5000 以上の強い発光時は位置を更新して雷の落下位置をランダムに変更する */
    ref.current.position.set(
      occurrenceProbability.positionX(350),
      Math.random() * 20 + 50,
      occurrenceProbability.positionZ(25),
    );
  });

  return (
    <pointLight
      name="lightning"
      visible={occurrenceProbability.visible}
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
