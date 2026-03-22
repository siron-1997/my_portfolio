import useButton from './useButton';

type Props = {
  type?: 'reset' | 'submit' | 'button';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

const Button = ({ type = 'button', onClick, children, className }: Props) => {
  const { classNames } = useButton(className);

  return (
    <button type={type} className={classNames} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
