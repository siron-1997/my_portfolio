'use client';

import { Typography } from '@mui/material';
import cn from 'classnames';
import Link from 'next/link';
import React, { useCallback } from 'react';

import { SITE_MAP } from '@/constants/common';
import s from '@/styles/layout/Navigation.module.css';

/**
 * Navigation コンポーネントの Props。
 * ヘッダーとドロワーで共用するナビゲーションリンクリスト。
 */
type Props = {
  /** ナビゲーション要素に追加するクラス名 */
  className?: string;

  /** ドロワー内で使用する場合にリンククリック時に渡す閉じるコールバック */
  closeDrawer?: () => void;
};

const Navigation = React.memo(({ className, closeDrawer }: Props) => {
  /** クラス名を結合 */
  const classNames = cn(className, s.navigation);

  /** リンククリック時にドロワーを閉じる */
  const handleClick = useCallback(() => {
    if (!closeDrawer) {
      return;
    }
    closeDrawer();
  }, [closeDrawer]);

  return (
    <nav className={classNames}>
      <ul>
        {SITE_MAP.map((item, i) => (
          <li key={i}>
            <Link href={item.href} onClick={handleClick} className={s.link}>
              <Typography component="p" variant="p">
                {item.title}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
