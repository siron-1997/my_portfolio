'use client';

import { useState, useEffect } from 'react';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type GelocationResult = {
  coordinates: Coordinates;
  isPermissionHandled: boolean;
};

const useGeolocation = (defaultCoordinates: Coordinates): GelocationResult => {
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const [isPermissionHandled, setIsPermissionHandled] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      // 位置情報を取得
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsPermissionHandled(true);
        },
        () => {
          console.log('位置情報の取得に失敗しました。デフォルト値を使用します。');
          // エラー時はデフォルト値を使用
          setCoordinates(defaultCoordinates);
          setIsPermissionHandled(true);
        },
      );
    } else {
      console.log(
        'このブラウザは位置情報をサポートしていません。デフォルト値を使用します。',
      );
      // geolocation がサポートされていない場合はデフォルト値を使用
      setCoordinates(defaultCoordinates);
      setIsPermissionHandled(true);
    }
  }, []);

  return { coordinates, isPermissionHandled };
};

export default useGeolocation;
