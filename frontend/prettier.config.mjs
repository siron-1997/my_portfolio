/** @type {import("prettier").Config} */
const config = {
  /** セミコロンあり */
  semi: true,
  /** 文字列はシングルクォート */
  singleQuote: true,
  /** JSX 属性はダブルクォート（HTML 慣習に準拠） */
  jsxSingleQuote: false,
  /** インデント幅 */
  tabWidth: 2,
  /** 1行の最大文字数 */
  printWidth: 80,
  /** 複数行の末尾カンマ（Git diff をクリーンに保つ） */
  trailingComma: 'all',
  /** オブジェクトの波括弧内にスペースを入れる: { foo } */
  bracketSpacing: true,
  /** JSX の閉じ > を次行に配置 */
  bracketSameLine: false,
  /** アロー関数の引数は常に括弧をつける: (x) => x */
  arrowParens: 'always',
  /**
   * 改行コードを LF に統一する。
   * .gitattributes と合わせて Linux / Windows 混在環境での
   * 不要な差分発生を防ぐ。
   */
  endOfLine: 'lf',
};

export default config;
