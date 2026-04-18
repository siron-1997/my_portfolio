'use client';

import React, { JSX } from 'react';
import Link from 'next/link';

import { Typography } from '@mui/material';
import cn from 'classnames';

import { SITE_MAP } from '@/constants/common';
import s from '@/styles/layout.module.css';

type Props = {
  /** ナビゲーション要素に追加するクラス名 */
  className?: string;

  /** ドロワー内で使用する場合にリンククリック時に渡す閉じるコールバック */
  closeDrawer?: () => void;
};

const Navigation = React.memo(
  ({ className, closeDrawer }: Props): JSX.Element => {
    const classNames = cn(className, s.navigation);

    return (
      <nav className={classNames}>
        <ul>
          {SITE_MAP.map((item, i) => (
            <li key={i}>
              <Link href={item.href} onClick={closeDrawer} className={s.link}>
                <Typography component="p" variant="p">
                  {item.title}
                </Typography>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  },
);

Navigation.displayName = 'Navigation';

export default Navigation;
