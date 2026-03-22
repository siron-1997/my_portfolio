import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import getScrollTriggerOption from '@/utils/gsap';
import { BREAK_POINTS } from '@/constants/common';
import {
  BACK_OUT_OPACITY_RIGHT_MOVE,
  BACK_OUT_OPACITY_LEFT_MOVE,
  POWER4_OUT_OPACITY_TOP_MOVE,
} from '@/constants/common';

gsap.registerPlugin(ScrollTrigger);

type CardsProps = {
  contentItems: NodeListOf<Element>;
  contentsRef: React.RefObject<HTMLDivElement>;
};

type CategoryFilterProps = {
  categoryFilter: HTMLDivElement;
  categoryFilterRef: React.RefObject<HTMLDivElement>;
};

type PortalProps = {
  title: HTMLHeadingElement;
  titleRef: React.RefObject<HTMLHeadingElement>;
};

export const contentsAnimation = ({ contentItems, contentsRef }: CardsProps) => {
  const ctx = gsap.context(() => {
    const width = window.innerWidth;
    let point = true;

    Array.from(contentItems).forEach((item: any, i: number) => {
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
        // from
        width < BREAK_POINTS.XS && !((i + 1) % 2 === 0)
          ? BACK_OUT_OPACITY_RIGHT_MOVE.from
          : width < BREAK_POINTS.XS && (i + 1) % 2 === 0
            ? BACK_OUT_OPACITY_LEFT_MOVE.from
            : point
              ? BACK_OUT_OPACITY_RIGHT_MOVE.from
              : BACK_OUT_OPACITY_LEFT_MOVE.from,
        // to
        width < BREAK_POINTS.XS && !((i + 1) % 2 === 0)
          ? BACK_OUT_OPACITY_RIGHT_MOVE.to
          : width < BREAK_POINTS.XS && (i + 1) % 2 === 0
            ? BACK_OUT_OPACITY_LEFT_MOVE.to
            : point
              ? BACK_OUT_OPACITY_RIGHT_MOVE.to
              : BACK_OUT_OPACITY_LEFT_MOVE.to,
      );

      switch (true) {
        case (i + 1) % 2 === 0 && width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM: // tb
        case (i + 1) % 3 === 0 && width >= BREAK_POINTS.SM: // pc
          point = !point;
          break;
        default:
          break;
      }
    });
  }, contentsRef);

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
