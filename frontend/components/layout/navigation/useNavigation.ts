import { useCallback } from 'react';
import s from '@/styles/layout/Navigation.module.css';
import cn from 'classnames';

type UseNavigationProps = {
  className?: string;
  closeDrawer?: () => void;
};

const useNavigation = ({ className, closeDrawer }: UseNavigationProps) => {
  const classNames = cn(className, s.navigation);
  // リンククリック時の処理
  const handleClick = useCallback(() => {
    if (closeDrawer) {
      closeDrawer();
    }
  }, [closeDrawer]);

  return {
    classNames,
    handleClick,
  };
};

export default useNavigation;
