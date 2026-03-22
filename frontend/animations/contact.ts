import React from 'react';
import { gsap } from 'gsap';
import { POWER2_OUT_OPACITY_TOP_MOVE } from '@/constants/common';

type Props = {
  title: HTMLHeadingElement;
  progressBar: HTMLDivElement;
  progressStatusRef: React.RefObject<HTMLDivElement>;
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
