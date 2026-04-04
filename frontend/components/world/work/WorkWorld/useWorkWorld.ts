import { useWorkThreeDContext } from '@/contexts';

/**
 * WorkWorld の Canvas 初期化とポインター操作イベントを管理する。
 *
 * @returns Canvas 用イベントハンドラ
 */
const useWorkWorld = () => {
  const { dispatch } = useWorkThreeDContext();

  /**
   * Canvas の作成完了時にローディング状態を解除する。
   * @returns {void} 戻り値は返さない
   */
  const handleCreated = () => {
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  /**
   * ポインター操作開始時にガイド表示を非表示にする。
   * @returns {void} 戻り値は返さない
   */
  const handlePointerDown = () => {
    dispatch({ type: 'SET_FINGER_VISIBLE', payload: false });
  };

  return {
    handleCreated,
    handlePointerDown,
  };
};

export default useWorkWorld;
