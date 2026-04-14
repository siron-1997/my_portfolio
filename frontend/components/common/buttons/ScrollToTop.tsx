'use client';

import React, { type JSX,useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import s from '@/styles/common/button/ScrollToTop.module.css';

type Props = {
  /** isViewerActive */
  isViewerActive: boolean;
};

/** アイコン画像のファイルパス */
const ICON_PATH = '/icons/keyboard_arrow_up_24.svg';

const ScrollToTop = React.memo(({ isViewerActive }: Props): JSX.Element => {
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
        zIndex: isViewerActive ? 0 : 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.25s',
      }}
    >
      <Image
        src={ICON_PATH}
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
