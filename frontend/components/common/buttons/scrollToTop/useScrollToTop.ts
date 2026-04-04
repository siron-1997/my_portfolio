import { useState, useEffect } from 'react';

/**
 * スクロールトップボタンの表示制御とスクロール処理を管理する。
 *
 * @returns ボタン表示状態とトップ移動関数
 */
const useScrollToTop = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  /**
   * スクロール量に応じて表示・非表示を切り替える。
   * @returns {void} 戻り値は返さない
   */
  const handleVisible = () => {
    setIsVisible(window.scrollY > 300);
  };

  /**
   * ページトップへスムーズスクロールする。
   * @returns {void} 戻り値は返さない
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleVisible);
    /** 初期表示 */
    handleVisible();

    return () => {
      window.removeEventListener('scroll', handleVisible);
    };
  }, []);

  return {
    isVisible,
    scrollToTop,
  };
};

export default useScrollToTop;
