import { useRef, useEffect } from 'react';
import { introductionAnimation } from '@/animations/about';

const useIntroduction = () => {
  const introductionRef = useRef<HTMLDivElement>(null!);
  const sectionId = 'about-introduction-section';

  useEffect(() => {
    const section = introductionRef.current.querySelector(`#${sectionId}`) as HTMLElement;
    const ctx = introductionAnimation({ section, introductionRef });
    return () => ctx.revert();
  }, []);

  return {
    introductionRef,
    sectionId,
  };
};

export default useIntroduction;
