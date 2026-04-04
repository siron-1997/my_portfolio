'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { useWorkThreeDContext } from '@/contexts';
import { useIconSize, useWindowSize } from '@/hooks';
import { disableScroll } from '@/utils';
import s from '@/styles/common/loading/ModelViewerLoading.module.css';

const Loading = () => {
  const {
    state: { isLoading },
  } = useWorkThreeDContext();
  const { height } = useWindowSize();
  const iconSize = useIconSize(150, 150, 150);
  const imageClassNames = cn('image_container', s.image_container);

  useEffect(() => {
    const cleanup = disableScroll(isLoading);
    return () => {
      cleanup();
    };
  }, [isLoading, height]);

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

export default Loading;
