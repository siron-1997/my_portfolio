'use client';

import cn from 'classnames';
import Image from 'next/image';
import React, { useEffect } from 'react';

import { useHomeContext } from '@/contexts';
import { useIconSize, useWindowSize } from '@/hooks';
import { disableScroll } from '@/utils';
import s from '@/styles/home/ModelViewerLoading.module.css';

const ModelViewerLoading = React.memo(() => {
  const { isLoading } = useHomeContext();

  /** アイコンサイズを取得 */
  const iconSize = useIconSize(150, 150, 150);
  /** ウィンドウ高さを取得 */
  const { height } = useWindowSize();

  const imageClassNames = cn('image_container', s.image_container);

  useEffect(() => {
    const cleanup = disableScroll(isLoading);

    return () => {
      cleanup();
    };
  }, [isLoading, height]);

  if (!isLoading) return <></>;

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
});

ModelViewerLoading.displayName = 'ModelViewerLoading';

export default ModelViewerLoading;
