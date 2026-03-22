import { useCallback, useEffect, useState } from 'react';
import { useWindowSize, useIconSize } from '@/hooks';
import { BREAK_POINTS } from '@/constants/common';

type UseHeader = {
  width: number | undefined;
  iconSize: number;
  isOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
};

const useHeader = (): UseHeader => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { width } = useWindowSize();
  const iconSize = useIconSize(40, 50, 50);

  // ドロワーの開閉を切り替える
  const toggleDrawer = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  // ドロワーを閉じる
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (width !== undefined && width > BREAK_POINTS.SM) {
      closeDrawer();
    }
  }, [width, closeDrawer]);

  return {
    width,
    iconSize,
    isOpen,
    toggleDrawer,
    closeDrawer,
  };
};

export default useHeader;
