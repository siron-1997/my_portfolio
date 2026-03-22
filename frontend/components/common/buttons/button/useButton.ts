import cn from 'classnames';
import s from '@/styles/common/button/Button.module.css';

const useButton = (className?: string) => {
  const classNames = cn(s.button, className);

  return {
    classNames,
  };
};

export default useButton;
