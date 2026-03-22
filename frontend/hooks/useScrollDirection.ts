'use client';

import { useEffect, useState } from 'react';

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<string>('');

  useEffect(() => {
    let lastScrollTop = window.scrollY;

    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      // スクロール方向を判定 (down or up)
      if (scrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else if (scrollTop < lastScrollTop) {
        setScrollDirection('up');
      }
      // スクロール位置を更新 (0以下の場合は0にする)
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    // イベントリスナーを登録
    window.addEventListener('scroll', handleScroll);
    // クリーンアップ
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollDirection;
};

export default useScrollDirection;
