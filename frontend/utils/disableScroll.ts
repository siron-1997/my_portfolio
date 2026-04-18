/**
 * ローディング状態に応じてページのスクロールを制御するユーティリティ関数
 * useEffect 内で使用し、戻り値をクリーンアップ関数として返すことを想定。
 *
 * @param {boolean} isLoading - ローディング中の場合 true
 * @returns {() => void} overflow を元に戻すクリーンアップ関数
 * @example
 * useEffect(() => disableScroll(isLoading), [isLoading]);
 */
const disableScroll = (isLoading: boolean): (() => void) => {
  const html: HTMLElement = document.documentElement;
  const body: HTMLElement = document.body;

  /** ローディング中はスクロールを禁止 */
  if (isLoading) {
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  } else {
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
  }

  /** クリーンアップ */
  return () => {
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
  };
};

export default disableScroll;
