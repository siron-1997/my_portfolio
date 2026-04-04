/** ボーダー色の状態別設定 */
export type BorderColorConfig = Readonly<{
  /** デフォルト状態のボーダー色 */
  default: string;

  /** ホバー時のボーダー色 */
  hover: string;

  /** フォーカス時のボーダー色 */
  focus: string;
}>;

/** 背景色の用途別設定 */
export type BgColorConfig = Readonly<{
  /** メイン背景色 */
  main: string;

  /** サブ背景色 */
  sub: string;

  /** テキストフィールドの背景色 */
  textField: string;
}>;

/** 通常の状態（デフォルトとホバー）の色設定。 */
export type InteractionColorConfig = Readonly<{
  /** 通常状態の色 */
  default: string;

  /** ホバー時の色 */
  hover: string;
}>;

/** アプリケーション全体のテーマカラー設定 */
export type AppThemeColors = Readonly<{
  /** ボーダー色設定（テーマ別） */
  border: {
    /** ダークテーマのボーダー色設定 */
    dark: BorderColorConfig;
  };

  /** テキスト色設定（テーマ別） */
  text: {
    /** ダークテーマのテキスト色 */
    dark: string;
  };

  /** 背景色設定（テーマ別） */
  bgColor: {
    /** ダークテーマの背景色設定 */
    dark: BgColorConfig;
  };

  /** アクセントカラー（ボタン等のインタラクション色） */
  main: InteractionColorConfig;

  /** エラー表示色 */
  error: InteractionColorConfig;

  /** ナビゲーションリンクの文字色 */
  navigation: string;
}>;

/** 天候や時間帯に応じた環境色のセット */
export type EnvironmentColorSet = Readonly<{
  /** フォグの色 */
  fog: string;

  /** 忪b晴時の空の色 */
  clearSky: string;

  /** 薄曇り時の空の色 */
  thinCloud: string;

  /** 厚曇り時の空の色 */
  thickCloud: string;

  /** シーン背景色 */
  background: string;

  /** 環境マップとして使用する色 */
  environment: string;
}>;

/** 時間帯ごとの環境色 */
export type TimePointColorSet = Readonly<{
  /** 夕方の環境色セット */
  evening: EnvironmentColorSet;

  /** 夜の環境色セット */
  night: EnvironmentColorSet;

  /** 昼の環境色セット */
  lunch: EnvironmentColorSet;
}>;

/** Work Worldのライトやフォグの色 */
export type WorkWorldColorSet = Readonly<{
  /** アンビエントライトの色 */
  ambientLight: string;

  /** ディレクショナルライトの色 */
  directionalLight: string;

  /** フォグの色 */
  fog: string;
}>;
