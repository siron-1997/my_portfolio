import cn from 'classnames';
import s from '@/styles/common/Container.module.css';

const useContainer = (className?: string) => {
  const rootClassName = cn(s.container, className);

  return {
    rootClassName,
  };
};

export default useContainer;
