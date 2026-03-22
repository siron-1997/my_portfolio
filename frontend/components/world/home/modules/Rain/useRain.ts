import { useEffect, useRef } from 'react';
import { WeatherItem, OpenWeatherCurrentData } from '@/types/api';
import { RainState, RainStateResult } from '@/types/world';
import { useWindowSize } from '@/hooks';
import { BREAK_POINTS } from '@/constants/common';
import { COLOR_PALETTE } from '@/constants/colors';
import { WEATHER_TYPES } from '@/constants/world';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  weather: WeatherItem[];
};

/**
 * HomeWorld の雨の描画ロジックを管理するカスタムフック
 * @param currentWeatherData - 現在の天気 API データ
 * @param weather - 天気情報
 */
const useRain = ({ currentWeatherData, weather }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { width, height } = useWindowSize();

  // 現在の風速を取得
  const windSpeed = currentWeatherData?.wind?.speed || 0;

  useEffect(() => {
    // canvas要素、天気データ、ウィンドウサイズがなければ何もしない
    if (!canvasRef.current || !currentWeatherData || !width || !height) {
      return;
    }

    // 関連する天気を探す
    const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

    if (!currentWeather) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas のサイズを設定
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;
    // Canvas サイズを保存
    const w = canvas.width;
    const h = canvas.height;

    // 雨の状態を取得
    const { color, lineWidth, xSpeed, ySpeed } = _getRainState({
      currentWeather,
      lineWidth: 2.5,
      xSpeed: width < BREAK_POINTS.XS ? 1.5 : 2,
      ySpeed: width < BREAK_POINTS.XS ? 15 : 20,
    });

    // 雨量を計算
    const rainFall = currentWeatherData?.rain
      ? currentWeatherData.rain['1h'] * (width < BREAK_POINTS.XS ? 180 : 250)
      : 0;

    // 描画スタイルを設定
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    // 雨粒の配列を生成
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

    // 雨粒を移動
    const moveParticles = () => {
      particles.forEach((p) => {
        p.x += p.xs;
        p.y += p.ys;
        // 画面外に出た雨粒を再配置
        if (p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -30;
        }
      });
    };

    // 雨粒を描画
    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      });
      // 雨粒を移動させ、再描画
      moveParticles();
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentWeatherData, weather, width, height, canvasRef]);

  return { windSpeed, canvasRef };
};

const _getRainState = (config: RainState): RainStateResult => {
  const rainState = {
    color: config?.color ?? `rgba(${COLOR_PALETTE.rain}, 0.25)`,
    lineWidth: config?.lineWidth ?? 0,
    length: config?.length ?? 0,
    xSpeed: config?.xSpeed ?? 0,
    ySpeed: config?.ySpeed ?? 0,
  };
  // 雨の強さに応じて色、長さ、速度を変更
  switch (config.currentWeather.description) {
    // 弱い雨
    case 'light rain':
    case 'light intensity shower rain':
    case 'thunderstorm with light rain':
    case 'freezing rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.25)`;
      rainState.length = rainState.length - 0.2;
      rainState.ySpeed = rainState.ySpeed - 2;
      break;
    // 通常の雨
    case 'moderate rain':
    case 'shower rain':
    case 'ragged shower rain':
    case 'thunderstorm with rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.20)`;
      rainState.length = rainState.length + 1;
      rainState.lineWidth = 2.5;
      rainState.ySpeed = rainState.ySpeed + 2.5;
      break;
    // 激しい雨
    case 'heavy intensity rain':
    case 'heavy intensity shower rain':
    case 'thunderstorm with heavy rain':
      rainState.color = `rgba(${COLOR_PALETTE.rain}, 0.20)`;
      rainState.length = rainState.length + 2;
      rainState.lineWidth = 3;
      rainState.xSpeed = rainState.xSpeed + 1;
      rainState.ySpeed = rainState.ySpeed + 5;
      break;
    // 非常に激しい雨
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

export default useRain;
