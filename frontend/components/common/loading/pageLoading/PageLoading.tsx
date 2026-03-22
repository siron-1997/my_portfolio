'use client';

import Image from 'next/image';
import usePageLoading from './usePageLoading';
import s from '@/styles/common/loading/PageLoading.module.css';

const PageLoading = () => {
  const { iconSize } = usePageLoading();

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
