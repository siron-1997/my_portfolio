'use client';

import React, { type JSX, useEffect, useRef } from 'react';

import { buttonGroup, useControls,type useCreateStore } from 'leva';
import { type Fog as ThreeFog } from 'three';

import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS, IS_DEV } from '@/constants/common';
import {
  HOME_WORLD_DEBUG_FOG_COLOR_CONTROL,
  HOME_WORLD_DEBUG_FOG_CONTROLS,
  HOME_WORLD_FOG_FAR_BASE_DESKTOP,
  HOME_WORLD_FOG_FAR_BASE_MOBILE,
  HOME_WORLD_FOG_NEAR_DESKTOP,
  HOME_WORLD_FOG_NEAR_MOBILE,
} from '@/constants/home';
import { useWindowSize } from '@/hooks';
import { type OpenWeatherCurrentData, type TimePoint } from '@/types/api';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

const Fog = React.memo(
  ({ currentWeatherData, timePoint, levaStore }: Props): JSX.Element => {
    /** 霧の参照 Ref */
    const ref = useRef<ThreeFog | null>(null);

    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** 湿度を取得 (0 - 100) */
    const humidity = currentWeatherData?.main?.humidity ?? 0;

    /** 霧コントロールのデフォルト値 */
    const defaults = {
      color: TIME_POINT_ENV_COLORS[timePoint].fog,
      near: HOME_WORLD_FOG_NEAR_DESKTOP,
      far: HOME_WORLD_FOG_FAR_BASE_DESKTOP - humidity,
    };

    /** 霧コントロール（開発環境デバッグ用） */
    const { debugVisible, debugColor, debugNear, debugFar } = useControls(
      '霧',
      {
        debugVisible: { value: true, label: '表示' },
        debugColor: {
          ...HOME_WORLD_DEBUG_FOG_COLOR_CONTROL,
          value: defaults.color,
        },
        debugNear: {
          ...HOME_WORLD_DEBUG_FOG_CONTROLS.near,
          value: defaults.near,
        },
        debugFar: { ...HOME_WORLD_DEBUG_FOG_CONTROLS.far, value: defaults.far },
        _fogReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                '霧.debugColor': defaults.color,
                '霧.debugNear': defaults.near,
                '霧.debugFar': defaults.far,
              },
              false,
            ),
        }),
      },
      { collapsed: true },
      { store: levaStore },
    );

    /** 霧の色（デバッグ上書き値があればそちらを優先） */
    const color = IS_DEV ? debugColor : TIME_POINT_ENV_COLORS[timePoint].fog;

    /** 霧の最少距離（デバッグ上書き値があればそちらを優先） */
    const near = IS_DEV
      ? debugNear
      : width! > BREAK_POINTS.XS
        ? HOME_WORLD_FOG_NEAR_DESKTOP
        : HOME_WORLD_FOG_NEAR_MOBILE;

    /** 霧の最大距離（デバッグ上書き値があればそちらを優先） */
    const far = IS_DEV
      ? debugFar
      : width! > BREAK_POINTS.XS
        ? HOME_WORLD_FOG_FAR_BASE_DESKTOP - humidity
        : HOME_WORLD_FOG_FAR_BASE_MOBILE - humidity;

    /** 時間帯が変わったときに霧の色をリセットする (開発環境のみ) */
    useEffect(() => {
      if (!ref.current) return;
      levaStore.set(
        { '霧.debugColor': TIME_POINT_ENV_COLORS[timePoint].fog },
        false,
      );
    }, [timePoint, levaStore]);

    /** 湿度が変わったときに霧の最大距離をリセットする（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;
      levaStore.set({ '霧.debugFar': defaults.far }, false);
    }, [humidity, levaStore, defaults.far]);

    /** 霧の状態をデバッグ設定と同期する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV || !ref.current) return;
      ref.current.color.set(debugColor);
      ref.current.near = debugNear;
      ref.current.far = debugFar;
    }, [debugColor, debugNear, debugFar]);

    return (
      (IS_DEV ? debugVisible : true) ? (
        <fog
          ref={ref}
          attach="fog"
          args={[color, near, far]}
          color={color}
          near={near}
          far={far}
        />
      ) : null
    );
  },
);

Fog.displayName = 'Fog';

export default Fog;
