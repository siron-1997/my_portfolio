import cn from 'classnames';
import { useIconSize } from '@/hooks';
import s from '@/styles/common/button/Close.module.css';

const useClose = (className?: string) => {
  const iconSize = useIconSize(35, 40, 50);
  const rootClassNames = cn(className, s.close);

  return {
    iconSize,
    rootClassNames,
  };
};

export default useClose;
