'use client';

import Image from 'next/image';

import { useIconSize } from '@/hooks';
import s from '@/styles/common/loading/PageLoading.module.css';

const PageLoading = () => {
  const iconSize = useIconSize(70, 90, 110);

  return (
    <div className={s.page_loading}>
      <div className={s.page_loading_container}>
        <div className={s.loading_text}>Loading...</div>
        <Image
          src="/icons/circle_loading.svg"
          alt="loading"
          width={iconSize}
          height={iconSize}
          quality={1}
        />
      </div>
    </div>
  );
};

export default PageLoading;
