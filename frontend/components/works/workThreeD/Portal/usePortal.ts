import { useEffect } from 'react';
import { useWorkThreeDContext } from '@/contexts';
import { portalAnimation } from '@/animations/workThreeD';

export const usePortal = () => {
  const {
    refs: { portalRef },
    state: { isLoading },
  } = useWorkThreeDContext();

  useEffect(() => {
    if (!isLoading) {
      const ctx = portalAnimation({
        portal: portalRef.current,
        portalRef,
      });
      return () => {
        ctx.revert();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return {
    portalRef,
  };
};
