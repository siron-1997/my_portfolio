'use client';

import React, { type JSX } from 'react';
import Image from 'next/image';

import { useIconSize } from '@/hooks';
import s from '@/styles/common/loading/PageLoading.module.css';

type Props = {
  /** ローディング中フラグ */
  isLoading?: boolean;
};

const Loading = React.memo(({ isLoading }: Props): JSX.Element => {
  /** アイコンサイズを取得 */
  const iconSize = useIconSize(70, 90, 110);

  if (!isLoading) return <></>;

  return (
    <div className={s.page_loading}>
      <div className={s.page_loading_container}>
        {/* タイトル */}
        <div className={s.loading_text}>Loading...</div>
        {/* アイコン */}
        <Image
          src="/icons/circle_loading.svg"
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
