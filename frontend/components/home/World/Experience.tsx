'use client';

import React, {
  type JSX,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { BakeShadows } from '@react-three/drei';
import type { useCreateStore } from 'leva';
import { useControls } from 'leva';
import { type Group } from 'three';

import {
  Clouds,
  Door,
  Fog,
  Lightning,
  Model,
  Ocean,
  RigCamera,
  Star,
  SunLight,
  WeatherEnvironment,
} from '@/components/home/World/modules';
import { IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  HOME_WORLD_DEBUG_TIME_POINT_CONTROL,
  HOME_WORLD_DEBUG_WEATHER_CONFIGS,
  HOME_WORLD_DEBUG_WEATHER_DESCRIPTION_LABELS,
  HOME_WORLD_SCENE_NAME_MODELS,
  WEATHER_CATEGORY_CLEAR_SKY,
  WEATHER_DESCRIPTION_CLEAR_SKY,
  WEATHER_TYPES,
} from '@/constants/home';
import { type OpenWeatherCurrentData, type WeatherItem } from '@/types/api';
import { type TimePoint } from '@/types/api';
import { getWeatherCategory, type WeatherCategory } from '@/utils/world';

type Props = {
  /** portal 要素の参照 Ref */
  portalRef: RefObject<HTMLDivElement | null>;

  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** 時間帯（朝昼晩）を更新する関数 */
  setTimePoint: React.Dispatch<React.SetStateAction<TimePoint>>;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;

  /** デバッグ上書き後の天気データの状態を更新するコールバック */
  onEffectiveWeatherDataChange: (data: OpenWeatherCurrentData | null) => void;

  /** カメラが扉を通過した際の屋内状態変化コールバック */
  onInsideRoomChange: (isInside: boolean) => void;
};

const Experience = React.memo(
  ({
    portalRef,
    currentWeatherData,
    timePoint,
    setTimePoint,
    levaStore,
    onEffectiveWeatherDataChange,
    onInsideRoomChange,
  }: Props): JSX.Element => {
    /** ドアの参照 Ref */
    const doorRef = useRef<Group | null>(null);

    /** 現在の天気を取得 */
    const currentWeather = useMemo<WeatherItem | undefined>(() => {
      const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;
      /** 天気の種別リストに含まれる最初の天気を取得 */
      return weather.find((w) => WEATHER_TYPES.includes(w.main));
    }, [currentWeatherData]);

    /** デバッグ用天気説明の初期値を取得 */
    const defaultWeatherDescription = useMemo<string>(() => {
      const desc = currentWeather?.description ?? '';
      /** デバッグ用天気説明ラベルのキー（description）に含まれるか確認 */
      return Object.keys(HOME_WORLD_DEBUG_WEATHER_DESCRIPTION_LABELS).includes(
        desc,
      )
        ? desc
        : WEATHER_DESCRIPTION_CLEAR_SKY;
    }, [currentWeather]);

    /** デバッグ用天気説明のオプションを取得 */
    const weatherDescriptionOptions = useMemo<Record<string, string>>(
      () =>
        Object.fromEntries(
          Object.entries(HOME_WORLD_DEBUG_WEATHER_DESCRIPTION_LABELS).map(
            ([desc, label]) => [label, desc],
          ),
        ),
      [],
    );

    /** タイムポイント・天気コントロール（開発環境デバッグ用） */
    const {
      debugTimePoint,
      debugWeatherDescription,
      debugCloudsAll,
      debugHumidity,
    } = useControls(
      'タイムポイント',
      {
        /** API 取得済みの時間帯を初期値として設定する */
        debugTimePoint: {
          ...HOME_WORLD_DEBUG_TIME_POINT_CONTROL,
          value: timePoint,
        },
        /** API 取得済みの天気説明を初期値として設定する */
        debugWeatherDescription: {
          value: defaultWeatherDescription,
          options: weatherDescriptionOptions,
          label: '天気の説明',
        },
        /** 天気説明に対応する代表的な雲量を初期値として設定する */
        debugCloudsAll: {
          value:
            HOME_WORLD_DEBUG_WEATHER_CONFIGS[defaultWeatherDescription]
              ?.cloudsAll ?? 0,
          min: 0,
          max: 100,
          step: 1,
          label: '雲量（%）',
        },
        /** 天気説明に対応する代表的な湿度を初期値として設定する */
        debugHumidity: {
          value:
            HOME_WORLD_DEBUG_WEATHER_CONFIGS[defaultWeatherDescription]
              ?.humidity ?? 50,
          min: 0,
          max: 100,
          step: 1,
          label: '湿度（%）',
        },
      },
      { collapsed: true },
      { store: levaStore },
    );

    /**
     * 天気説明のデバッグ上書きを反映した currentWeatherData。
     * weather 配列と clouds.all を選択した天気説明・雲量スライダーの値で置き換える。
     */
    const effectiveCurrentWeatherData =
      useMemo<OpenWeatherCurrentData | null>(() => {
        /** 開発環境でない場合や天気データが存在しない場合はそのまま返す */
        if (!IS_DEV || !currentWeatherData) return currentWeatherData;

        /** デバッグ用天気説明に対応する設定を取得 */
        const config =
          HOME_WORLD_DEBUG_WEATHER_CONFIGS[debugWeatherDescription];

        return {
          ...currentWeatherData,
          weather: [
            {
              id: 0,
              main: config.main,
              description: debugWeatherDescription,
              icon: '',
            },
          ],
          clouds: { all: debugCloudsAll },
          main: {
            ...currentWeatherData.main,
            humidity: debugHumidity,
          },
          /** rain1h が設定されている天気説明では代表的な降雨量を合成する */
          rain:
            config.rain1h !== undefined ? { '1h': config.rain1h } : undefined,
        };
      }, [
        currentWeatherData,
        debugWeatherDescription,
        debugCloudsAll,
        debugHumidity,
      ]);

    /** デバッグ上書き後の現在の天気 */
    const effectiveCurrentWeather = useMemo<WeatherItem | undefined>(() => {
      const weather = effectiveCurrentWeatherData?.weather ?? DEFAULT_WEATHER;
      /** 天気の種別リストに含まれる最初の天気を取得 */
      return weather.find((w) => WEATHER_TYPES.includes(w.main));
    }, [effectiveCurrentWeatherData]);

    /** デバッグ上書き後の雲カテゴリ */
    const effectiveWeatherCategory = useMemo<WeatherCategory>(() => {
      if (!effectiveCurrentWeather) return WEATHER_CATEGORY_CLEAR_SKY;
      /** デバッグ上書き後の天気説明に基づいて雲カテゴリを取得 */
      return getWeatherCategory(effectiveCurrentWeather.description);
    }, [effectiveCurrentWeather]);

    /** effectiveCurrentWeatherData の変化を World 側に通知する */
    useEffect(() => {
      onEffectiveWeatherDataChange(effectiveCurrentWeatherData);
    }, [effectiveCurrentWeatherData, onEffectiveWeatherDataChange]);

    /** 時間帯の変更をシーン全体に反映する (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV) return;
      setTimePoint(debugTimePoint);
    }, [setTimePoint, debugTimePoint]);

    /** 天気説明変更時に雲量・湿度スライダーを代表値にリセットする (開発環境のみ) */
    useEffect(() => {
      if (!IS_DEV) return;

      const config = HOME_WORLD_DEBUG_WEATHER_CONFIGS[debugWeatherDescription];

      levaStore.set(
        {
          'タイムポイント.debugCloudsAll': config.cloudsAll,
          'タイムポイント.debugHumidity': config.humidity,
        },
        false,
      );
    }, [debugWeatherDescription, levaStore]);

    return (
      <>
        <WeatherEnvironment timePoint={timePoint} />

        {/** 霧 */}
        <Fog
          currentWeatherData={effectiveCurrentWeatherData}
          timePoint={timePoint}
          levaStore={levaStore}
        />

        {/** 太陽 */}
        <SunLight
          weatherCategory={effectiveWeatherCategory}
          timePoint={timePoint}
          currentWeatherDescription={effectiveCurrentWeather?.description}
          levaStore={levaStore}
        />

        {/** メイン */}
        <group name={HOME_WORLD_SCENE_NAME_MODELS}>
          {/** 地形 */}
          <Model
            currentWeatherData={effectiveCurrentWeatherData}
            timePoint={timePoint}
          />

          {/** ドア */}
          <Door
            currentWeatherData={effectiveCurrentWeatherData}
            timePoint={timePoint}
            ref={doorRef}
          />

          {/** 雨の時、シーンに追加 */}
          <Ocean
            currentWeatherData={effectiveCurrentWeatherData}
            levaStore={levaStore}
          />
        </group>

        {/** 星 */}
        <Star
          currentWeatherData={effectiveCurrentWeatherData}
          timePoint={timePoint}
          levaStore={levaStore}
        />

        {/** 薄雲と厚雲 */}
        <Clouds
          currentWeatherData={effectiveCurrentWeatherData}
          timePoint={timePoint}
          levaStore={levaStore}
        />

        {/** 雷 */}
        <Lightning
          currentWeatherData={effectiveCurrentWeatherData}
          levaStore={levaStore}
        />

        {/** カメラ */}
        <RigCamera
          doorRef={doorRef}
          portalRef={portalRef}
          levaStore={levaStore}
          onInsideRoomChange={onInsideRoomChange}
        />

        {/** シャドウベイク */}
        <BakeShadows />
      </>
    );
  },
);

Experience.displayName = 'Experience';

export default Experience;
