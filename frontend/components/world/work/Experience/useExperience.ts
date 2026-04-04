import { useState, useRef, useEffect } from 'react';
import { AmbientLight, DirectionalLight, PerspectiveCamera } from 'three';
import { useThree } from '@react-three/fiber';
import { useCubeTexture } from '@react-three/drei';
import { useControls, folder } from 'leva';
import { ModelChildren } from '@/types/world';
import { useWindowSize } from '@/hooks';
import {
  DEBUG_AMBIENT_LIGHT_PARAMS,
  DEBUG_DIRECTIONAL_LIGHT_PARAMS,
  DEBUG_CAMERA_PARAMS,
} from '@/constants/world';

const useExperience = () => {
  const ambientLightRef = useRef<AmbientLight>(null!);
  const directionalLightRef = useRef<DirectionalLight>(null!);
  const cameraRef = useRef<PerspectiveCamera>(null!);
  const [isNavigationVisible, setIsNavigationVisible] = useState<boolean>(false);
  const [modelChildren, setModelChildren] = useState<ModelChildren>([]);
  const { width } = useWindowSize();
  const { scene } = useThree();

  /** キューブマップを設定 */
  const cubeTexture = useCubeTexture(
    ['px.webp', 'nx.webp', 'py.webp', 'ny.webp', 'pz.webp', 'nz.webp'],
    { path: '/images/maps/workWorld/' },
  );
  scene.environment = cubeTexture;
  scene.background = cubeTexture;
  scene.environmentIntensity = 0.5;

  /** カメラパラメータ（開発環境デバッグ用 leva コントロール） */
  const { fov, near, far, camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ } =
    useControls('カメラ', {
      fov: { value: DEBUG_CAMERA_PARAMS.fov, min: 0, max: 100, label: '視野角' },
      near: { value: DEBUG_CAMERA_PARAMS.near, min: 0, max: 100, label: '近さ' },
      far: { value: DEBUG_CAMERA_PARAMS.far, min: 0, max: 200, label: '遠さ' },
      位置: folder({
        camPosX: { value: DEBUG_CAMERA_PARAMS.position.x, min: -50, max: 50, label: 'x' },
        camPosY: { value: DEBUG_CAMERA_PARAMS.position.y, min: -20, max: 30, label: 'y' },
        camPosZ: { value: DEBUG_CAMERA_PARAMS.position.z, min: -40, max: 40, label: 'z' },
      }),
      回転: folder({
        camRotX: {
          value: DEBUG_CAMERA_PARAMS.rotation.x,
          min: -Math.PI,
          max: Math.PI,
          label: 'x',
        },
        camRotY: {
          value: DEBUG_CAMERA_PARAMS.rotation.y,
          min: -Math.PI,
          max: Math.PI,
          label: 'y',
        },
        camRotZ: {
          value: DEBUG_CAMERA_PARAMS.rotation.z,
          min: -Math.PI,
          max: Math.PI,
          label: 'z',
        },
      }),
    });

  /** 環境光パラメータ（開発環境デバッグ用 leva コントロール） */
  const { ambientColor, ambientIntensity } = useControls('環境光 (Ambient Light)', {
    ambientColor: { value: DEBUG_AMBIENT_LIGHT_PARAMS.color, label: '配色' },
    ambientIntensity: {
      value: DEBUG_AMBIENT_LIGHT_PARAMS.intensity,
      min: 0,
      max: 10,
      label: '光強度',
    },
  });

  /** 太陽光パラメータ（開発環境デバッグ用 leva コントロール） */
  const { directionalColor, directionalIntensity } = useControls(
    '太陽光 (Directional Light)',
    {
      directionalColor: { value: DEBUG_DIRECTIONAL_LIGHT_PARAMS.color, label: '配色' },
      directionalIntensity: {
        value: DEBUG_DIRECTIONAL_LIGHT_PARAMS.intensity,
        min: 0,
        max: 100000,
        label: '光強度',
      },
    },
  );

  /**
   * カメラの leva コントロール値を Three.js オブジェクトへ同期する。
   * 開発環境のみ実行し、本番ビルドでは早期リターンする。
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const cam = cameraRef.current;
    if (!cam) return;
    cam.fov = fov;
    cam.near = near;
    cam.far = far;
    cam.position.set(camPosX, camPosY, camPosZ);
    cam.rotation.set(camRotX, camRotY, camRotZ);
    cam.updateProjectionMatrix();
  }, [fov, near, far, camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ]);

  /**
   * 環境光の leva コントロール値を Three.js オブジェクトへ同期する。
   * 開発環境のみ実行し、本番ビルドでは早期リターンする。
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!ambientLightRef.current) return;
    ambientLightRef.current.color.set(ambientColor);
    ambientLightRef.current.intensity = ambientIntensity;
  }, [ambientColor, ambientIntensity]);

  /**
   * 太陽光の leva コントロール値を Three.js オブジェクトへ同期する。
   * 開発環境のみ実行し、本番ビルドでは早期リターンする。
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!directionalLightRef.current) return;
    directionalLightRef.current.color.set(directionalColor);
    directionalLightRef.current.intensity = directionalIntensity;
  }, [directionalColor, directionalIntensity]);

  return {
    ambientLightRef,
    directionalLightRef,
    cameraRef,
    isNavigationVisible,
    setIsNavigationVisible,
    modelChildren,
    setModelChildren,
    width,
  };
};

export default useExperience;
