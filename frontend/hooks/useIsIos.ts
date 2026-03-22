'use client';

import { useState, useEffect } from 'react';

const useIsIos = () => {
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    // iOSかどうか判定
    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
  }, [isIos]);

  return isIos;
};

export default useIsIos;
