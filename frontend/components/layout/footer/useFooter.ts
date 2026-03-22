import { useIconSize } from '@/hooks';

const useFooter = () => {
  const iconSize = useIconSize(35, 35, 35);
  const currentYear = 2023;
  const copyright = `${currentYear} Junpei Oue`;

  return {
    iconSize,
    copyright,
  };
};

export default useFooter;
