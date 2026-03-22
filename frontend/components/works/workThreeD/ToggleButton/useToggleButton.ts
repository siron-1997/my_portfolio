import { useEffect, useRef } from 'react';
import { useWorkThreeDContext } from '@/contexts';
import cn from 'classnames';
import { toggleButtonAnimation } from '@/animations/workThreeD';
import s from '@/styles/common/button/Toggle.module.css';

const useToggleButton = () => {
  const bgRef = useRef<HTMLDivElement>(null!);
  const {
    refs: { toggleButtonRef },
    state: { isViewerActive },
    dispatch,
  } = useWorkThreeDContext();
  const leftButtonClassNames = cn(s.toggle_button, s.left);
  const rightButtonClassNames = cn(s.toggle_button, s.right);

  const textStyle = {
    display: 'block',
    position: 'relative',
    fontSize: 20,
    lineHeight: 2,
    width: 130,
    height: 45,
    transition: 'all 0.25s',
  };

  const handleClick = (bool: boolean): void => {
    dispatch({ type: 'TOGGLE_VIEWER', payload: bool });
  };

  /* アニメーション作成 */
  useEffect(() => {
    const ctx = toggleButtonAnimation({
      bg: bgRef.current,
      toggleButtonRef,
      isViewerActive,
    });
    return () => {
      ctx.revert();
    };
  }, [toggleButtonRef, isViewerActive]);

  return {
    bgRef,
    toggleButtonRef,
    isViewerActive,
    leftButtonClassNames,
    rightButtonClassNames,
    textStyle,
    handleClick,
  };
};

export default useToggleButton;
