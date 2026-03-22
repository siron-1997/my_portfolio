import { useEffect } from 'react';
import cn from 'classnames';
import { useWorkThreeDContext } from '@/contexts';
import { useIconSize, useWindowSize } from '@/hooks';
import { disableScroll } from '@/utils';
import s from '@/styles/common/loading/ModelViewerLoading.module.css';

const useLoading = () => {
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

  return {
    isLoading,
    iconSize,
    imageClassNames,
  };
};

export default useLoading;
