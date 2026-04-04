'use client';

import Image from 'next/image';
import cn from 'classnames';

import s from '@/styles/common/button/Hamburger.module.css';

/**
 * Hamburger コンポーネントの Props。
 * スマートフォン表示時のドロワーを開くハンバーガーメニューボタン。
 */
type Props = {
  /** 外部から追加するクラス名 */
  className?: string;

  /** ハンバーガーアイコンのサイズ（ピクセル） */
  iconSize: number;

  /** ハンバーガーメニューを開くコールバック */
  onOpen: () => void;
};

const Hamburger = ({ className, iconSize, onOpen }: Props) => {
  const classNames = cn(className, s.hamburger);

  return (
    <div className={classNames} onClick={onOpen}>
      <Image
        src="/icons/hamburger.svg"
        alt="hamburger menu"
        width={iconSize}
        height={iconSize}
        quality={1}
        priority={true}
      />
    </div>
  );
};

export default Hamburger;
