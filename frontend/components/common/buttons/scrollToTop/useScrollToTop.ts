import { useState, useEffect } from 'react';

const useScrollToTop = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // スクロール量に応じて表示・非表示を切り替え
  const handleVisible = () => {
    setIsVisible(window.scrollY > 300);
  };

  // ページトップにスクロール
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleVisible);
    handleVisible(); // 初期表示

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
