import { type NextRequest, NextResponse } from 'next/server';

import axios, { type AxiosError } from 'axios';

import { API_ALLOWED_KEYS } from '@/constants/api';
import { LOG_MESSAGES } from '@/constants/api';
import { type OpenWeatherCurrentData } from '@/types/api';

const createResponse = (
  success: boolean,
  message: string,
  data: unknown = null,
  status: number = 200,
) => {
  return NextResponse.json({ success, message, data }, { status });
};

/**
 * UTC時間を指定されたタイムゾーンのローカル時間に変換します。
 * @param utcTime UTC時間
 * @param timezoneOffset タイムゾーンオフセット（秒単位）
 * @returns ローカル時間
 */
const convertToLocalTime = (utcTime: Date, timezoneOffset: number): Date => {
  return new Date(utcTime.getTime() + timezoneOffset * 1000);
};

const handleAxiosError = (error: AxiosError, apiName: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const url = error.config?.url || 'Unknown URL';

  if (error.response) {
    if (isDevelopment) {
      console.error(
        LOG_MESSAGES.API_REQUEST_FAILED(
          apiName,
          error.response.status,
          error.response.statusText,
          url,
        ),
      );
    }
    return createResponse(
      false,
      `API Error: ${error.response.statusText}`,
      null,
      error.response.status,
    );
  } else if (error.request) {
    if (isDevelopment) {
      console.error(LOG_MESSAGES.NO_RESPONSE(apiName, url));
    }
    return createResponse(false, 'No response received from API', null, 503);
  }
};

const handleUnknownError = (error: unknown, apiName: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  /** 予期しないエラー */
  if (error instanceof Error) {
    if (isDevelopment) {
      console.error(LOG_MESSAGES.UNEXPECTED_ERROR(apiName, error.message));
    }
    return createResponse(
      false,
      `Unexpected Error: ${error.message}`,
      null,
      500,
    );
  } else {
    /** 未知のエラー */
    if (isDevelopment) {
      console.error(LOG_MESSAGES.UNKNOWN_ERROR(apiName, error));
    }
    return createResponse(false, 'An unknown error occurred', null, 500);
  }
};

export async function POST(request: NextRequest) {
  const apiName = 'Open Weather API - Current Weather';

  try {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) console.info(`${apiName}: 取得開始...`);

    const body = await request.json();
    /** リクエストデータのキー項目を検証 */
    const keys = Object.keys(body);
    const invalidKeys = keys.filter(
      (key) => !API_ALLOWED_KEYS.CURRENT_WEATHER.includes(key),
    );

    /** 許可されていないキー項目が含まれている場合 */
    if (invalidKeys.length > 0) {
      if (isDevelopment) {
        console.error(LOG_MESSAGES.INVALID_KEYS(apiName, invalidKeys));
      }
      return createResponse(false, '無効なリクエストデータ', null, 400);
    }

    const { latitude, longitude } = body;

    if (
      /** 経緯度のバリデーション (数値かつ範囲内) を確認 */
      typeof latitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      typeof longitude !== 'number' ||
      longitude < -180 ||
      longitude > 180
    ) {
      if (isDevelopment) {
        console.error(LOG_MESSAGES.INVALID_COORDINATES(apiName));
      }
      return createResponse(false, '無効な緯度または経度', null, 400);
    }

    /** 環境変数から API キーを取得 */
    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    /** API キーが設定されていない場合のエラーハンドリング */
    if (!apiKey) {
      if (isDevelopment) {
        console.error(
          LOG_MESSAGES.MISSING_ENV_VARIABLE('OPEN_WEATHER_API_KEY'),
        );
      }
      return createResponse(false, 'API キーが設定されていません', null, 500);
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const res = await axios.get<OpenWeatherCurrentData>(url);

    /** ステータスコードが 2xx の場合は成功、それ以外は失敗 */
    if (res.status >= 200 && res.status < 300) {
      if (isDevelopment) console.info(`${apiName}: 取得成功`);
      const data = res.data;

      /** 現在の UTC 時間を取得 */
      const utcTime = new Date(new Date().toISOString());
      /** タイムゾーンオフセット (秒単位) をミリ秒に変換し加算 */
      const localTime = convertToLocalTime(utcTime, data.timezone);

      /** 現在の時間をポイントに変換 */
      const currentHour = localTime.getHours();
      const currentMinute = localTime.getMinutes() / 100;
      const currentPoint = currentHour + currentMinute;

      /** 日の出・日の入り時間を計算 */
      const sunriseTime = convertToLocalTime(
        new Date(data.sys.sunrise * 1000),
        data.timezone,
      );
      const sunsetTime = convertToLocalTime(
        new Date(data.sys.sunset * 1000),
        data.timezone,
      );

      const startSunrise =
        sunriseTime.getHours() + sunriseTime.getMinutes() / 100;
      const endSunrise = startSunrise + 1;
      const startSunset = sunsetTime.getHours() + sunsetTime.getMinutes() / 100;
      const endSunset = startSunset + 1;

      /** 時間帯を設定 */
      const isLunch = currentPoint > endSunrise && currentPoint <= startSunset;
      const isEvening =
        (currentPoint > startSunrise && currentPoint <= endSunrise) ||
        (currentPoint > startSunset && currentPoint <= endSunset);
      /** 時間帯を判定 */
      const timePoint = isLunch ? 'lunch' : isEvening ? 'evening' : 'night';

      return createResponse(
        true,
        'Current Weather data fetched successfully',
        { data, timePoint },
        res.status,
      );
    } else {
      if (isDevelopment) {
        console.error(
          LOG_MESSAGES.API_REQUEST_FAILED(
            apiName,
            res.status,
            res.statusText,
            url,
          ),
        );
      }
      return createResponse(
        false,
        'APIリクエストに失敗しました',
        null,
        res.status,
      );
    }
  } catch (error) {
    /** AxiosError の場合の処理 */
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error, apiName);
    }
    /** 予期しない or 未知のエラー */
    return handleUnknownError(error, apiName);
  }
}
