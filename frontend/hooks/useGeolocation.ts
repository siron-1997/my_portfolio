'use client';

import { useEffect, useRef, useState } from 'react';

import { IS_DEV } from '@/constants/common';

/** 緯度・経度の座標ペア */
type Coordinates = {
  /** 緯度 */
  latitude: number;

  /** 経度 */
  longitude: number;
};

/** 位置情報パーミッションの有無と座標を保持する型 */
type GeolocationResult = {
  /** 現在位置の座標（許可拒否時は defaultCoordinates） */
  coordinates: Coordinates;

  /** 位置情報の共有ダイアログ処理済みかどうか（許可・拒否不問） */
  isPermissionHandled: boolean;
};

/**
 * ブラウザの Geolocation API で現在地の座標を取得するカスタムフック。
 *
 * 許可拒否・非対応ブラウザの場合は defaultCoordinates を使用する。
 *
 * @param {Coordinates} defaultCoordinates - 使用できない場合のフォールバック座標
 * @returns {GeolocationResult} 現在地座標とパーミッション完了フラグ
 *
 * @example
 * const { coordinates, isPermissionHandled } = useGeolocation(DEFAULT_COORDINATES);
 */
const useGeolocation = (defaultCoordinates: Coordinates): GeolocationResult => {
  /** defaultCoordinates の参照を固定し、呼び出し側のオブジェクトリテラル再生成による無限ループを防止 */
  const defaultCoordinatesRef = useRef(defaultCoordinates);

  /** 現在地の座標 */
  const [coordinates, setCoordinates] =
    useState<Coordinates>(defaultCoordinates);

  /** 位置情報の共有ダイアログ処理済み確認フラグ */
  const [isPermissionHandled, setIsPermissionHandled] =
    useState<boolean>(false);

  useEffect(() => {
    const fallback = defaultCoordinatesRef.current;

    /** ブラウザが位置情報をサポートしているか確認 */
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        /** 位置情報の取得に成功した場合 */
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsPermissionHandled(true);
        },
        /** 位置情報の取得に失敗した場合 */
        () => {
          if (IS_DEV) {
            console.warn(
              '位置情報の取得に失敗しました。デフォルト値を使用します。',
            );
          }

          /** エラー時はデフォルト値を使用 */
          setCoordinates(fallback);
          setIsPermissionHandled(true);
        },
      );
    } else {
      if (IS_DEV) {
        console.warn(
          'このブラウザは位置情報をサポートしていません。デフォルト値を使用します。',
        );
      }

      /** geolocation がサポートされていない場合はデフォルト値を使用 */
      setCoordinates(fallback);
      setIsPermissionHandled(true);
    }
  }, []);

  return { coordinates, isPermissionHandled };
};

export default useGeolocation;
