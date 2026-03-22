import { useEffect } from 'react';
import cn from 'classnames';
import { useHomeContext } from '@/contexts';
import { useIconSize, useWindowSize } from '@/hooks';
import { disableScroll } from '@/utils';
import s from '@/styles/home/ModelViewerLoading.module.css';

const useModelViewerLoading = () => {
  const { isLoading } = useHomeContext();
  const iconSize = useIconSize(150, 150, 150);
  const { height } = useWindowSize();
  const imageClassNames = cn('image_container', s.image_container);

  useEffect(() => {
    const cleanup = disableScroll(isLoading);
    return () => {
      cleanup();
    };
  }, [isLoading, height]);

  return { isLoading, iconSize, imageClassNames };
};

export default useModelViewerLoading;
