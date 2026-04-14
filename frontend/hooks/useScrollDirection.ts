'use client';

import { useEffect, useState } from 'react';

/**
 * ページのスクロール方向を返すカスタムフック。
 * スクロール下以降で "down"、上方向で "up"、初期状態は空文字を返す。
 *
 * @returns {"down" | "up" | ""} スクロール方向
 *
 * @example
 * const scrollDirection = useScrollDirection();
 */
const useScrollDirection = (): 'down' | 'up' | '' => {
  /** スクロール方向の状態 */
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up' | ''>(
    '',
  );

  useEffect(() => {
    let lastScrollTop = window.scrollY;

    const handleScroll = (): void => {
      const scrollTop = window.scrollY;

      /** スクロール方向を判定 (down or up) */
      if (scrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else if (scrollTop < lastScrollTop) {
        setScrollDirection('up');
      }

      /** スクロール位置を更新 (0以下の場合は0にする) */
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    /** イベントリスナーを登録 */
    window.addEventListener('scroll', handleScroll, { passive: true });

    /** クリーンアップ */
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollDirection;
};

export default useScrollDirection;
