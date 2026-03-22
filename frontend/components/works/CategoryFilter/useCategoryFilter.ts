import { useRef, useEffect } from 'react';
import { useWorksContext } from '@/contexts';
import { useWindowSize } from '@/hooks';
import { categoryFilterAnimation } from '@/animations/works';

export const useCategoryFilter = () => {
  const categoryFilterRef = useRef<HTMLDivElement>(null!);
  const { setCategories } = useWorksContext();
  const { width } = useWindowSize();

  useEffect(() => {
    const ctx = categoryFilterAnimation({
      categoryFilter: categoryFilterRef.current,
      categoryFilterRef,
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return { categoryFilterRef, setCategories, width };
};
