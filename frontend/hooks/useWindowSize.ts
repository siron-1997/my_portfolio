'use client';

import { useLayoutEffect, useState } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

const useWindowSize = () => {
  const isClient = typeof window !== 'undefined';
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    if (!isClient) return;
    const handler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handler();
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [isClient]);

  return windowSize;
};
export default useWindowSize;
