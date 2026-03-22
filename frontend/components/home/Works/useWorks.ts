import { useRef, useEffect } from 'react';
import cn from 'classnames';
import { worksAnimation } from '@/animations/home';
import s from '@/styles/home/Works.module.css';

const useWorks = () => {
  const worksRef = useRef<HTMLElement>(null!);
  const rootClassNames = cn('root_container', s.works);

  useEffect(() => {
    const ctx = worksAnimation({
      title: worksRef.current.querySelector('#works-title')!,
      cards: worksRef.current.querySelector('#works-cards')!,
      worksRef,
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return { worksRef, rootClassNames };
};

export default useWorks;
