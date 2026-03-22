import cn from 'classnames';
import s from '@/styles/common/PageHeader.module.css';

const usePageHeader = (figureClassName?: string, figcaptionClassName?: string) => {
  const figureClassNames = cn(s.figure, figureClassName);
  const figcaptionClassNames = cn(s.figcaption, figcaptionClassName);

  return {
    figureClassNames,
    figcaptionClassNames,
  };
};

export default usePageHeader;
