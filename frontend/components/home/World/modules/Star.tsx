'use client';

import React, { type JSX, useEffect, useMemo } from 'react';

import { buttonGroup, type useCreateStore, useControls } from 'leva';
import { MathUtils } from 'three';

import { IS_DEV } from '@/constants/common';
import {
  HOME_WORLD_DEBUG_STAR_CONTROLS,
  HOME_WORLD_DEFAULT_STAR_COLOR,
  HOME_WORLD_DEFAULT_STAR_COUNT,
  HOME_WORLD_SCENE_NAME_STAR,
  HOME_WORLD_SCENE_NAME_STAR_CONTAINER,
} from '@/constants/home';
import { useIsIos } from '@/hooks';
import { type OpenWeatherCurrentData, type TimePoint } from '@/types/api';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

const Star = React.memo(
  ({ currentWeatherData, timePoint, levaStore }: Props): JSX.Element => {
    /** iOS 判定 */
    const isIos = useIsIos();

    /** 雲量を取得。データがない場合は 0 */
    const cloudAll = currentWeatherData?.clouds?.all || 0;

    /** 星のデフォルトパラメータを天気・時間帯から計算する */
    const defaultParams = useMemo(() => {
      /** 星のサイズを設定 */
      const size = timePoint === 'lunch' ? 0 : 0.35;

      /**
       * IOS の場合
       * 雲量に応じて星の透明度を 0〜1 の範囲で算出する（雲量100% で不透明度0）
       */
      if (isIos) {
        return { size, opacity: Math.max(0, (100 - cloudAll) / 100) };
      }

      /** 夜の場合は雲量に応じて徐々に星を見えにくくする */
      if (timePoint === 'night') {
        return { size, opacity: Math.max(0, 1 - cloudAll / 500) };
      }

      /** 夕方は固定で半分の明るさ */
      if (timePoint === 'evening') {
        return { size, opacity: 0.4 };
      }

      /** 昼は完全に見えない */
      return { size, opacity: 0 };
    }, [timePoint, isIos, cloudAll]);

    /** 星コントロールのデフォルト値 */
    const defaults = {
      visible: timePoint !== 'lunch',
      color: HOME_WORLD_DEFAULT_STAR_COLOR,
      opacity: defaultParams.opacity,
      size: defaultParams.size,
      count: HOME_WORLD_DEFAULT_STAR_COUNT,
    };

    /** 星コントロール（開発環境デバッグ用） */
    const { debugVisible, debugColor, debugOpacity, debugSize, debugCount } =
      useControls(
        '星',
        {
          debugVisible: {
            ...HOME_WORLD_DEBUG_STAR_CONTROLS.visible,
            value: defaults.visible,
          },
          debugColor: {
            ...HOME_WORLD_DEBUG_STAR_CONTROLS.color,
            value: defaults.color,
          },
          debugOpacity: {
            ...HOME_WORLD_DEBUG_STAR_CONTROLS.opacity,
            value: defaults.opacity,
          },
          debugSize: {
            ...HOME_WORLD_DEBUG_STAR_CONTROLS.size,
            value: defaults.size,
          },
          debugCount: {
            ...HOME_WORLD_DEBUG_STAR_CONTROLS.count,
            value: defaults.count,
          },
          _starReset: buttonGroup({
            リセット: () =>
              levaStore.set(
                {
                  '星.debugVisible': defaults.visible,
                  '星.debugColor': defaults.color,
                  '星.debugOpacity': defaults.opacity,
                  '星.debugSize': defaults.size,
                  '星.debugCount': defaults.count,
                },
                false,
              ),
          }),
        },
        { collapsed: true },
        { store: levaStore },
      );

    /** 表示状態 */
    const visible = IS_DEV ? debugVisible : defaults.visible;

    /** 星の色 */
    const color = IS_DEV ? debugColor : defaults.color;

    /** 星の透明度 */
    const opacity = IS_DEV ? debugOpacity : defaultParams.opacity;

    /** 星のサイズ */
    const size = IS_DEV ? debugSize : defaultParams.size;

    /** 星の数 */
    const count = IS_DEV ? debugCount : HOME_WORLD_DEFAULT_STAR_COUNT;

    /** 星の位置を格納する配列 */
    const positions = useMemo<Float32Array>(() => {
      const arr = new Float32Array(count * 3);

      /** 星の位置をランダムに設定 */
      for (let i = 0; i < count * 3; i += 3) {
        /** X座標 (-200 から 200 の範囲) */
        arr[i] = MathUtils.randFloatSpread(400);
        /** Y座標 (-250 から 250 の範囲) */
        arr[i + 1] = MathUtils.randFloatSpread(500);
        /** Z座標 (-100 から -50 の範囲) */
        arr[i + 2] = Math.random() * 50 - 100;
      }

      return arr;
    }, [count]);

    /** 時間帯・雲量が変わったときに星のデフォルト値をリセットする（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;
      levaStore.set(
        {
          '星.debugVisible': defaults.visible,
          '星.debugOpacity': defaults.opacity,
          '星.debugSize': defaults.size,
        },
        false,
      );
    }, [
      timePoint,
      cloudAll,
      levaStore,
      defaults.visible,
      defaults.opacity,
      defaults.size,
    ]);

    return (
      <group
        renderOrder={1}
        name={HOME_WORLD_SCENE_NAME_STAR_CONTAINER}
        visible={visible}
      >
        <points name={HOME_WORLD_SCENE_NAME_STAR}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              /** positions 配列を頂点属性として設定。3 は各頂点が x, y, z の 3 要素で構成されていることを示す。 */
              args={[positions, 3]}
            />
          </bufferGeometry>

          <pointsMaterial
            color={color}
            size={size}
            transparent
            opacity={opacity}
            fog={false}
            depthWrite={false}
          />
        </points>
      </group>
    );
  },
);

Star.displayName = 'Star';

export default Star;
