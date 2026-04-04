import React from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { getScrollTriggerOption } from '@/utils';
import {
  BACK_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_RIGHT_MOVE,
} from '@/constants/common';

gsap.registerPlugin(ScrollTrigger);

/** PortalProps の型定義 */
type PortalProps = {
  /** title */
  title: HTMLHeadingElement;
  /** titleRef */
  titleRef: React.RefObject<HTMLHeadingElement | null>;
};

/** IntroductionProps の型定義 */
type IntroductionProps = {
  /** section */
  section: HTMLElement;
  /** introductionRef */
  introductionRef: React.RefObject<HTMLDivElement | null>;
};

/** ProfileImageProps の型定義 */
type ProfileImageProps = {
  /** image */
  image: HTMLImageElement;
  /** profileImageRef */
  profileImageRef: React.RefObject<HTMLDivElement | null>;
};

/** SkillsProps の型定義 */
type SkillsProps = {
  /** skillList */
  skillList: NodeListOf<Element>;
  /** skillsListRef */
  skillsListRef: React.RefObject<HTMLDivElement | null>;
};

/** CareerHistoryProps の型定義 */
type CareerHistoryProps = {
  /** elements */
  elements: NodeListOf<Element>;
  /** careerHistoryRef */
  careerHistoryRef: React.RefObject<HTMLDivElement | null>;
};

/** ポータルタイトルのアニメーション
 * @param title - ポータルタイトルの要素
 * @param titleRef - ポータルタイトル全体の ref
 * @returns gsap.Context
 */
export const portalAnimation = ({ title, titleRef }: PortalProps): gsap.Context => {
  const ctx = gsap.context(() => {
    gsap.fromTo(title, BACK_OUT_OPACITY_LEFT_MOVE.from, {
      ...BACK_OUT_OPACITY_LEFT_MOVE.to,
      delay: 0.4,
    });
  }, titleRef);

  return ctx;
};

/** 紹介文のアニメーション
 * @param section - 紹介文のセクション要素
 * @param introductionRef - 紹介文全体の ref
 * @returns gsap.Context
 */
export const introductionAnimation = ({
  section,
  introductionRef,
}: IntroductionProps): gsap.Context => {
  const ctx = gsap.context(() => {
    gsap.fromTo(section, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
      ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
      delay: 0.4,
    });
  }, introductionRef);

  return ctx;
};

/** プロフィール画像のアニメーション
 * @param image - プロフィール画像の要素
 * @param profileImageRef - プロフィール画像全体の ref
 * @returns gsap.Context
 */
export const profileImageAnimation = ({
  image,
  profileImageRef,
}: ProfileImageProps): gsap.Context => {
  const ctx = gsap.context(() => {
    gsap.fromTo(image, POWER2_OUT_OPACITY_RIGHT_MOVE.from, {
      ...POWER2_OUT_OPACITY_RIGHT_MOVE.to,
    });
  }, profileImageRef);

  return ctx;
};

/** スキルリストのアニメーション
 * @param skillList - スキルリストの要素群
 * @param skillsListRef - スキルリスト全体の ref
 * @returns gsap.Context
 */
export const skillsListAnimation = ({
  skillList,
  skillsListRef,
}: SkillsProps): gsap.Context => {
  const ctx = gsap.context(() => {
    Array.from(skillList).forEach((item: Element, i: number) => {
      const title = item.querySelector('h3');
      const list = item.querySelectorAll('.skill-list');
      /* title animation */
      gsap.fromTo(title, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
        ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
        ...getScrollTriggerOption({
          delay: 0.4,
          element: item as HTMLElement,
          id: i.toString(),
        }),
      });
      /* list animation */
      gsap.fromTo(list, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
        ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
        ...getScrollTriggerOption({
          delay: 0.8,
          element: item as HTMLElement,
          id: i.toString(),
        }),
      });
    });
  }, skillsListRef);

  return ctx;
};

/** キャリアヒストリーのアニメーション
 * @param elements - キャリアヒストリーの要素群
 * @param careerHistoryRef - キャリアヒストリー全体の ref
 * @returns gsap.Context
 */
export const careerHistoryAnimation = ({
  elements,
  careerHistoryRef,
}: CareerHistoryProps): gsap.Context => {
  const ctx = gsap.context(() => {
    Array.from(elements).forEach((element: Element, i: number) => {
      gsap.fromTo(element, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
        ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
        ...getScrollTriggerOption({
          delay: 0.4,
          element: element as HTMLElement,
          id: i.toString(),
        }),
      });
    });
  }, careerHistoryRef);

  return ctx;
};
