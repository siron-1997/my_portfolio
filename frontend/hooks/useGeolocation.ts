'use client';

import { useState, useEffect, useRef } from 'react';

/** 緯度・経度の座標ペア */
type Coordinates = {
  /** 緯度 */
  latitude: number;

  /** 経度 */
  longitude: number;
};

/**
 * 位置情報パーミッションの有無と座標を保持する型
 */
type GeolocationResult = {
  /** 現在位置の座標（許可拒否時は defaultCoordinates） */
  coordinates: Coordinates;

  /** 位置情報の共有ダイアログ処理済みかどうか（許可・拒否不問） */
  isPermissionHandled: boolean;
};

/**
 * ブラウザの Geolocation API で現在地の座標を取得するカスタムフック。
 * 許可拒否・非対応ブラウザの場合は defaultCoordinates を使用する。
 *
 * @param {Coordinates} defaultCoordinates - 使用できない場合のフォールバック座標
 * @returns {GeolocationResult} 現在地座標とパーミッション完了フラグ
 *
 * @example
 * const { coordinates, isPermissionHandled } = useGeolocation(DEFAULT_COORDINATES);
 */
const useGeolocation = (defaultCoordinates: Coordinates): GeolocationResult => {
  /** 現在地の座標 */
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  /** 位置情報の共有ダイアログ処理済みかどうか */
  const [isPermissionHandled, setIsPermissionHandled] = useState(false);

  /** defaultCoordinates の参照を固定し、呼び出し側のオブジェクトリテラル再生成による無限ループを防止 */
  const defaultCoordinatesRef = useRef(defaultCoordinates);

  useEffect(() => {
    const fallback = defaultCoordinatesRef.current;

    if ('geolocation' in navigator) {
      /** 位置情報を取得 */
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsPermissionHandled(true);
        },
        () => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('位置情報の取得に失敗しました。デフォルト値を使用します。');
          }
          /** エラー時はデフォルト値を使用 */
          setCoordinates(fallback);
          setIsPermissionHandled(true);
        },
      );
    } else {
      if (process.env.NODE_ENV === 'development') {
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
