'use client';

import React, { type JSX, useEffect, useRef } from 'react';

import { buttonGroup, type useCreateStore, useControls } from 'leva';

import { COLOR_PALETTE } from '@/constants/colors';
import { BREAK_POINTS, IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  HOME_WORLD_DEBUG_RAIN_CONTROLS,
  WEATHER_DESCRIPTION_LIGHT_RAIN,
  WEATHER_DESCRIPTIONS_RAIN_HEAVY,
  WEATHER_DESCRIPTIONS_RAIN_LIGHT,
  WEATHER_DESCRIPTIONS_RAIN_NORMAL,
  WEATHER_DESCRIPTIONS_RAIN_VERY_HEAVY,
  WEATHER_TYPES,
} from '@/constants/home';
import { useWindowSize } from '@/hooks';
import s from '@/styles/home/HomeWorld.module.css';
import { type OpenWeatherCurrentData, type WeatherItem } from '@/types/api';
import { type RainState, type RainStateResult } from '@/types/home';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;

  /** カメラが屋内にいる間 true になる。true の本番モードでは雨アニメーションを非表示にする */
  isInsideRoom: boolean;
};

const Rain = React.memo(
  ({ currentWeatherData, levaStore, isInsideRoom }: Props): JSX.Element => {
    /** canvas 要素への参照 Ref */
    const ref = useRef<HTMLCanvasElement | null>(null);

    /** ウィンドウサイズを取得 */
    const { width, height } = useWindowSize();

    /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
    const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

    /**
     * 雨粒のベース数量。
     * API の 1 時間降雨量（mm）にウィンドウ幅に応じた係数を乗じて算出する。
     */
    const rainFall = currentWeatherData?.rain
      ? currentWeatherData.rain['1h'] * (width < BREAK_POINTS.XS ? 180 : 250)
      : 0;

    /** 雨コントロールのデフォルト値 */
    const defaults = {
      visible: rainFall > 0,
      rainAmount: Math.round(rainFall),
    };

    /** 雨コントロール（開発環境デバッグ用） */
    const {
      debugVisible,
      debugRainAmount,
      debugLineWidth,
      debugLength,
      debugXSpeed,
      debugYSpeed,
      debugOpacity,
    } = useControls(
      '雨',
      {
        debugVisible: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.visible,
          value: defaults.visible,
        },
        debugRainAmount: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.rainAmount,
          value: defaults.rainAmount,
        },
        debugLineWidth: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.lineWidth,
        },
        debugLength: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.length,
        },
        debugXSpeed: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.xSpeed,
        },
        debugYSpeed: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.ySpeed,
        },
        debugOpacity: {
          ...HOME_WORLD_DEBUG_RAIN_CONTROLS.opacity,
        },
        _rainReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                '雨.debugVisible': defaults.visible,
                '雨.debugRainAmount': defaults.rainAmount,
                '雨.debugLineWidth':
                  HOME_WORLD_DEBUG_RAIN_CONTROLS.lineWidth.value,
                '雨.debugLength': HOME_WORLD_DEBUG_RAIN_CONTROLS.length.value,
                '雨.debugXSpeed': HOME_WORLD_DEBUG_RAIN_CONTROLS.xSpeed.value,
                '雨.debugYSpeed': HOME_WORLD_DEBUG_RAIN_CONTROLS.ySpeed.value,
                '雨.debugOpacity': HOME_WORLD_DEBUG_RAIN_CONTROLS.opacity.value,
              },
              false,
            ),
        }),
      },
      { collapsed: true },
      { store: levaStore },
    );

    /** コンテナの表示状態。isInsideRoom は dev/本番を問わず最優先で適用する */
    const containerVisible =
      (IS_DEV ? debugVisible : rainFall > 0) && !isInsideRoom;

    /** 実際に描画する雨粒の数（デバッグ上書き値があればそちらを優先） */
    const effectiveRainAmount = IS_DEV ? debugRainAmount : rainFall;

    /** 雨量が変わったときに雨コントロールをリセットする（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;
      levaStore.set(
        {
          '雨.debugVisible': defaults.visible,
          '雨.debugRainAmount': defaults.rainAmount,
          '雨.debugLineWidth': HOME_WORLD_DEBUG_RAIN_CONTROLS.lineWidth.value,
          '雨.debugLength': HOME_WORLD_DEBUG_RAIN_CONTROLS.length.value,
          '雨.debugXSpeed': HOME_WORLD_DEBUG_RAIN_CONTROLS.xSpeed.value,
          '雨.debugYSpeed': HOME_WORLD_DEBUG_RAIN_CONTROLS.ySpeed.value,
          '雨.debugOpacity': HOME_WORLD_DEBUG_RAIN_CONTROLS.opacity.value,
        },
        false,
      );
    }, [rainFall, levaStore, defaults.visible, defaults.rainAmount]);

    useEffect(() => {
      /** canvas 要素・ウィンドウサイズがなければ何もしない */
      if (!ref.current || !width || !height) return;

      /** canvas 要素とコンテキストを取得 (取得できない場合は処理を中断) */
      const canvas = ref.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      /** 雨粒数が 0 の場合は canvas をクリアして終了 */
      if (effectiveRainAmount <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      /**
       * 描画に使用する天気アイテムを決定する。
       * 通常は API データから取得し、開発環境かつ API データがない場合は
       * 弱い雨をフォールバックとして使用する。
       */
      const currentWeather: WeatherItem | undefined =
        weather.find((w) => WEATHER_TYPES.includes(w.main)) ??
        (IS_DEV
          ? {
              id: 0,
              main: 'Rain',
              description: WEATHER_DESCRIPTION_LIGHT_RAIN,
              icon: '',
            }
          : undefined);

      if (!currentWeather) return;

      /** Canvas のサイズを設定 */
      canvas.width = window.outerWidth;
      canvas.height = window.outerHeight;

      /** Canvas サイズを保存 */
      const w = canvas.width;
      const h = canvas.height;

      /** 雨の状態を取得 */
      const { color, lineWidth, xSpeed, ySpeed } = _getRainState({
        currentWeather,
        lineWidth: IS_DEV ? debugLineWidth : 2.5,
        xSpeed: IS_DEV ? debugXSpeed : width < BREAK_POINTS.XS ? 1.5 : 2,
        ySpeed: IS_DEV ? debugYSpeed : width < BREAK_POINTS.XS ? 15 : 20,
      });

      /** 描画スタイルを設定 */
      ctx.strokeStyle = IS_DEV
        ? `rgba(${COLOR_PALETTE.rain}, ${debugOpacity})`
        : color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      /** 雨粒の配列を生成 */
      const particles = Array.from({ length: effectiveRainAmount }, () => {
        const { length } = _getRainState({
          currentWeather,
          length: IS_DEV ? debugLength : 1.2,
        });
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          l: Math.random() * length,
          xs: -4 + Math.random() * xSpeed + 1,
          ys: Math.random() * 10 + ySpeed,
        };
      });

      let animationFrameId: number;

      /**
       * 雨粒を移動する。
       * @returns {void} 戻り値は返さない
       */
      const moveParticles = (): void => {
        particles.forEach((p) => {
          p.x += p.xs;
          p.y += p.ys;
          /** 画面外に出た雨粒を再配置 */
          if (p.x > w || p.y > h) {
            p.x = Math.random() * w;
            p.y = -30;
          }
        });
      };

      /**
       * 雨粒を描画して次フレームを予約する。
       * @returns {void} 戻り値は返さない
       */
      const drawParticles = (): void => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
          ctx.stroke();
        });
        /** 雨粒を移動させ、再描画 */
        moveParticles();
        animationFrameId = requestAnimationFrame(drawParticles);
      };

      drawParticles();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [
      currentWeatherData,
      weather,
      width,
      height,
      ref,
      effectiveRainAmount,
      debugLineWidth,
      debugLength,
      debugXSpeed,
      debugYSpeed,
      debugOpacity,
    ]);

    return (
      <div
        className={s.rain_container}
        style={{
          /** コンテナの表示状態。isInsideRoom は dev/本番を問わず最優先で適用する */
          opacity: containerVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          /** コンテナの表示状態に応じてポインターイベントを制御 */
          pointerEvents: containerVisible ? 'auto' : 'none',
        }}
      >
        <canvas
          ref={ref}
          className={s.rain_canvas}
          style={{
            /** 風速に応じて回転角度を設定（雨粒を傾ける） */
            transform: `rotateZ(${currentWeatherData?.wind?.speed || 0}deg)`,
          }}
        />
      </div>
    );
  },
);

Rain.displayName = 'Rain';

export default Rain;

/**
 * 天候に応じた雨の描画パラメータを返す。
 *
 * @param {RainState} config - 現在天候に基づく描画設定
 * @returns {RainStateResult} 雨の描画パラメータ
 */
const _getRainState = (config: RainState): RainStateResult => {
  const rainState = {
    color: config?.color ?? `rgba(${COLOR_PALETTE.rain}, 0.25)`,
    lineWidth: config?.lineWidth ?? 0,
    length: config?.length ?? 0,
    xSpeed: config?.xSpeed ?? 0,
    ySpeed: config?.ySpeed ?? 0,
  };

  /** 雨の強さに応じて色・長さ・速度を変更 */
  const desc = config.currentWeather.description;
  if ((WEATHER_DESCRIPTIONS_RAIN_LIGHT as readonly string[]).includes(desc)) {
    /** 弱い雨・霧雨（Drizzle を含む） */
    rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.25)`;
    rainState.length = rainState.length - 0.2;
    rainState.ySpeed = rainState.ySpeed - 2;
  } else if (
    (WEATHER_DESCRIPTIONS_RAIN_NORMAL as readonly string[]).includes(desc)
  ) {
    /** 通常の雨 */
    rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.20)`;
    rainState.length = rainState.length + 1;
    rainState.lineWidth = 2.5;
    rainState.ySpeed = rainState.ySpeed + 2.5;
  } else if (
    (WEATHER_DESCRIPTIONS_RAIN_HEAVY as readonly string[]).includes(desc)
  ) {
    /** 激しい雨 */
    rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.20)`;
    rainState.length = rainState.length + 2;
    rainState.lineWidth = 3;
    rainState.xSpeed = rainState.xSpeed + 1;
    rainState.ySpeed = rainState.ySpeed + 5;
  } else if (
    (WEATHER_DESCRIPTIONS_RAIN_VERY_HEAVY as readonly string[]).includes(desc)
  ) {
    /** 非常に激しい雨 */
    rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.15)`;
    rainState.length = rainState.length + 3;
    rainState.lineWidth = 4;
    rainState.xSpeed = rainState.xSpeed + 2;
    rainState.ySpeed = rainState.ySpeed + 10;
  }

  return rainState;
};
