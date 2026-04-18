import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';

import {
  BACK_OUT_OPACITY_LEFT_MOVE,
  BACK_OUT_OPACITY_RIGHT_MOVE,
  BREAK_POINTS,
  POWER4_OUT_OPACITY_TOP_MOVE,
} from '@/constants/common';
import { getScrollTriggerOption } from '@/utils';

gsap.registerPlugin(ScrollTrigger);

type ContentsAnimationProps = {
  /** アニメーション対象のコンテンツカード要素のリスト */
  contentItems: NodeListOf<HTMLElement>;

  /** コンテンツコンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

type CategoryFilterAnimationProps = {
  /** アニメーション対象のカテゴリフィルター要素 */
  categoryFilter: HTMLDivElement;

  /** カテゴリフィルターコンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

type PortalAnimationProps = {
  /** アニメーション対象のタイトル要素 */
  title: HTMLHeadingElement;

  /** タイトル要素の参照 Ref */
  titleRef: React.RefObject<HTMLHeadingElement | null>;
};

/**
 * コンテンツのアニメーション初期化処理
 * ウィンドウ幅に応じて左右交互にスライドインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const contentsAnimation = ({
  contentItems,
  ref,
}: ContentsAnimationProps): gsap.Context => {
  return gsap.context(() => {
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
        /** アニメーション開始値 */
        width < BREAK_POINTS.XS && !((i + 1) % 2 === 0)
          ? BACK_OUT_OPACITY_RIGHT_MOVE.from
          : width < BREAK_POINTS.XS && (i + 1) % 2 === 0
            ? BACK_OUT_OPACITY_LEFT_MOVE.from
            : point
              ? BACK_OUT_OPACITY_RIGHT_MOVE.from
              : BACK_OUT_OPACITY_LEFT_MOVE.from,

        /** アニメーション終了値 */
        width < BREAK_POINTS.XS && !((i + 1) % 2 === 0)
          ? BACK_OUT_OPACITY_RIGHT_MOVE.to
          : width < BREAK_POINTS.XS && (i + 1) % 2 === 0
            ? BACK_OUT_OPACITY_LEFT_MOVE.to
            : point
              ? BACK_OUT_OPACITY_RIGHT_MOVE.to
              : BACK_OUT_OPACITY_LEFT_MOVE.to,
      );

      switch (true) {
        /** タブレット幅（XS 〜 SM）では 2 列のため、2 番目ごとに反転 */
        case (i + 1) % 2 === 0 &&
          width >= BREAK_POINTS.XS &&
          width < BREAK_POINTS.SM:
        /** PC 幅（SM 以上）では 3 列のため、3 番目ごとに反転 */
        case (i + 1) % 3 === 0 && width >= BREAK_POINTS.SM:
          point = !point;
          break;
        default:
          break;
      }
    });
  }, ref);
};

/**
 * カテゴリフィルターのアニメーション初期化処理
 * ページ表示時に上からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const categoryFilterAnimation = ({
  categoryFilter,
  ref,
}: CategoryFilterAnimationProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(categoryFilter, POWER4_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER4_OUT_OPACITY_TOP_MOVE.to,
      delay: 0.8,
    });
  }, ref);
};

/**
 * ポータルタイトルのアニメーション初期化処理
 * ページ表示時に左からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const portalAnimation = ({
  title,
  titleRef,
}: PortalAnimationProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(title, BACK_OUT_OPACITY_LEFT_MOVE.from, {
      ...BACK_OUT_OPACITY_LEFT_MOVE.to,
      delay: 0.4,
    });
  }, titleRef);
};
