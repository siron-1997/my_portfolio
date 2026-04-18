import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type React from 'react';

import {
  BACK_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_RIGHT_MOVE,
} from '@/constants/common';
import { getScrollTriggerOption } from '@/utils';

gsap.registerPlugin(ScrollTrigger);

type PortalProps = {
  /** ポータルの見出し要素 */
  title: HTMLHeadingElement;

  /** コンテナの参照 Ref */
  ref: React.RefObject<HTMLHeadingElement | null>;
};

type IntroductionProps = {
  /** 自己紹介のセクション要素 */
  section: HTMLElement;

  /** コンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

type ProfileImageProps = {
  /** プロフィール画像要素 */
  image: HTMLImageElement;

  /** コンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

type SkillsProps = {
  /** スキルリスト要素のノードリスト */
  skillList: NodeListOf<Element>;

  /** コンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

type CareerHistoryProps = {
  /** キャリアヒストリー要素のノードリスト */
  elements: NodeListOf<Element>;

  /** コンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

/**
 * ポータルタイトルのアニメーション初期化処理
 * ページ表示時に左からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const portalAnimation = ({ title, ref }: PortalProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(title, BACK_OUT_OPACITY_LEFT_MOVE.from, {
      ...BACK_OUT_OPACITY_LEFT_MOVE.to,
      delay: 0.4,
    });
  }, ref);
};

/**
 * 紹介文のアニメーション初期化処理
 * ページ表示時に左からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const introductionAnimation = ({
  section,
  ref,
}: IntroductionProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(section, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
      ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
      delay: 0.4,
    });
  }, ref);
};

/**
 * プロフィール画像のアニメーション初期化処理
 * ページ表示時に右からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const profileImageAnimation = ({
  image,
  ref,
}: ProfileImageProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(image, POWER2_OUT_OPACITY_RIGHT_MOVE.from, {
      ...POWER2_OUT_OPACITY_RIGHT_MOVE.to,
    });
  }, ref);
};

/**
 * スキルリストのアニメーション初期化処理
 * ページ表示時に左からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const skillsListAnimation = ({
  skillList,
  ref,
}: SkillsProps): gsap.Context => {
  return gsap.context(() => {
    Array.from(skillList).forEach((item: Element, i: number) => {
      /** スキルリストのタイトル要素 */
      const title = item.querySelector('h3');

      /** スキルリストの要素 */
      const list = item.querySelectorAll('.skill-list');

      /** タイトルのアニメーション */
      gsap.fromTo(title, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
        ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
        ...getScrollTriggerOption({
          delay: 0.4,
          element: item as HTMLElement,
          id: i.toString(),
        }),
      });

      /** リストのアニメーション */
      gsap.fromTo(list, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
        ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
        ...getScrollTriggerOption({
          delay: 0.8,
          element: item as HTMLElement,
          id: i.toString(),
        }),
      });
    });
  }, ref);
};

/** キャリアヒストリーのアニメーション初期化処理
 * ページ表示時に左からフェードインするアニメーションを設定する。
 *
 * @returns gsap.Context
 */
export const careerHistoryAnimation = ({
  elements,
  ref,
}: CareerHistoryProps): gsap.Context => {
  return gsap.context(() => {
    /** キャリアヒストリーの要素ごとのアニメーション */
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
  }, ref);
};
