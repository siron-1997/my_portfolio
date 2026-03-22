// --- ページ共通コンポーネントの型 ---
export type SectionHeader = {
  readonly title: string;
  readonly description: string;
};

export type SiteMapItem = {
  readonly title: string;
  readonly href: string;
};

export type Sns = {
  readonly imageFilePath: string;
  readonly alt: string;
  readonly href: string;
};

// --- About ページ関連の型 ---
export type Skill = {
  readonly image: string;
  readonly alt: string;
  readonly name: string;
  readonly year: string;
};

export type Skills = {
  readonly title: string;
  readonly skills: Skill[];
};

export type CareerHistory = {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly iconType: 'school' | 'work';
  readonly color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
};

// --- Contact フォーム関連の型 ---
/** フォームの段階 */
export type FormStep = 'FIRST_STEP' | 'SECOND_STEP' | 'LAST_STEP';

/** 各ステップの状態 */
export type StepPointState = 'not_started' | 'current' | 'error' | 'completed';

export type StepPoint = {
  label: string;
  name: string;
  content: React.ReactNode;
  state?: StepPointState;
};

/** StepPointState の定数オブジェクト */
export type StepStates = {
  NOT_STARTED: 'not_started';
  CURRENT: 'current';
  ERROR: 'error';
  COMPLETED: 'completed';
};

export type StepPointAction = {
  index: number;
  state: StepPointState;
};

// --- GSAP アニメーション設定の型 ---
export type AnimationFrom = {
  readonly x?: number;
  readonly y?: number;
  readonly opacity: number;
};

export type AnimationTo = {
  readonly x?: number;
  readonly y?: number;
  readonly opacity: number;
  readonly duration: number;
  readonly delay?: number;
  readonly ease: string;
};

export type GsapAnimationConfig = {
  readonly from: AnimationFrom;
  readonly to: AnimationTo;
};
