'use client';

import React from 'react';
import Image from 'next/image';

import { Typography } from '@mui/material';
import cn from 'classnames';

import { STEP_LABELS, STEP_STATUS } from '@/constants/contact';
import { useIconSize } from '@/hooks';
import s from '@/styles/contact/StepProgressBar.module.css';
import { type FormStep, type StepPointState } from '@/types/contact';

type Props = {
  /** 現在のフォームステップ */
  formStep: FormStep;

  /** 送信結果の成功フラグ */
  isSubmitSuccessful: boolean;

  /** バリデーションエラー発生フラグ */
  hasValidationError: boolean;

  /** プログレスバー全体のラッパークラス名 */
  wrapperClassName?: string;

  /** プログレスバーのクラス名 */
  progressClassName?: string;

  /** ラベルのクラス名 */
  labelClassName?: string;

  /** 現在ステップコンテンツのラッパークラス名 */
  contentClassName?: string;

  /** モバイル表示の現在ステップラベルのクラス名 */
  currentStepClassName?: string;
};

/** 固定3ステップのラベル一覧を作成する処理
 *
 * @param formStep 現在のフォームステップ
 * @param isSubmitSuccessful 送信成功フラグ
 * @returns 各ステップのラベルの配列
 */
const getStepLabels = (
  formStep: FormStep,
  isSubmitSuccessful: boolean,
): [string, string, string] => {
  const step3Label =
    formStep !== 'RESULT'
      ? STEP_LABELS.SEND
      : isSubmitSuccessful
        ? STEP_LABELS.SEND_SUCCESS
        : STEP_LABELS.SEND_FAILURE;
  return [STEP_LABELS.INPUT, STEP_LABELS.CONFIRM, step3Label];
};

/** 固定3ステップの表示状態の一覧を作成する処理
 *
 * @param formStep 現在のフォームステップ
 * @param hasValidationError バリデーションエラー発生フラグ
 * @param isSubmitSuccessful 送信成功フラグ
 * @returns 各ステップの表示状態の配列
 */
const getStepStates = (
  formStep: FormStep,
  hasValidationError: boolean,
  isSubmitSuccessful: boolean,
): [StepPointState, StepPointState, StepPointState] => {
  switch (formStep) {
    case 'INPUT':
      return [
        hasValidationError ? STEP_STATUS.ERROR : STEP_STATUS.CURRENT,
        STEP_STATUS.NOT_STARTED,
        STEP_STATUS.NOT_STARTED,
      ];
    case 'CONFIRM':
      return [
        STEP_STATUS.COMPLETED,
        STEP_STATUS.CURRENT,
        STEP_STATUS.NOT_STARTED,
      ];
    case 'RESULT':
      return [
        STEP_STATUS.COMPLETED,
        STEP_STATUS.COMPLETED,
        isSubmitSuccessful ? STEP_STATUS.CURRENT : STEP_STATUS.ERROR,
      ];
  }
};

/** 現在アクティブなステップのインデックスを取得する処理
 *
 * @param formStep 現在のフォームステップ
 * @returns アクティブなステップのインデックス (0: 入力, 1: 確認, 2: 結果)
 */
const getActiveIndex = (formStep: FormStep): 0 | 1 | 2 => {
  switch (formStep) {
    case 'INPUT':
      return 0;
    case 'CONFIRM':
      return 1;
    case 'RESULT':
      return 2;
  }
};

/** 3ステップ固定のステップ識別名 */
const STEP_NAMES = ['step-1', 'step-2', 'step-3'] as const;

const StepProgressBar = React.memo(
  ({
    formStep,
    isSubmitSuccessful,
    hasValidationError,
    wrapperClassName,
    progressClassName,
    labelClassName,
    contentClassName,
    currentStepClassName,
  }: Props) => {
    /** アイコンサイズを取得 */
    const iconSize = useIconSize(25, 25, 25);

    /** ステップのラベルを取得 */
    const labels = getStepLabels(formStep, isSubmitSuccessful);
    /** ステップの状態を取得 */
    const states = getStepStates(
      formStep,
      hasValidationError,
      isSubmitSuccessful,
    );
    /** 現在アクティブなステップのインデックスを取得 */
    const activeIndex = getActiveIndex(formStep);

    return (
      <div className={cn(s.progress_bar_wrapper, wrapperClassName)}>
        <ul className={cn(s.step_progress_bar, progressClassName)}>
          {STEP_NAMES.map((name, i) => {
            const state = states[i];

            return (
              <li
                key={name}
                className={cn(s.progress_step, {
                  /** 完了ステップ時に付与するクラス名 */
                  [s.completed]: state === STEP_STATUS.COMPLETED,
                  /** 現在ステップ時に付与するクラス名 */
                  [s.current]: state === STEP_STATUS.CURRENT,
                  /** エラーステップ時に付与するクラス名 */
                  [s.has_error]: state === STEP_STATUS.ERROR,
                })}
              >
                {state === STEP_STATUS.COMPLETED ? (
                  /** 完了ステップのアイコン */
                  <span className={s.step_icon}>
                    <Image
                      src="/icons/step_check.svg"
                      alt="check"
                      width={iconSize}
                      height={iconSize}
                      quality={1}
                      priority={true}
                    />
                  </span>
                ) : state === STEP_STATUS.ERROR ? (
                  /** エラーステップのアイコン */
                  <span className={s.step_icon}>!</span>
                ) : (
                  /** 現在ステップのインデックス */
                  <span className={s.step_index}>{i + 1}</span>
                )}

                {/* ラベル */}
                <div className={cn(s.step_label, labelClassName)}>
                  {labels[i]}
                </div>
              </li>
            );
          })}
        </ul>

        {/* モバイル時に表示する現在アクティブなステップのラベル */}
        <div className={cn(s.step_content, contentClassName)}>
          <Typography
            component="p"
            variant="p"
            className={currentStepClassName}
          >
            {labels[activeIndex]}
          </Typography>
        </div>
      </div>
    );
  },
);

StepProgressBar.displayName = 'StepProgressBar';

export default StepProgressBar;
