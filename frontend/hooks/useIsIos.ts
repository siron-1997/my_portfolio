'use client';

import { useEffect,useState } from 'react';

/**
 * 現在のデバイスが iOS（iPad / iPhone / iPod）かどうかを判定するカスタムフック。
 * IE11 の誤検知防止のため MSStream プロパティを併用して判定する。
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
    /** MSStream は IE11 以下にのみ存在するプロパティで、iOS の誤検知防止に使用する */
    const w = window as Window & { MSStream?: unknown };

    /** iOS デバイスかどうかを判定 */
    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent) && !w.MSStream);
  }, []);

  return isIos;
};

export default useIsIos;
