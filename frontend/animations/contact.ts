import React from 'react';
import { gsap } from 'gsap';
import { POWER2_OUT_OPACITY_TOP_MOVE } from '@/constants/common';

/** Props の型定義 */
type Props = {
  /** title */
  title: HTMLHeadingElement;
  /** progressBar */
  progressBar: HTMLDivElement;
  /** progressStatusRef */
  progressStatusRef: React.RefObject<HTMLDivElement | null>;
};

export const progressStatusAnimation = ({
  title,
  progressBar,
  progressStatusRef,
}: Props) => {
  const ctx = gsap.context(() => {
    /* title*/
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 0.8,
    });
    /* progress */
    gsap.fromTo(progressBar, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 0.8,
    });
  }, progressStatusRef);

  return ctx;
};
