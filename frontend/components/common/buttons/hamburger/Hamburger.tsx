'use client';

import Image from 'next/image';
import useHamburger from './useHamburger';

type Props = {
  className?: string;
  iconSize: number;
  onOpen: () => void;
};

const Hamburger = ({ className, iconSize, onOpen }: Props) => {
  const { classNames } = useHamburger(className);

  return (
    <div className={classNames} onClick={onOpen}>
      <Image
        src="/icons/hamburger.svg"
        alt="hamburger menu"
        width={iconSize}
        height={iconSize}
        quality={1}
        priority={true}
      />
    </div>
  );
};

export default Hamburger;
