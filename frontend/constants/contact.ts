import { SectionHeader, StepStates } from '@/types/common';

export const INTRODUCTION: SectionHeader = {
  title: 'Contact',
  description: '質問、依頼などのお問合せはこちら。',
};

export const CONFIRM_MESSAGE =
  'このページを離れようとしています。変更内容は保存されません。';

/** Eメールのバリデーション (RFC 5322 準拠) */
export const EMAIL_VALIDATION =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+[.]+[A-Za-z0-9]{2,}$/;

export const STEP_STATUS: StepStates = {
  NOT_STARTED: 'not_started',
  CURRENT: 'current',
  ERROR: 'error',
  COMPLETED: 'completed',
};
