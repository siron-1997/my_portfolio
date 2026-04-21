'use client';

import React, { type JSX, useLayoutEffect } from 'react';
import Image from 'next/image';

import { LOADING_ICON_PATH } from '@/constants/common';
import s from '@/styles/common.module.css';
import { disableScroll } from '@/utils';

type Props = {
  /** ローディング中フラグ */
  isLoading?: boolean;

  /** スクロール禁止の制御を行うかどうかのフラグ */
  scrollLock?: boolean;
};

const Loading = React.memo(
  ({ isLoading, scrollLock = true }: Props): JSX.Element => {
    useLayoutEffect(() => {
      if (!scrollLock) return;
      return disableScroll(isLoading ?? false);
    }, [isLoading, scrollLock]);

    if (!isLoading) return <></>;

    return (
      <div className={s.page_loading}>
        <div className={s.page_loading_container}>
          {/* タイトル */}
          <div className={s.loading_text}>Loading...</div>
          {/* アイコン */}
          <Image
            src={LOADING_ICON_PATH}
            alt="loading"
            width={110}
            height={110}
            quality={1}
            priority
            className={s.loading_icon}
          />
        </div>
      </div>
    );
  },
);

Loading.displayName = 'Loading';

export default Loading;
