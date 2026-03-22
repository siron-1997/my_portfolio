/** ボーダー色の状態別設定 */
export type BorderColorConfig = {
  readonly default: string;
  readonly hover: string;
  readonly focus: string;
};

/** 背景色の用途別設定 */
export type BgColorConfig = {
  readonly main: string;
  readonly sub: string;
  readonly textField: string;
};

/** 通常の状態（デフォルトとホバー）の色設定。 */
export type InteractionColorConfig = {
  readonly default: string;
  readonly hover: string;
};

/** アプリケーション全体のテーマカラー設定 */
export type AppThemeColors = {
  readonly border: {
    readonly dark: BorderColorConfig;
  };
  readonly text: {
    readonly dark: string;
  };
  readonly bgColor: {
    readonly dark: BgColorConfig;
  };
  readonly main: InteractionColorConfig;
  readonly error: InteractionColorConfig;
  readonly navigation: string;
};

/** 天候や時間帯に応じた環境色のセット */
export type EnvironmentColorSet = {
  readonly fog: string;
  readonly clearSky: string;
  readonly thinCloud: string;
  readonly thickCloud: string;
  readonly background: string;
  readonly environment: string;
};

/** 時間帯ごとの環境色 */
export type TimePointColorSet = {
  readonly evening: EnvironmentColorSet;
  readonly night: EnvironmentColorSet;
  readonly lunch: EnvironmentColorSet;
};

/** Work Worldのライトやフォグの色 */
export type WorkWorldColorSet = {
  readonly ambientLight: string;
  readonly directionalLight: string;
  readonly fog: string;
};
