import { useEffect, useRef } from 'react';
import { useWindowSize } from '@/hooks';
import { careerHistoryAnimation } from '@/animations/about';
import { BREAK_POINTS } from '@/constants/common';

type UseCareerHistory = {
  careerHistoryRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
};

const useCareerHistory = (): UseCareerHistory => {
  const careerHistoryRef = useRef<HTMLDivElement>(null!);
  const { width } = useWindowSize();

  const isMobile = width < BREAK_POINTS.SM;

  useEffect(() => {
    const ctx = careerHistoryAnimation({
      elements: careerHistoryRef.current.querySelectorAll(
        '.career-history-item',
      ) as NodeListOf<HTMLElement>,
      careerHistoryRef,
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return { careerHistoryRef, isMobile };
};

export default useCareerHistory;
