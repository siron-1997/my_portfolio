import { useWorkThreeDContext } from '@/contexts';

const useMyControls = () => {
  const {
    state: { isViewerActive },
  } = useWorkThreeDContext();

  return {
    isViewerActive,
  };
};

export default useMyControls;
