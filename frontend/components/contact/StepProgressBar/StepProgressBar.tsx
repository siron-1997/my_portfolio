'use client';

import Image from 'next/image';
import React from 'react';
import cn from 'classnames';
import { StepPoint } from '@/types/common';
import { STEP_STATUS } from '@/constants/contact';
import useStepProgressBar from './useStepProgressBar';
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

const StepProgressBar = ({
  stepPoints,
  wrapperClassName,
  progressClassName,
  labelClassName,
  contentClassName,
}: Props) => {
  const {
    stepsState,
    currentStepPointIndex,
    iconSize,
    wrapperClassNames,
    progressClassNames,
    labelClassNames,
    contentClassNames,
  } = useStepProgressBar({
    stepPoints,
    wrapperClassName,
    progressClassName,
    labelClassName,
    contentClassName,
  });

  return (
    <div className={wrapperClassNames}>
      <ul className={progressClassNames}>
        {stepsState.map((step: StepPoint, i: number) => (
          <li
            key={i}
            className={cn(s.progress_step, {
              [s.completed]: step.state === STEP_STATUS.COMPLETED,
              [s.current]: step.state === STEP_STATUS.CURRENT,
              [s.has_error]: step.state === STEP_STATUS.ERROR,
            })}
          >
            {step.state === STEP_STATUS.COMPLETED ? (
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
            ) : step.state === STEP_STATUS.ERROR ? (
              <span className={s.step_icon}>!</span>
            ) : (
              <span className={s.step_index}>{i + 1}</span>
            )}
            <div className={labelClassNames}>{step.label}</div>
          </li>
        ))}
      </ul>
      {/* モバイル時に表示 */}
      <div className={contentClassNames}>{stepPoints[currentStepPointIndex].content}</div>
    </div>
  );
};

export default StepProgressBar;
