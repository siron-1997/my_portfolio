'use client';

import React, { type JSX } from 'react';
import Image from 'next/image';

import cn from 'classnames';

import { HAMBURGER_ICON_PATH } from '@/constants/common';
import s from '@/styles/common.module.css';

type Props = {
  /** クラス名 */
  className?: string;

  /** ハンバーガーメニューをクリックした際のコールバック */
  onOpen: () => void;
};

const Hamburger = React.memo(
  ({ className, onOpen }: Props): JSX.Element => {
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
          width={50}
          height={50}
          quality={1}
          priority={true}
          className={s.hamburger_icon}
        />
      </div>
    );
  },
);

Hamburger.displayName = 'Hamburger';

export default Hamburger;
