/** コンタクトページのフォームステップ */
export type FormStep = 'INPUT' | 'CONFIRM' | 'RESULT';

/** プログレスバーの各ステップが取りうる表示状態 */
export type StepPointState = 'not_started' | 'current' | 'error' | 'completed';

/** ステップの状態 */
export type StepStates = {
  /** 未開始状態の定数値 */
  NOT_STARTED: 'not_started';

  /** 現在進行中の定数値 */
  CURRENT: 'current';

  /** エラー状態の定数値 */
  ERROR: 'error';

  /** 完了状態の定数値 */
  COMPLETED: 'completed';
};

/** useReducer のアクション型 */
export type ContactFormAction =
  /** フォームステップを設定 */
  | { type: 'SET_FORM_STEP'; payload: FormStep }
  /** 「入力内容確認」ボタンをクリックした実績フラグを設定 */
  | { type: 'SET_ATTEMPTED_ADVANCE'; payload: boolean }
  /** バリデーションエラーの発生フラグを設定 */
  | { type: 'SET_HAS_VALIDATION_ERROR'; payload: boolean }
  /** 送信完了を通知 */
  | { type: 'FINISH_SENDING' };
