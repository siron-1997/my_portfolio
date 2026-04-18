'use client';

import React, { type JSX, useEffect } from 'react';
import Image from 'next/image';

import { useIconSize } from '@/hooks';
import { LOADING_ICON_PATH } from '@/constants/common';
import s from '@/styles/common/loading/PageLoading.module.css';
import { disableScroll } from '@/utils';

type Props = {
  /** ローディング中フラグ */
  isLoading?: boolean;
};

const Loading = React.memo(({ isLoading }: Props): JSX.Element => {
  /** アイコンサイズを取得 */
  const iconSize = useIconSize(70, 90, 110);

  /** ローディング中はスクロールを禁止する */
  useEffect(() => {
    return disableScroll(isLoading ?? false);
  }, [isLoading]);

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
          width={iconSize}
          height={iconSize}
          quality={1}
          priority
        />
      </div>
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
