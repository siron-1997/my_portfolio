import { gsap } from 'gsap';
import type React from 'react';

import { POWER2_OUT_OPACITY_TOP_MOVE } from '@/constants/common';

type ProgressStatusAnimationProps = {
  /** プログレスステータスのタイトル要素 */
  title: HTMLHeadingElement;

  /** プログレスバーのコンテナ要素 */
  progressBar: HTMLDivElement;

  /** コンテナの参照 Ref */
  ref: React.RefObject<HTMLDivElement | null>;
};

/**
 * プログレスステータスのアニメーション初期化処理
 * ページ表示時にタイトルとプログレスバーが上からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const progressStatusAnimation = ({
  title,
  progressBar,
  ref,
}: ProgressStatusAnimationProps): gsap.Context => {
  return gsap.context(() => {
    /** タイトルのアニメーション */
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 0.8,
    });
    /** プログレスバーのアニメーション */
    gsap.fromTo(progressBar, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 0.8,
    });
  }, ref);
};
