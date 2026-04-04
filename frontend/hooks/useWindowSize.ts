'use client';

import { useLayoutEffect, useState } from 'react';

/** ブラウザウィンドウの幅と高さ */
type WindowSize = {
  /** ウィンドウの内幅（px） */
  width: number;

  /** ウィンドウの内高（px） */
  height: number;
};

/**
 * ブラウザウィンドウの幅・高さをリアルタイムに取得するカスタムフック。
 * resize イベントを購読して常に最新値を返す。
 *
 * @returns {WindowSize} 現在のウィンドウサイズ（初回レンダリング時は { width: 0, height: 0 }）
 *
 * @example
 * const { width, height } = useWindowSize();
 */
const useWindowSize = (): WindowSize => {
  /** 現在のウィンドウサイズ */
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const handler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handler();
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
