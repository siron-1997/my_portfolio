'use client';

import { useEffect, useState } from 'react';

type UseScrollDirection = 'down' | 'up' | '';

/**
 * ページのスクロール方向を返すカスタムフック。
 * スクロール下以降で "down"、上方向で "up"、初期状態は空文字を返す。
 *
 * @returns {UseScrollDirection} スクロール方向
 *
 * @example
 * const scrollDirection = useScrollDirection();
 */
const useScrollDirection = (): UseScrollDirection => {
  /** スクロール方向の状態 */
  const [scrollDirection, setScrollDirection] =
    useState<UseScrollDirection>('');

  useEffect(() => {
    /** 前回のスクロール位置 */
    let prevScrollY = window.scrollY;

    const handleScroll = (): void => {
      /** 現在のスクロール位置 */
      const currentScrollY = window.scrollY;

      /** スクロール方向が下方向の場合 */
      if (currentScrollY > prevScrollY) {
        setScrollDirection('down');
      }

      /** スクロール方向が上方向の場合 */
      if (currentScrollY < prevScrollY) {
        setScrollDirection('up');
      }

      /** 前回のスクロール位置を更新 (0 以下の場合は 0 にする) */
      prevScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollDirection;
};

export default useScrollDirection;
