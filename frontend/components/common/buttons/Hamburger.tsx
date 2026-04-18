'use client';

import React, { type JSX } from 'react';
import Image from 'next/image';

import cn from 'classnames';

import { HAMBURGER_ICON_PATH } from '@/constants/common';
import s from '@/styles/common/button/Hamburger.module.css';

type Props = {
  /** クラス名 */
  className?: string;

  /** アイコンのサイズ（px） */
  iconSize: number;

  /** ハンバーガーメニューをクリックした際のコールバック */
  onOpen: () => void;
};

const Hamburger = React.memo(
  ({ className, iconSize, onOpen }: Props): JSX.Element => {
    const classNames = cn(className, s.hamburger);

    return (
      <div
        className={classNames}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label="メニューを開く"
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      >
        <Image
          src={HAMBURGER_ICON_PATH}
          alt="hamburger menu"
          width={iconSize}
          height={iconSize}
          quality={1}
          priority={true}
        />
      </div>
    );
  },
);

Hamburger.displayName = 'Hamburger';

export default Hamburger;
