import { useWorkThreeDContext } from '@/contexts';

const useWorkWorld = () => {
  const { dispatch } = useWorkThreeDContext();

  /** Canvas の作成が完了した時の処理 */
  const handleCreated = () => {
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  /** マウスダウンした時の処理 */
  const handlePointerDown = () => {
    dispatch({ type: 'SET_FINGER_VISIBLE', payload: false });
  };

  return {
    handleCreated,
    handlePointerDown,
  };
};

export default useWorkWorld;
