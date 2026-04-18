'use client';

import { useEffect, useState } from 'react';

/**
 * 現在のデバイスが iOS（iPad / iPhone / iPod）かどうかを判定するカスタムフック。
 * iOS 13 以降の iPad は UA が macOS と同一になるため、
 * `navigator.maxTouchPoints` を併用して判定する。
 *
 * @returns {boolean} iOS デバイスの場合 true
 *
 * @example
 * const isIos = useIsIos();
 */
const useIsIos = (): boolean => {
  /** iOS デバイスかどうかの状態 */
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    /** iOS デバイスかどうかを判定する。
     * iOS 13+ の iPad は UA が "Macintosh" になるため、
     * navigator.maxTouchPoints でタッチ対応を併せて確認する。 */
    setIsIos(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    );
  }, []);

  return isIos;
};

export default useIsIos;
