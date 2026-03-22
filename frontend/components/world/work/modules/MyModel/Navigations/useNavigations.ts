import { useWorkThreeDContext } from '@/contexts';
import { useWindowSize } from '@/hooks';

const useNavigations = () => {
  const { dispatch } = useWorkThreeDContext();
  const { width } = useWindowSize();

  const handleClick = (index: number): void => {
    dispatch({ type: 'NAVIGATE_TO', payload: index });
  };

  return {
    width,
    handleClick,
  };
};

export default useNavigations;
