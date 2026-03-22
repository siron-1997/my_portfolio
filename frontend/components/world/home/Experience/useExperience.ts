import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
  Group,
  Mesh,
  Fog,
} from 'three';
import { TimePoint } from '@/types/world';

type Props = {
  setTimePoint: React.Dispatch<React.SetStateAction<TimePoint>>;
};

const useExperience = ({ setTimePoint }: Props) => {
  const doorRef = useRef<Group>(null!);
  const sunLightRef = useRef<DirectionalLight>(null!);
  const lightningRef = useRef<PointLight>(null!);
  const fogRef = useRef<Fog>(null!);
  const thinCloudRef = useRef<Mesh>(null!);
  const thickCloudRef = useRef<Mesh>(null!);

  const { scene } = useThree();

  // ヘルパーの更新
  useFrame(() => {
    if (process.env.NODE_ENV === 'development') {
      const sunLightHelper = scene.getObjectByName(
        'sun_light_helper',
      ) as DirectionalLightHelper;
      sunLightHelper?.update();
      const lightningHelper = scene.getObjectByName(
        'lightning_helper',
      ) as PointLightHelper;
      lightningHelper?.update();
    }
  });

  // lil-guiによるデバッグUI生成・破棄
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      let gui: import('lil-gui').GUI;
      import('lil-gui').then((module) => {
        const GUI = module.default;
        gui = new GUI({ width: 300, title: 'World Configs' });
        gui.domElement.style.zIndex = '9999';

        // タイムポイント
        const timePointFolder = gui.addFolder('タイムポイント');
        timePointFolder
          .add({ timePoint: 'night' }, 'timePoint', ['lunch', 'evening', 'night'])
          .name('時間帯')
          .onChange((v: TimePoint) => setTimePoint(v));

        // 霧
        const fogFolder = gui.addFolder('霧');
        fogFolder.add(fogRef.current, 'near', 0, 10).name('霧の最少距離');
        fogFolder.add(fogRef.current, 'far', 0, 200).name('霧の最大距離');

        // 薄雲
        const thinCloudFolder = gui.addFolder('薄雲');
        thinCloudFolder.add(thinCloudRef.current, 'visible').name('薄雲表示');

        // 厚雲
        const thickCloudFolder = gui.addFolder('厚雲');
        thickCloudFolder.add(thickCloudRef.current, 'visible').name('厚雲表示');

        // 太陽光
        const sunLightFolder = gui.addFolder('太陽光');
        const sunLightHelper = new DirectionalLightHelper(sunLightRef.current, 30);
        sunLightHelper.name = 'sun_light_helper';
        sunLightHelper.visible = true;
        scene.add(sunLightHelper);
        sunLightFolder.add(sunLightHelper, 'visible').name('ヘルパー表示');

        // 雷光
        const lightningFolder = gui.addFolder('雷光');
        const lightningHelper = new PointLightHelper(lightningRef.current, 30);
        lightningHelper.name = 'lightning_helper';
        lightningHelper.visible = true;
        scene.add(lightningHelper);
        lightningFolder.add(lightningHelper, 'visible').name('ヘルパー表示');
      });

      return () => {
        if (gui) {
          gui.destroy();
        }
        const sunLightHelper = scene.getObjectByName('sun_light_helper');
        if (sunLightHelper) {
          scene.remove(sunLightHelper);
        }
        const lightningHelper = scene.getObjectByName('lightning_helper');
        if (lightningHelper) {
          scene.remove(lightningHelper);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // 必要なrefを返す
  return {
    doorRef,
    sunLightRef,
    lightningRef,
    fogRef,
    thinCloudRef,
    thickCloudRef,
  };
};

export default useExperience;
