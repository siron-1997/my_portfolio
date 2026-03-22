import { useState, useRef, useEffect } from 'react';
import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  PerspectiveCamera,
  PointLightHelper,
} from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCubeTexture } from '@react-three/drei';
import { PointLightGroup, ModelChildren } from '@/types/world';
import { useWindowSize } from '@/hooks';
import {
  DEBUG_AMBIENT_LIGHT_PARAMS,
  DEBUG_DIRECTIONAL_LIGHT_PARAMS,
  DEBUG_CAMERA_PARAMS,
} from '@/constants/world';

const useExperience = () => {
  const ambientLightRef = useRef<AmbientLight>(null!);
  const directionalLightRef = useRef<DirectionalLight>(null!);
  const pointLightContainerRef = useRef<PointLightGroup>(null);
  const cameraRef = useRef<PerspectiveCamera>(null!);
  const [isNavigationVisible, setIsNavigationVisible] = useState<boolean>(false);
  const [modelChildren, setModelChildren] = useState<ModelChildren>([]);
  const { width } = useWindowSize();
  const { scene } = useThree();

  // キューブマップを設定
  const cubeTexture = useCubeTexture(
    ['px.webp', 'nx.webp', 'py.webp', 'ny.webp', 'pz.webp', 'nz.webp'],
    { path: '/images/maps/workWorld/' },
  );
  scene.environment = cubeTexture;
  scene.background = cubeTexture;
  scene.environmentIntensity = 0.5;

  useFrame(() => {
    if (process.env.NODE_ENV === 'development') {
      pointLightContainerRef.current?.children.forEach((light: PointLight) => {
        const helper = scene.getObjectByName(`${light.name}-helper`) as PointLightHelper;
        helper?.update();
      });
    }
  });

  /* lil-gui の設定 (開発環境のみ) */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      let gui: import('lil-gui').GUI;
      import('lil-gui').then((module) => {
        const GUI = module.default;
        gui = new GUI({ width: 300, title: 'World Configs' });
        gui.domElement.style.zIndex = '9999';

        // カメラ設定
        const cameraFolder = gui.addFolder('カメラ');
        cameraFolder
          .add(DEBUG_CAMERA_PARAMS, 'fov', 0, 100)
          .name('視野角')
          .onChange((v: number) => {
            cameraRef.current.fov = v;
            cameraRef.current.updateProjectionMatrix();
          });
        cameraFolder
          .add(DEBUG_CAMERA_PARAMS, 'near', 0, 100)
          .name('近さ')
          .onChange((v: number) => {
            cameraRef.current.near = v;
            cameraRef.current.updateProjectionMatrix();
          });
        cameraFolder
          .add(DEBUG_CAMERA_PARAMS, 'far', 0, 100)
          .name('遠さ')
          .onChange((v: number) => {
            cameraRef.current.far = v;
            cameraRef.current.updateProjectionMatrix();
          });

        // カメラ位置
        const cameraPositionFolder = cameraFolder.addFolder('位置');
        cameraPositionFolder
          .add(DEBUG_CAMERA_PARAMS.position, 'x', -50, 50)
          .name('x')
          .onChange((v: number) => {
            cameraRef.current.position.x = v;
            cameraRef.current.updateProjectionMatrix();
          });
        cameraPositionFolder
          .add(DEBUG_CAMERA_PARAMS.position, 'y', -20, 30)
          .name('y')
          .onChange((v: number) => {
            cameraRef.current.position.y = v;
            cameraRef.current.updateProjectionMatrix();
          });
        cameraPositionFolder
          .add(DEBUG_CAMERA_PARAMS.position, 'z', -40, 40)
          .name('z')
          .onChange((v: number) => {
            cameraRef.current.position.z = v;
            cameraRef.current.updateProjectionMatrix();
          });

        // カメラ回転
        const cameraRotationFolder = cameraFolder.addFolder('回転');
        cameraRotationFolder
          .add(DEBUG_CAMERA_PARAMS.rotation, 'x', -Math.PI, Math.PI)
          .name('x')
          .onChange((v: number) => {
            cameraRef.current.rotation.x = v;
            cameraRef.current.updateProjectionMatrix();
          });
        cameraRotationFolder
          .add(DEBUG_CAMERA_PARAMS.rotation, 'y', -Math.PI, Math.PI)
          .name('y')
          .onChange((v: number) => {
            cameraRef.current.rotation.y = v;
            cameraRef.current.updateProjectionMatrix();
          });
        cameraRotationFolder
          .add(DEBUG_CAMERA_PARAMS.rotation, 'z', -Math.PI, Math.PI)
          .name('z')
          .onChange((v: number) => {
            cameraRef.current.rotation.z = v;
            cameraRef.current.updateProjectionMatrix();
          });

        // 環境光設定
        const ambiendLightFolder = gui.addFolder('環境光 (Ambient Light)');
        ambiendLightFolder
          .addColor(DEBUG_AMBIENT_LIGHT_PARAMS, 'color')
          .name('配色')
          .onChange((v: string) => {
            ambientLightRef.current.color.set(v);
          });
        ambiendLightFolder
          .add(DEBUG_AMBIENT_LIGHT_PARAMS, 'intensity', 0, 10)
          .name('光強度')
          .onChange((v: number) => {
            ambientLightRef.current.intensity = v;
          });

        // 太陽光設定
        const directionalLightFolder = gui.addFolder('太陽光 (Directional Light)');
        directionalLightFolder
          .addColor(DEBUG_DIRECTIONAL_LIGHT_PARAMS, 'color')
          .name('配色')
          .onChange((v: string) => {
            directionalLightRef.current.color.set(v);
          });
        directionalLightFolder
          .add(DEBUG_DIRECTIONAL_LIGHT_PARAMS, 'intensity', 0, 100000)
          .name('光強度')
          .onChange((v: number) => {
            directionalLightRef.current.intensity = v;
          });

        // ポイントライト設定 (任意)
        const pointLightFolder = gui.addFolder('ポイントライト');
        pointLightContainerRef.current?.children.forEach((light: PointLight) => {
          const lightFolder = pointLightFolder.addFolder(light.name);

          // ポイントライトのプロパティをデバッグ
          lightFolder
            .addColor(light, 'color')
            .name('配色')
            .onChange((v: string) => {
              light.color.set(v);
            });
          lightFolder
            .add(light, 'intensity', 0, 10)
            .name('光強度')
            .onChange((v: number) => {
              light.intensity = v;
            });

          // ヘルパーを追加 (デフォルトは表示する)
          const helper = new PointLightHelper(light, 35);
          helper.name = `${light.name}-helper`;
          helper.visible = true;
          scene.add(helper);

          // ヘルパーの表示/非表示を切り替える
          lightFolder.add(helper, 'visible').name('ヘルパー表示');
        });
      });

      return () => {
        if (gui) {
          gui.destroy();
        }
        pointLightContainerRef.current?.children.forEach((light: PointLight) => {
          const helper = scene.getObjectByName(`${light.name}-helper`);
          if (helper) {
            scene.remove(helper);
          }
        });
      };
    }
  }, [scene]);

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
