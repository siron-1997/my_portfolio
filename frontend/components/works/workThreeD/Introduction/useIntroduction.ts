import { useEffect } from 'react';
import cn from 'classnames';
import { useWorkThreeDContext } from '@/contexts';
import { introductionAnimation } from '@/animations/workThreeD';
import s from '@/styles/works/workThreeD/Introduction.module.css';

const useIntroduction = () => {
  const {
    refs: { introductionRef },
    state: { isLoading, isViewerActive },
  } = useWorkThreeDContext();
  const classNames = cn('root_container', s.introduction, {
    [s.not_active]: !isViewerActive,
  });

  useEffect(() => {
    if (!isLoading) {
      const ctx = introductionAnimation({
        section: introductionRef.current.querySelector('section')!,
        introductionRef,
      });
      return () => {
        ctx.revert();
      };
    }
  }, [isLoading, introductionRef]);

  return {
    introductionRef,
    classNames,
  };
};

export default useIntroduction;
