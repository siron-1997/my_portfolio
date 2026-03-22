'use client';

import Image from 'next/image';
import useModelViewerLoading from './useModelViewerLoading';
import s from '@/styles/home/ModelViewerLoading.module.css';

const ModelViewerLoading = () => {
  const { isLoading, iconSize, imageClassNames } = useModelViewerLoading();

  if (!isLoading) return null;

  return (
    <div className={s.loading}>
      <div className={imageClassNames}>
        <Image
          src="/icons/model_viewer_loading.svg"
          alt="loading"
          width={iconSize}
          height={iconSize}
          quality={1}
          priority
        />
      </div>
    </div>
  );
};

export default ModelViewerLoading;
