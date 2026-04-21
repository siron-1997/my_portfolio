'use client';

import React, { type JSX, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { SCROLL_TO_TOP_ICON_PATH } from '@/constants/common';
import s from '@/styles/common.module.css';

const ScrollToTop = React.memo((): JSX.Element => {
  /** ボタンの表示フラグ */
  const [isVisible, setIsVisible] = useState<boolean>(false);

  /** スクロール位置に応じてボタンの表示を切り替える処理 */
  const buttonVisible = useCallback((): void => {
    setIsVisible(window.scrollY > 300);
  }, []);

  /** ボタンクリック時の処理 */
  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** スクロールイベントを登録 */
  useEffect(() => {
    buttonVisible();
    window.addEventListener('scroll', buttonVisible);

    return () => {
      window.removeEventListener('scroll', buttonVisible);
    };
  }, [buttonVisible]);

  return (
    <button
      className={s.scroll_to_top}
      onClick={handleScrollToTop}
      style={{
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'all 0.25s',
      }}
    >
      <Image
        src={SCROLL_TO_TOP_ICON_PATH}
        alt="Move To Top"
        width={25}
        height={25}
        quality={1}
      />
    </button>
  );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;
