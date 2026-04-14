import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';

import { BREAK_POINTS } from '@/constants/common';
import {
  BACK_OUT_OPACITY_LEFT_MOVE,
  BACK_OUT_OPACITY_RIGHT_MOVE,
  POWER4_OUT_OPACITY_TOP_MOVE,
} from '@/constants/common';
import getScrollTriggerOption from '@/utils/gsap';

gsap.registerPlugin(ScrollTrigger);

/** CardsProps の型定義 */
type CardsProps = {
  /** contentItems */
  contentItems: NodeListOf<HTMLElement>;
  /** contentsRef */
  ref: React.RefObject<HTMLDivElement | null>;
};

/** CategoryFilterProps の型定義 */
type CategoryFilterProps = {
  /** categoryFilter */
  categoryFilter: HTMLDivElement;
  /** categoryFilterRef */
  categoryFilterRef: React.RefObject<HTMLDivElement | null>;
};

/** PortalProps の型定義 */
type PortalProps = {
  /** title */
  title: HTMLHeadingElement;
  /** titleRef */
  titleRef: React.RefObject<HTMLHeadingElement | null>;
};

export const contentsAnimation = ({ contentItems, ref }: CardsProps) => {
  const ctx = gsap.context(() => {
    const width = window.innerWidth;
    let point = true;

    Array.from(contentItems).forEach((item: HTMLElement, i: number) => {
      const cardAnimate = gsap.timeline({
        ...getScrollTriggerOption({
          delay: 0.4,
          element: item,
          start: 'top 90%',
          end: 'bottom top',
          markers: false,
          id: i.toString(),
        }),
      });

      cardAnimate.fromTo(
        item,
        /** from */
        width < BREAK_POINTS.XS && !((i + 1) % 2 === 0)
          ? BACK_OUT_OPACITY_RIGHT_MOVE.from
          : width < BREAK_POINTS.XS && (i + 1) % 2 === 0
            ? BACK_OUT_OPACITY_LEFT_MOVE.from
            : point
              ? BACK_OUT_OPACITY_RIGHT_MOVE.from
              : BACK_OUT_OPACITY_LEFT_MOVE.from,

        /** to */
        width < BREAK_POINTS.XS && !((i + 1) % 2 === 0)
          ? BACK_OUT_OPACITY_RIGHT_MOVE.to
          : width < BREAK_POINTS.XS && (i + 1) % 2 === 0
            ? BACK_OUT_OPACITY_LEFT_MOVE.to
            : point
              ? BACK_OUT_OPACITY_RIGHT_MOVE.to
              : BACK_OUT_OPACITY_LEFT_MOVE.to,
      );

      switch (true) {
        /** tb */
        case (i + 1) % 2 === 0 &&
          width >= BREAK_POINTS.XS &&
          width < BREAK_POINTS.SM:
        /** pc */
        case (i + 1) % 3 === 0 && width >= BREAK_POINTS.SM:
          point = !point;
          break;
        default:
          break;
      }
    });
  }, ref);

  return ctx;
};

export const categoryFilterAnimation = ({
  categoryFilter,
  categoryFilterRef,
}: CategoryFilterProps) => {
  const ctx = gsap.context(() => {
    gsap.fromTo(categoryFilter, POWER4_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER4_OUT_OPACITY_TOP_MOVE.to,
      delay: 0.8,
    });
  }, categoryFilterRef);

  return ctx;
};

export const portalAnimation = ({ title, titleRef }: PortalProps) => {
  const ctx = gsap.context(() => {
    gsap.fromTo(title, BACK_OUT_OPACITY_LEFT_MOVE.from, {
      ...BACK_OUT_OPACITY_LEFT_MOVE.to,
      delay: 0.4,
    });
  }, titleRef);

  return ctx;
};
