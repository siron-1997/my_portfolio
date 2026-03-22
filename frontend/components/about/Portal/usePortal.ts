import { useRef, useEffect } from 'react';
import { portalAnimation } from '@/animations/about';

export const usePortal = () => {
  const titleRef = useRef<HTMLHeadingElement>(null!);

  useEffect(() => {
    const ctx = portalAnimation({ title: titleRef.current, titleRef });
    return () => {
      ctx.revert();
    };
  }, []);

  return { titleRef };
};
