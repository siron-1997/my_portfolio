'use client';

import Image from 'next/image';
import React from 'react';
import s from '@/styles/common/loading/ModelViewerLoading.module.css';
import useLoading from './useLoading';

const ModelViewerLoading = () => {
  const { isLoading, iconSize, imageClassNames } = useLoading();

  return (
    <div className={s.loading} style={{ display: isLoading ? 'flex' : 'none' }}>
      <div className={imageClassNames}>
        <Image
          src="/icons/model_viewer_loading.svg"
          alt="loading"
          width={iconSize}
          height={iconSize}
          quality={1}
          priority={true}
        />
      </div>
    </div>
  );
};

export default ModelViewerLoading;
