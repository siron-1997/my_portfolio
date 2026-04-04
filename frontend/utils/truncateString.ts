const truncateString = (str: string, maxLength: number): string => {
  /** 文字列が指定の制限以下の場合はそのまま返す */
  if (str.length <= maxLength) {
    return str;
  } else {
    /** 文字列が指定の制限を超える場合は、制限までの文字列を抽出して語尾を「...」に変換して返す */
    return str.substring(0, maxLength - 4) + ' ...';
  }
};

export default truncateString;
