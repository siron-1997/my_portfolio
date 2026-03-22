import { useEffect } from 'react';
import { useHomeContext } from '@/contexts/homeContext';
import { portalAnimation } from '@/animations/home';

const usePortal = () => {
  const { portalRef, isLoading } = useHomeContext();

  useEffect(() => {
    if (!isLoading) {
      const ctx = portalAnimation({
        title: portalRef.current.querySelector('#portal-title')!,
        portalRef,
      });
      return () => {
        ctx.revert();
      };
    } else {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return { portalRef };
};

export default usePortal;
