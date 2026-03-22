import { useRef, useEffect } from 'react';
import { portalAnimation } from '@/animations/works';

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
