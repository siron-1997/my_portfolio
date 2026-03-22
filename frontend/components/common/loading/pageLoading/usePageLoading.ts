import { useIconSize } from '@/hooks';

const usePageLoading = () => {
  const iconSize = useIconSize(70, 90, 110);

  return {
    iconSize,
  };
};

export default usePageLoading;
