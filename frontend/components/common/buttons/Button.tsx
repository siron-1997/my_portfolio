import cn from 'classnames';

import s from '@/styles/common/button/Button.module.css';

/**
 * Button コンポーネントの Props。
 * フォーム送信・リセット・汎用クリック操作に使用する共通ボタン。
 */
type Props = {
  /** ボタンの HTML タイプ（デフォルト: "button"） */
  type?: 'reset' | 'submit' | 'button';

  /** クリック時のコールバック */
  onClick?: () => void;

  /** ボタン内に表示する子要素 */
  children: React.ReactNode;

  /** 外部から追加するクラス名 */
  className?: string;
};

const Button = ({ type = 'button', onClick, children, className }: Props) => {
  const classNames = cn(s.button, className);

  return (
    <button type={type} className={classNames} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
