import { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import cn from 'classnames';
import { useContactFormContext } from '@/contexts';
import { useIconSize } from '@/hooks';
import { StepPoint, StepPointAction, StepPointState } from '@/types/common';
import { STEP_STATUS } from '@/constants/contact';
import s from '@/styles/contact/StepProgressBar.module.css';

/** Props の型定義 */
type Props = {
  /** stepPoints */
  stepPoints: StepPoint[];
  /** wrapperClassName */
  wrapperClassName?: string;
  /** progressClassName */
  progressClassName?: string;
  /** labelClassName */
  labelClassName?: string;
  /** contentClassName */
  contentClassName?: string;
};

/**
 * ステップの状態を更新
 * @param stepPoints 現在のステップ配列
 * @param action dispatch から渡されるアクション（index と state を含む）
 * @returns 新しい状態のステップ配列
 */
const stepsReducer = (stepPoints: StepPoint[], action: StepPointAction): StepPoint[] => {
  return stepPoints.map((stepPoint, i) => {
    const newStepPoint = { ...stepPoint };
    switch (true) {
      /** 現在のインデックスより前のステップは「完了」 */
      case i < action.index:
        newStepPoint.state = STEP_STATUS.COMPLETED;
        break;
      /** 現在のインデックスに一致するステップは指定された状態（CURRENT or ERROR） */
      case i === action.index:
        newStepPoint.state = action.state;
        break;
      /** 現在のインデックスより後のステップは「未開始」 */
      default:
        newStepPoint.state = STEP_STATUS.NOT_STARTED;
        break;
    }
    return newStepPoint;
  });
};

/**
 * ステッププログレスバーの状態管理
 * - フォーム全体の進行状況 (formStep) に応じて、プログレスバーの表示を更新する
 * - 状態駆動の設計で、UI の表示を一意に決定する
 * @param stepPoints ステップの初期データ配列
 
 *
 * @example
 * useStepProgressBar({});
 */
const useStepProgressBar = ({
  stepPoints,
  wrapperClassName,
  progressClassName,
  labelClassName,
  contentClassName,
}: Props) => {
  const [currentStepPointIndex, setCurrentStepPointIndex] = useState<number>(0);
  const [stepsState, dispatchSteps] = useReducer(stepsReducer, stepPoints);
  const prevFormStepRef = useRef<string>('');
  const { isSended, formStep, isValidationError } = useContactFormContext();
  const iconSize = useIconSize(25, 25, 25);

  const wrapperClassNames = cn(s.progress_bar_wrapper, wrapperClassName);
  const progressClassNames = cn(s.step_progress_bar, progressClassName);
  const labelClassNames = cn(s.step_label, labelClassName);
  const contentClassNames = cn(s.step_content, contentClassName);

  /** フォームの状態 (formStep) に基づいてプログレスバーの状態を決定し、更新する */
  const handleStepChange = useCallback(() => {
    let nextIndex = currentStepPointIndex;
    let nextState: StepPointState = STEP_STATUS.CURRENT;

    /** 入力画面の場合 */
    if (formStep === 'FIRST_STEP') {
      nextIndex = 0;
      /** 入力内容にエラーがある場合 */
      if (isValidationError) {
        nextState = STEP_STATUS.ERROR;
      }
      /** 確認画面に進んだ場合 */
    } else if (formStep === 'SECOND_STEP') {
      nextIndex = 1;
      /** 送信完了画面に進んだ場合 */
    } else if (formStep === 'LAST_STEP') {
      nextIndex = 2;
      /** 送信に失敗した場合 */
      if (!isSended) {
        nextState = STEP_STATUS.ERROR;
      }
    }

    dispatchSteps({ index: nextIndex, state: nextState });
    setCurrentStepPointIndex(nextIndex);
  }, [currentStepPointIndex, formStep, isValidationError, isSended]);

  useEffect(() => {
    /** formStep の変更を検知してステップを更新 */
    if (prevFormStepRef.current !== formStep) {
      prevFormStepRef.current = formStep;
      handleStepChange();
    }
  }, [formStep, handleStepChange]);

  useEffect(() => {
    /** isValidationError の変更（入力開始）を検知してステップを更新 */
    if (isValidationError) {
      handleStepChange();
    }
  }, [isValidationError, handleStepChange]);

  return {
    isSended,
    stepsState,
    currentStepPointIndex,
    iconSize,
    wrapperClassNames,
    progressClassNames,
    labelClassNames,
    contentClassNames,
  };
};

export default useStepProgressBar;
