import React, { useEffect, useRef } from 'react';
import { OpenWeatherCurrentData } from '@/types/api';
import { RainState, RainStateResult } from '@/types/world';
import { useWindowSize } from '@/hooks';
import { BREAK_POINTS } from '@/constants/common';
import { COLOR_PALETTE } from '@/constants/colors';
import { DEFAULT_WEATHER, WEATHER_TYPES } from '@/constants/world';
import s from '@/styles/home/HomeWorld.module.css';

/**
 * Rain コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;
};

const Rain = React.memo(({ currentWeatherData }: Props) => {
  /** canvas 要素への参照 Ref */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** ウィンドウサイズを取得 */
  const { width, height } = useWindowSize();

  /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
  const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

  useEffect(() => {
    /** canvas 要素・天気データ・ウィンドウサイズがなければ何もしない */
    if (!canvasRef.current || !currentWeatherData || !width || !height) {
      return;
    }

    /** 関連する天気を探す (見つからない場合は処理を中断) */
    const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));
    if (!currentWeather) return;

    /** canvas 要素とコンテキストを取得 (取得できない場合は処理を中断) */
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /** Canvas のサイズを設定 */
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;

    /** Canvas サイズを保存 */
    const w = canvas.width;
    const h = canvas.height;

    /** 雨の状態を取得 */
    const { color, lineWidth, xSpeed, ySpeed } = _getRainState({
      currentWeather,
      lineWidth: 2.5,
      xSpeed: width < BREAK_POINTS.XS ? 1.5 : 2,
      ySpeed: width < BREAK_POINTS.XS ? 15 : 20,
    });

    /** 雨量を計算 */
    const rainFall = currentWeatherData?.rain
      ? currentWeatherData.rain['1h'] * (width < BREAK_POINTS.XS ? 180 : 250)
      : 0;

    /** 描画スタイルを設定 */
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    /** 雨粒の配列を生成 */
    const particles = Array.from({ length: rainFall }, () => {
      const { length } = _getRainState({ currentWeather, length: 1.2 });
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
    const moveParticles = () => {
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
    const drawParticles = () => {
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
  }, [currentWeatherData, weather, width, height, canvasRef]);

  return (
    <div className={s.rain_container}>
      <canvas
        ref={canvasRef}
        className={s.rain_canvas}
        style={{
          /** 風速に応じて回転角度を設定（雨粒を傾ける） */
          transform: `rotateZ(${currentWeatherData?.wind?.speed || 0}deg)`,
        }}
      />
    </div>
  );
});

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
  switch (config.currentWeather.description) {
    /** 弱い雨 */
    case 'light rain':
    case 'light intensity shower rain':
    case 'thunderstorm with light rain':
    case 'freezing rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.25)`;
      rainState.length = rainState.length - 0.2;
      rainState.ySpeed = rainState.ySpeed - 2;
      break;
    /** 通常の雨 */
    case 'moderate rain':
    case 'shower rain':
    case 'ragged shower rain':
    case 'thunderstorm with rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.20)`;
      rainState.length = rainState.length + 1;
      rainState.lineWidth = 2.5;
      rainState.ySpeed = rainState.ySpeed + 2.5;
      break;
    /** 激しい雨 */
    case 'heavy intensity rain':
    case 'heavy intensity shower rain':
    case 'thunderstorm with heavy rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.20)`;
      rainState.length = rainState.length + 2;
      rainState.lineWidth = 3;
      rainState.xSpeed = rainState.xSpeed + 1;
      rainState.ySpeed = rainState.ySpeed + 5;
      break;
    /** 非常に激しい雨 */
    case 'very heavy rain':
    case 'extreme rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.15)`;
      rainState.length = rainState.length + 3;
      rainState.lineWidth = 4;
      rainState.xSpeed = rainState.xSpeed + 2;
      rainState.ySpeed = rainState.ySpeed + 10;
      break;
    default:
      break;
  }

  return rainState;
};
