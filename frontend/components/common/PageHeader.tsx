import cn from 'classnames';

import { Container } from '@/components/common';
import s from '@/styles/common/PageHeader.module.css';

/**
 * PageHeader コンポーネントの Props。
 * 各ページ上部に配置するヘッダー領域（figure + figcaption 構造）。
 */
type Props = {
  /** figure 要素の HTML ID（スクロールアンカー等に使用） */
  id: string;

  /** figure 要素に追加するクラス名 */
  figureClassName?: string;

  /** figcaption 要素に追加するクラス名 */
  figcaptionClassName?: string;

  /** ページヘッダー内に表示する子要素 */
  children: React.ReactNode;
};

const PageHeader = ({ id, children, figureClassName, figcaptionClassName }: Props) => {
  const figureClassNames = cn(s.figure, figureClassName);
  const figcaptionClassNames = cn(s.figcaption, figcaptionClassName);

  return (
    <figure className={figureClassNames} id={id}>
      <figcaption className={figcaptionClassNames}>
        <Container>{children}</Container>
      </figcaption>
    </figure>
  );
};

export default PageHeader;
