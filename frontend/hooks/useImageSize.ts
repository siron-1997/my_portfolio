'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BREAK_POINTS } from '@/constants/common';

/** 画像の表示幅・高さ */
type ImageSize = {
  /** 画像の表示幅（px） */
  pointWidth: number;

  /** 画像の表示高（px） */
  pointHeight: number;
};

/**
 * ブレイクポイント別の画像サイズ設定マップ */
type ImageSizeConfig = {
  /** XS 未満（モバイル）時の画像サイズ */
  sm: ImageSize;

  /** XS 以上 SM 未満（タブレット XS）時の画像サイズ */
  md: ImageSize;

  /** SM 以上 LG 未満（タブレット SM）時の画像サイズ */
  lg: ImageSize;

  /** LG 以上 XL 未満（PC LG）時の画像サイズ */
  xl: ImageSize;

  /** XL 以上 2XL 未満（PC XL）時の画像サイズ */
  xl2: ImageSize;

  /** 2XL 以上（PC 最大ブレイクポイント）時の画像サイズ */
  xl3: ImageSize;
};

/**
 * ウィンドウ幅に応じた画像表示サイズを返すカスタムフック。
 * 6 段階のブレイクポイント（sm / md / lg / xl / xl2 / xl3）に応じて `config` の対応サイズを返す。
 *
 * @param {ImageSizeConfig} config - 各ブレイクポイントの画像サイズ設定
 * @returns {ImageSize} 現在のウィンドウ幅に対応する画像サイズ
 *
 * @example
 * const size = useImageSize({
 *   sm:  { pointWidth:  80, pointHeight:  60 },
 *   md:  { pointWidth: 120, pointHeight:  90 },
 *   lg:  { pointWidth: 200, pointHeight: 150 },
 *   xl:  { pointWidth: 240, pointHeight: 180 },
 *   xl2: { pointWidth: 280, pointHeight: 210 },
 *   xl3: { pointWidth: 320, pointHeight: 240 },
 * });
 */
const useImageSize = (config: ImageSizeConfig): ImageSize => {
  /** 画像サイズの状態 */
  const [sizes, setSizes] = useState<ImageSize>({ pointWidth: 0, pointHeight: 0 });

  /** config の参照を常に最新に保ちつつ、呼び出し側のオブジェクトリテラル再生成による無限ループを防止 */
  const configRef = useRef(config);
  configRef.current = config;

  const handleResize = useCallback((): void => {
    const width = window.innerWidth;
    const c = configRef.current;

    /** ウィンドウ幅に応じて画像サイズを変更 */
    switch (true) {
      case width < BREAK_POINTS.XS:
        setSizes(c.sm);
        break;
      case width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM:
        setSizes(c.md);
        break;
      case width >= BREAK_POINTS.SM && width < BREAK_POINTS.LG:
        setSizes(c.lg);
        break;
      case width >= BREAK_POINTS.LG && width < BREAK_POINTS.XL:
        setSizes(c.xl);
        break;
      case width >= BREAK_POINTS.XL && width < BREAK_POINTS['2XL']:
        setSizes(c.xl2);
        break;
      case width >= BREAK_POINTS['2XL']:
        setSizes(c.xl3);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    /** 初回レンダリング時に実行 */
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return sizes;
};

export default useImageSize;
