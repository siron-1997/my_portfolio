import { useEffect } from 'react';

import cn from 'classnames';

import { controlsAnimation } from '@/animations/workThreeD';
import { useWorkThreeDContext } from '@/contexts';
import { useWindowSize } from '@/hooks';
import s from '@/styles/works/workThreeD/Controls.module.css';

const useControls = () => {
  const {
    refs: { controlsRef },
    state: { currentIndex, isLoading },
    dispatch,
  } = useWorkThreeDContext();
  const { width } = useWindowSize();

  const rootClassNames = cn('root_container', s.controls);

  const handleClick = (index: number): void => {
    dispatch({ type: 'NAVIGATE_TO', payload: index });
  };

  useEffect(() => {
    if (!isLoading) {
      const ctx = controlsAnimation({
        section: controlsRef.current.querySelector('section') as HTMLDivElement,
        listPC: controlsRef.current.querySelector(
          '#contents-pc',
        ) as HTMLDivElement,
        listMB: controlsRef.current.querySelector(
          '#contents-mb',
        ) as HTMLDivElement,
        controlsRef,
      });
      return () => ctx.revert();
    }
  }, [controlsRef, isLoading]);

  return {
    width,
    controlsRef,
    currentIndex,
    rootClassNames,
    handleClick,
  };
};

export default useControls;
