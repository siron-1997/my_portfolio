import cn from 'classnames';
import { useIconSize } from '@/hooks';
import s from '@/styles/common/button/Hamburger.module.css';

const useHamburger = (className?: string) => {
  const iconSize = useIconSize(40, 50, 50);
  const classNames = cn(className, s.hamburger);

  return {
    iconSize,
    classNames,
  };
};

export default useHamburger;
