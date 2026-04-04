'use client';

import Image from 'next/image';
import useScrollToTop from './useScrollToTop';
import s from '@/styles/common/button/ScrollToTop.module.css';

/** Props の型定義 */
type Props = {
  /** isViewerActive */
  isViewerActive: boolean;
};

const ScrollToTop = ({ isViewerActive }: Props) => {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className={s.scroll_to_top}
      style={{
        zIndex: isViewerActive ? 0 : 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.25s',
      }}
    >
      <Image
        src="/icons/keyboard_arrow_up_24.svg"
        alt="Move To Top"
        width={25}
        height={25}
        quality={1}
      />
    </button>
  );
};

export default ScrollToTop;
