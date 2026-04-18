/** 省略記号 " ..." の文字数（切り捨て後に付加するため、この分だけ長さを削る） */
const ELLIPSIS = ' ...';

/**
 * 文字列が指定の最大長を超える場合に切り捨てて省略記号を付加するユーティリティ関数
 *
 * @param {string} str - 対象の文字列
 * @param {number} maxLength - 最大文字数（省略記号を含む）
 * @returns {string} 最大長以下に収めた文字列
 * @example
 * truncateString('Hello, World!', 8); // 'Hell ...'
 */
const truncateString = (str: string, maxLength: number): string => {
  /** 文字列が指定の制限以下の場合はそのまま返す */
  if (str.length <= maxLength) {
    return str;
  }

  /** 文字列が指定の制限を超える場合は、制限までの文字列を抽出して語尾を省略記号に変換して返す */
  return str.slice(0, maxLength - ELLIPSIS.length) + ELLIPSIS;
};

export default truncateString;
