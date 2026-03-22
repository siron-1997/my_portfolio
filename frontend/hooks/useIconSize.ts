'use client';

import { useState, useEffect } from 'react';
import { BREAK_POINTS } from '@/constants/common';

const useIconSize = (mb: number, tb: number, pc: number) => {
  const [iconSize, setIconSize] = useState<number>(0);

  const resize = (): void => {
    const width = window.innerWidth;
    // ウィンドウ幅に応じてアイコンサイズを変更
    switch (true) {
      case width < BREAK_POINTS.XS:
        setIconSize(mb);
        break;
      case width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM:
        setIconSize(tb);
        break;
      case width >= BREAK_POINTS.SM:
        setIconSize(pc);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // 初回レンダリング時に実行
    resize();
    window.addEventListener('resize', resize);
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return iconSize;
};

export default useIconSize;
