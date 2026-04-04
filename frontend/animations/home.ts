import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import getScrollTriggerOption from '@/utils/gsap';
import {
  POWER2_OUT_OPACITY_TOP_MOVE,
  POWER2_OUT_OPACITY_LEFT_MOVE,
} from '@/constants/common';

gsap.registerPlugin(ScrollTrigger);

/** PortalProps の型定義 */
type PortalProps = {
  /** title */
  title: HTMLHeadingElement;
  /** portalRef */
  portalRef: React.RefObject<HTMLDivElement | null>;
};

/** WorksProps の型定義 */
type WorksProps = {
  /** title */
  title: HTMLHeadingElement;
  /** cards */
  cards: HTMLDivElement;
  /** worksRef */
  worksRef: React.RefObject<HTMLElement | null>;
};

export const portalAnimation = ({ title, portalRef }: PortalProps) => {
  const ctx = gsap.context(() => {
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 1.5,
    });
  }, portalRef);

  return ctx;
};

export const worksAnimation = ({ title, cards, worksRef }: WorksProps) => {
  const ctx = gsap.context(() => {
    /* Works見出し */
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({ element: worksRef.current!, start: 'top bottom' }),
    });
    /* Works カード */
    gsap.fromTo(cards, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
      ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
      ...getScrollTriggerOption({ element: cards, start: '20% bottom', delay: 0.8 }),
    });
  });

  return ctx;
};
