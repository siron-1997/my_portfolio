/**
 * API リクエストで許可されるキー
 * @description 各 API エンドポイントで受け付けるリクエストボディのキーを定義
 */
export const API_ALLOWED_KEYS = {
  CURRENT_WEATHER: ['latitude', 'longitude'],
  SENDGRID: ['name', 'email', 'message'],
  FORECAST: ['latitude', 'longitude', 'days'],
};

/** SendGrid でメールを送信する際に使用するキー */
export const SENDGRID_EMAIL_KEYS = ['to', 'from', 'subject', 'body'];

/**
 * API 関連 ログメッセージ
 * @description API 状態に関するログメッセージ
 */
export const LOG_MESSAGES = {
  INVALID_COORDINATES: (apiName: string) => `${apiName}: 無効な緯度または経度`,
  MISSING_ENV_VARIABLE: (variableName: string) =>
    `環境変数 "${variableName}" が設定されていません`,
  API_REQUEST_FAILED: (
    apiName: string,
    status: number,
    statusText: string,
    url: string,
  ) =>
    `${apiName}: APIリクエストに失敗しました。ステータスコード: ${status}, メッセージ: ${statusText}, URL: ${url}`,
  NO_RESPONSE: (apiName: string, url: string) =>
    `${apiName}: APIリクエストが送信されましたが、応答がありませんでした。URL: ${url}`,
  UNEXPECTED_ERROR: (apiName: string, message: string) =>
    `${apiName}: 予期しないエラーが発生しました。メッセージ: ${message}`,
  UNKNOWN_ERROR: (apiName: string, error: unknown) =>
    `${apiName}: 未知のエラーが発生しました。詳細: ${JSON.stringify(error)}`,
  INVALID_KEYS: (apiName: string, invalidKeys: string[]) =>
    `${apiName}: 許可されていないキー項目が含まれています。無効なキー: ${invalidKeys.join(', ')}`,
  SENDGRID_MISSING_EMAIL: (apiName: string) =>
    `${apiName}: リクエストにメールアドレスが含まれていません`,
  SENDGRID_EMAIL_SENT: (apiName: string, email: string) =>
    `${apiName}: メールが正常に送信されました。送信先: ${email}`,
  SENDGRID_ERROR: (apiName: string, error: string) =>
    `${apiName}: メール送信中にエラーが発生しました。エラー: ${error}`,
};
