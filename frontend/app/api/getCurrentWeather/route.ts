import { type NextRequest } from 'next/server';

import axios from 'axios';

import { API_ALLOWED_KEYS, LOG_MESSAGES } from '@/constants/api';
import { IS_DEV } from '@/constants/common';
import {
  convertToLocalTime,
  createResponse,
  handleAxiosError,
  handleUnknownError,
} from '@/services/getCurrentWeather';
import { type OpenWeatherCurrentData } from '@/types/api';

/**
 * 現在の天気情報を取得する API エンドポイント
 *
 * クライアントから送信された緯度・経度をもとに OpenWeather API から現在の天気情報を取得し、クライアントに返す。
 *
 * @param request - クライアントからのリクエストオブジェクト
 * @returns NextResponse オブジェクト
 * @throws 400 - 無効なリクエストデータ（許可されていないキー、無効な緯度・経度）
 * @throws 500 - API キーが設定されていない、予期しないエラー、未知のエラー
 * @throws 503 - API からのレスポンスが受信されない場合
 */
export async function POST(request: NextRequest) {
  const apiName = 'Open Weather API - Current Weather';

  try {
    if (IS_DEV) console.info(`${apiName}: 取得開始...`);

    /** リクエストボディを取得 */
    const body = await request.json();

    /** リクエストデータのキー項目を検証 */
    const keys = Object.keys(body);
    const invalidKeys = keys.filter(
      (key) => !API_ALLOWED_KEYS.CURRENT_WEATHER.includes(key),
    );

    /** 許可されていないキー項目が含まれている場合 */
    if (invalidKeys.length > 0) {
      if (IS_DEV) {
        console.error(LOG_MESSAGES.INVALID_KEYS(apiName, invalidKeys));
      }
      return createResponse(false, '無効なリクエストデータ', null, 400);
    }

    /** 緯度・経度を取得 */
    const { latitude, longitude } = body;

    /** 経緯度のバリデーション (数値かつ範囲内) を確認 */
    if (
      typeof latitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      typeof longitude !== 'number' ||
      longitude < -180 ||
      longitude > 180
    ) {
      if (IS_DEV) {
        console.error(LOG_MESSAGES.INVALID_COORDINATES(apiName));
      }
      return createResponse(false, '無効な緯度または経度', null, 400);
    }

    /** 環境変数から API キーを取得 */
    const apiKey = process.env.OPEN_WEATHER_API_KEY;

    /** API キーが設定されていない場合のエラーハンドリング */
    if (!apiKey) {
      if (IS_DEV) {
        console.error(
          LOG_MESSAGES.MISSING_ENV_VARIABLE('OPEN_WEATHER_API_KEY'),
        );
      }
      return createResponse(false, 'API キーが設定されていません', null, 500);
    }

    /** OpenWeather API の URL を作成 */
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    /** OpenWeather API からデータを取得 */
    const res = await axios.get<OpenWeatherCurrentData>(url);

    if (IS_DEV) console.info(`${apiName}: 取得成功`);
    const data = res.data;

    /** 現在の UTC 時間を取得 */
    const utcTime = new Date(new Date().toISOString());

    /** タイムゾーンオフセット (秒単位) をミリ秒に変換し加算 */
    const localTime = convertToLocalTime(utcTime, data.timezone);

    /** 現在の時間をポイントに変換 */
    const currentHour = localTime.getUTCHours();
    const currentMinute = localTime.getUTCMinutes() / 100;
    const currentPoint = currentHour + currentMinute;

    /** 日の出時間を計算 */
    const sunriseTime = convertToLocalTime(
      new Date(data.sys.sunrise * 1000),
      data.timezone,
    );

    /** 日の入り時間を計算 */
    const sunsetTime = convertToLocalTime(
      new Date(data.sys.sunset * 1000),
      data.timezone,
    );

    /** 日の出の時間帯を設定 */
    const startSunrise =
      sunriseTime.getUTCHours() + sunriseTime.getUTCMinutes() / 100;
    const endSunrise = startSunrise + 1;

    /** 日の入りの時間帯を設定 */
    const startSunset = sunsetTime.getUTCHours() + sunsetTime.getUTCMinutes() / 100;
    const endSunset = startSunset + 1;

    /** 昼の時間帯を設定 */
    const isLunch = currentPoint > endSunrise && currentPoint <= startSunset;

    /** 夕方の時間帯を設定 */
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
  } catch (error) {
    /** AxiosError の場合の処理 */
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error, apiName);
    }
    /** 予期しない or 未知のエラー */
    return handleUnknownError(error, apiName);
  }
}
