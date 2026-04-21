import cn from 'classnames';

import s from '@/styles/common.module.css';

type Props = {
  /** コンテナ内に表示する子要素 */
  children?: React.ReactNode;

  /** 外部から追加するクラス名 */
  className?: string;

  /** コンテナの HTML ID */
  id?: string;

  /** インラインスタイル */
  style?: React.CSSProperties;

  /** 外部から渡す ref */
  ref?: React.RefObject<HTMLDivElement>;
};

const Container = ({ children, className, id, style, ref }: Props) => {
  const rootClassName = cn(s.container, className);

  return (
    <div className={rootClassName} id={id} style={style} ref={ref}>
      {children}
    </div>
  );
};

export default Container;
