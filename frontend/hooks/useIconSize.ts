'use client';

import { useState, useEffect, useCallback } from 'react';
import { BREAK_POINTS } from '@/constants/common';

/**
 * ウィンドウ幅に応じたアイコンサイズを返すカスタムフック。
 * ブレイクポイント（XS / SM）を基準に mb・tb・pc の 3 段階でサイズを切り替える。
 *
 * @param {number} mb - モバイル（ウィンドウ幅 < XS）時のアイコンサイズ（px）
 * @param {number} tb - タブレット（XS 以上 SM 未満）時のアイコンサイズ（px）
 * @param {number} pc - PC（SM 以上）時のアイコンサイズ（px）
 * @returns {number} 現在のウィンドウ幅に対応するアイコンサイズ（px）
 *
 * @example
 * const iconSize = useIconSize(35, 40, 50);
 */
const useIconSize = (mb: number, tb: number, pc: number): number => {
  /** アイコンサイズの状態 */
  const [iconSize, setIconSize] = useState<number>(0);

  const resize = useCallback((): void => {
    const width = window.innerWidth;

    /** ウィンドウ幅に応じてアイコンサイズを変更 */
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
  }, [mb, tb, pc]);

  useEffect(() => {
    /** 初回レンダリング時に実行 */
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  return iconSize;
};

export default useIconSize;
