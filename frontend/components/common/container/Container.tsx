import useContainer from './useContainer';

type Props = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  ref?: React.RefObject<HTMLDivElement>;
};

const Container = ({ children, className, id, style, ref }: Props) => {
  const { rootClassName } = useContainer(className);

  return (
    <div className={rootClassName} id={id} style={style} ref={ref}>
      {children}
    </div>
  );
};

export default Container;
