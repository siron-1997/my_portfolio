import { useEffect,useRef } from 'react';

import { fingerPressAnimation } from '@/animations/workThreeD';
import { BREAK_POINTS } from '@/constants/common';
import { useWorkThreeDContext } from '@/contexts';
import { useIconSize,useWindowSize } from '@/hooks';

const useFingerPress = () => {
  const fingerPressRef = useRef<HTMLDivElement>(null!);
  const imageRef = useRef<HTMLImageElement>(null!);
  const textRef = useRef<HTMLParagraphElement>(null!);
  const {
    state: { isFingerVisible, isViewerActive },
    dispatch,
  } = useWorkThreeDContext();
  const setIsFingerVisible = (value: boolean) =>
    dispatch({ type: 'SET_FINGER_VISIBLE', payload: value });
  const { width } = useWindowSize();
  const iconSize = useIconSize(75, 85, 95);
  /** ブレイクポイントがモバイルかどうか */
  const isBreakPointMB = width! < BREAK_POINTS.XS;

  useEffect(() => {
    const currentWidth = isBreakPointMB ? 130 : 250;
    const ctx = fingerPressAnimation({
      image: imageRef.current,
      text: textRef.current,
      fingerPressRef,
      currentWidth,
      isFingerVisible,
    });
    return () => ctx.revert();
  }, [width, isBreakPointMB, isFingerVisible, isViewerActive]);

  return {
    fingerPressRef,
    imageRef,
    textRef,
    isFingerVisible,
    setIsFingerVisible,
    isViewerActive,
    iconSize,
  };
};

export default useFingerPress;
