import { useRef, useEffect } from 'react';
import { modelAnimation } from '@/animations/workWorld';

const useNumberedCircled = (isNavigationVisible: boolean) => {
  const navigationRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const navigation = navigationRef.current;
    const cleanup = modelAnimation(navigation, isNavigationVisible);
    return () => {
      cleanup();
    };
  }, [isNavigationVisible]);

  return {
    navigationRef,
  };
};

export default useNumberedCircled;
