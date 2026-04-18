import { NextResponse } from 'next/server';

import { type AxiosError } from 'axios';

import { LOG_MESSAGES } from '@/constants/api';
import { IS_DEV } from '@/constants/common';

/**
 * JSON レスポンスを生成するユーティリティ関数。
 * `{ success, message, data }` の統一フォーマットで返す。
 *
 * @param success - API リクエストの成功フラグ
 * @param message - クライアントに返すメッセージ
 * @param data - クライアントに返すデータ（省略時は null）
 * @param status - HTTP ステータスコード（省略時は 200）
 * @returns NextResponse オブジェクト
 */
export const createResponse = (
  success: boolean,
  message: string,
  data: unknown = null,
  status: number = 200,
): NextResponse => {
  return NextResponse.json({ success, message, data }, { status });
};

/**
 * UTC 時間を指定されたタイムゾーンのローカル時間に変換する処理。
 * OpenWeather API の `timezone` フィールド（秒単位のオフセット）と組み合わせて使用する。
 *
 * @param utcTime - UTC 時間
 * @param timezoneOffset - タイムゾーンオフセット（秒単位）
 * @returns ローカル時間
 */
export const convertToLocalTime = (
  utcTime: Date,
  timezoneOffset: number,
): Date => {
  return new Date(utcTime.getTime() + timezoneOffset * 1000);
};

/**
 * URL からクエリパラメータを除去してログ用にマスクする処理。
 * API キー等の機密情報がログに漏洩するのを防ぐ。
 *
 * @param url - マスク対象の URL 文字列
 * @returns クエリパラメータを除去した URL 文字列
 */
export const maskUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return '[invalid URL]';
  }
};

/**
 * Axios エラーをハンドリングしてレスポンスを返す処理。
 * error.response（4xx/5xx）、error.request（無応答）、それ以外の順で分岐する。
 *
 * @param error - 発生した Axios エラー
 * @param apiName - エラーが発生した API の名前（ログ用）
 * @returns NextResponse オブジェクト
 */
export const handleAxiosError = (
  error: AxiosError,
  apiName: string,
): NextResponse => {
  const maskedUrl = maskUrl(error.config?.url ?? 'Unknown URL');

  /** サーバーからエラーレスポンスが返された場合（4xx / 5xx） */
  if (error.response) {
    if (IS_DEV) {
      console.error(
        LOG_MESSAGES.API_REQUEST_FAILED(
          apiName,
          error.response.status,
          error.response.statusText,
          maskedUrl,
        ),
      );
    }
    return createResponse(
      false,
      `API Error: ${error.response.statusText}`,
      null,
      error.response.status,
    );
  }

  /** リクエストは送信されたが、レスポンスが受信されなかった場合 */
  if (error.request) {
    if (IS_DEV) {
      console.error(LOG_MESSAGES.NO_RESPONSE(apiName, maskedUrl));
    }
    return createResponse(false, 'No response received from API', null, 503);
  }

  /** config エラー等、request / response が両方存在しないフォールバック */
  return createResponse(false, 'Unexpected Axios error', null, 500);
};

/**
 * 未知のエラーをハンドリングしてレスポンスを返す処理。
 * Error インスタンスか否かで分岐する。
 *
 * @param error - 発生したエラー
 * @param apiName - エラーが発生した API の名前（ログ用）
 * @returns NextResponse オブジェクト
 */
export const handleUnknownError = (
  error: unknown,
  apiName: string,
): NextResponse => {
  /** 予期しないエラー */
  if (error instanceof Error) {
    if (IS_DEV) {
      console.error(LOG_MESSAGES.UNEXPECTED_ERROR(apiName, error.message));
    }
    return createResponse(false, 'An unexpected error occurred', null, 500);
  }

  /** 未知のエラー */
  if (IS_DEV) {
    console.error(LOG_MESSAGES.UNKNOWN_ERROR(apiName, error));
  }
  return createResponse(false, 'An unknown error occurred', null, 500);
};
