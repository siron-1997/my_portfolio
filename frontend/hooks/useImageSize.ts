'use client';

import { useState, useEffect } from 'react';
import { BREAK_POINTS } from '@/constants/common';

type ImageSize = {
  pointWidth: number;
  pointHeight: number;
};

type ImageSizeConfig = {
  sm: ImageSize;
  md: ImageSize;
  lg: ImageSize;
  xl: ImageSize;
  xl2: ImageSize;
  xl3: ImageSize;
};

const useImageSize = (config: ImageSizeConfig): ImageSize => {
  const [sizes, setSizes] = useState<ImageSize>({ pointWidth: 0, pointHeight: 0 });

  const handleResize = (): void => {
    const width = window.innerWidth;

    // ウィンドウ幅に応じて画像サイズを変更
    switch (true) {
      case width < BREAK_POINTS.XS:
        setSizes(config.sm);
        break;
      case width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM:
        setSizes(config.md);
        break;
      case width >= BREAK_POINTS.SM && width < BREAK_POINTS.LG:
        setSizes(config.lg);
        break;
      case width >= BREAK_POINTS.LG && width < BREAK_POINTS.XL:
        setSizes(config.xl);
        break;
      case width >= BREAK_POINTS.XL && width < BREAK_POINTS['2XL']:
        setSizes(config.xl2);
        break;
      case width >= BREAK_POINTS['2XL']:
        setSizes(config.xl3);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // 初回レンダリング時に実行
    handleResize();
    window.addEventListener('resize', handleResize);
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return sizes;
};

export default useImageSize;
