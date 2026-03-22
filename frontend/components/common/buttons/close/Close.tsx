import Image from 'next/image';
import useClose from './useClose';

type Props = {
  className?: string;
  onClose: () => void;
};

const Close = ({ className, onClose }: Props) => {
  const { iconSize, rootClassNames } = useClose(className);

  return (
    <div className={rootClassNames} onClick={onClose}>
      <Image
        src="/icons/close.svg"
        alt="close"
        width={iconSize}
        height={iconSize}
        quality={1}
        priority={true}
      />
    </div>
  );
};

export default Close;
