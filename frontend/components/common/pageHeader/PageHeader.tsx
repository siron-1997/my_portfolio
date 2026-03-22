import { Container } from '@/components/common';
import usePageHeader from './usePageHeader';

type Props = {
  id: string;
  figureClassName?: string;
  figcaptionClassName?: string;
  children: React.ReactNode;
};

const PageHeader = ({ id, children, figureClassName, figcaptionClassName }: Props) => {
  const { figureClassNames, figcaptionClassNames } = usePageHeader(
    figureClassName,
    figcaptionClassName,
  );

  return (
    <figure className={figureClassNames} id={id}>
      <figcaption className={figcaptionClassNames}>
        <Container>{children}</Container>
      </figcaption>
    </figure>
  );
};

export default PageHeader;
