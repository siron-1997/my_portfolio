'use client';

import { useLayoutEffect } from 'react';
import Image from 'next/image';

import cn from 'classnames';

import { useWorkThreeDContext } from '@/contexts';
import { useWindowSize } from '@/hooks';
import s from '@/styles/common/loading/ModelViewerLoading.module.css';
import { disableScroll } from '@/utils';

const Loading = () => {
  const {
    state: { isLoading },
  } = useWorkThreeDContext();
  const { height } = useWindowSize();
  const imageClassNames = cn('image_container', s.image_container);

  useLayoutEffect(() => {
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
          width={150}
          height={150}
          quality={1}
          priority={true}
        />
      </div>
    </div>
  );
};

export default Loading;
