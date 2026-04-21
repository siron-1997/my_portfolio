type Props = {
  /** ScrollTrigger のトリガー要素 */
  element: HTMLElement;

  /** アニメーション開始位置（デフォルト: 'top bottom'） */
  start?: 'top bottom' | string;

  /** アニメーション終了位置（デフォルト: 'bottom top'） */
  end?: 'bottom top' | string;

  /** アニメーション開始遅延時間（秒） */
  delay?: number;

  /** ScrollTrigger デバッグマーカーの表示フラグ */
  markers?: boolean;

  /** ScrollTrigger の識別 ID */
  id?: string;
};

/**
 * GSAP の ScrollTrigger オプションオブジェクトを生成するユーティリティ関数
 *
 * @param {Props} props - ScrollTrigger の設定パラメータ
 * @returns {Pick<gsap.TweenVars, 'scrollTrigger'> & { delay?: number }} GSAP アニメーションに渡す ScrollTrigger オプション
 *
 * @example
 * gsap.from(el, {
 *   opacity: 0,
 *   ...getScrollTriggerOption({ element: el }),
 * });
 */
const getScrollTriggerOption = ({
  element,
  start = 'top bottom',
  end = 'bottom top',
  delay,
  markers,
  id,
}: Props): Pick<gsap.TweenVars, 'scrollTrigger'> & { delay?: number } => ({
  delay,
  scrollTrigger: {
    trigger: element,
    markers,
    start,
    end,
    id,
  },
});

export default getScrollTriggerOption;
