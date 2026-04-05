/** ページ共通コンポーネントの型 */
export type SectionHeader = Readonly<{
  /** セクションのタイトル文字列 */
  title: string;

  /** セクションの説明文 */
  description: string;
}>;

/** SiteMapItem の型定義 */
export type SiteMapItem = Readonly<{
  /** ナビゲーションに表示するリンクテキスト */
  title: string;

  /** リンク先のパス */
  href: string;
}>;

/** Sns の型定義 */
export type Sns = Readonly<{
  /** SNS アイコン画像のファイルパス */
  imageFilePath: string;

  /** アイコン画像の代替テキスト */
  alt: string;

  /** SNS プロフィールページへの URL */
  href: string;
}>;

/** About ページ関連の型 */
export type Skill = Readonly<{
  /** スキルアイコン画像のパス */
  image: string;

  /** スキルアイコンの代替テキスト */
  alt: string;

  /** スキル名 */
  name: string;

  /** 経験年数の表示文字列 */
  year: string;
}>;

/** Skills の型定義 */
export type Skills = Readonly<{
  /** スキルカテゴリのタイトル */
  title: string;

  /** カテゴリに属するスキルの配列 */
  skills: Skill[];
}>;

/** CareerHistory の型定義 */
export type CareerHistory = Readonly<{
  /** 経歴の年（表示用文字列） */
  year: string;

  /** 経歴のタイトル */
  title: string;

  /** 経歴の説明文 */
  description: string;

  /** タイムラインアイコンの種別（学校 or 職歴） */
  iconType: 'school' | 'work';

  /** タイムラインドットの色（MUI color） */
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}>;

/** GSAP アニメーション設定の型 */
export type AnimationFrom = Readonly<{
  /** アニメーション開始時の X 方向オフセット（px） */
  x?: number;

  /** アニメーション開始時の Y 方向オフセット（px） */
  y?: number;

  /** アニメーション開始時の不透明度（0、1） */
  opacity: number;
}>;

/** AnimationTo の型定義 */
export type AnimationTo = Readonly<{
  /** アニメーション終了時の X 方向オフセット（px） */
  x?: number;

  /** アニメーション終了時の Y 方向オフセット（px） */
  y?: number;

  /** アニメーション終了時の不透明度（0、1） */
  opacity: number;

  /** アニメーションの再生時間（秒） */
  duration: number;

  /** アニメーション開始までの遅延時間（秒） */
  delay?: number;

  /** GSAP のイージング関数名 */
  ease: string;
}>;

/** GsapAnimationConfig の型定義 */
export type GsapAnimationConfig = Readonly<{
  /** アニメーション開始時の状態 */
  from: AnimationFrom;

  /** アニメーション終了時の状態 */
  to: AnimationTo;
}>;
