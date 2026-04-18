import { type JSX } from 'react';

import cn from 'classnames';

import s from '@/styles/common.module.css';

type Props = {
  /** ボタンの種類 */
  type?: 'reset' | 'submit' | 'button';

  /** クリック時のコールバック */
  onClick?: () => void;

  /** ボタン内に表示する子要素 */
  children: React.ReactNode;

  /** クラス名 */
  className?: string;
};

const Button = ({
  type = 'button',
  onClick,
  children,
  className,
}: Props): JSX.Element => {
  const classNames = cn(s.button, className);

  return (
    <button type={type} className={classNames} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
