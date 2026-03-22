import { useRef, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import { useHomeContext } from '@/contexts';
import { useWindowSize } from '@/hooks';
import { BREAK_POINTS } from '@/constants/common';
import { HOME_WORLD_RIG_CAMERA_POSITIONS } from '@/constants/world';
import { rigCameraAnimation } from '@/animations/homeWorld';

type Props = {
  doorRef: React.RefObject<Group>;
};

/**
 * HomeWorld のカメラリグのアニメーションとロジックを管理するカスタムフック
 * @param doorRef - ドアのGroupへのref
 */
const useRigCamera = ({ doorRef }: Props) => {
  const cameraContainerRef = useRef<Group>(null!);
  const { portalRef } = useHomeContext();
  const { scene, camera } = useThree();
  const { width, height } = useWindowSize();

  useLayoutEffect(() => {
    // windowサイズが確定するまで待つ
    if (!width || !height) {
      return;
    }

    const portal = portalRef.current;
    // シーン内のメッシュを取得
    const models = scene.children.find((c) => c instanceof Group && c.name === 'models');
    // 扉とドアノブ、部屋を取得
    const door = doorRef.current?.children.find(
      (c) => c instanceof Group && c.name === 'door-container',
    );
    const room = doorRef.current?.children.find(
      (c) => c instanceof Mesh && c.name === 'room',
    );

    // アニメーションに必要な要素がすべて揃っているか確認
    if (models instanceof Group && door instanceof Group && room instanceof Mesh) {
      /* カメラの開始位置と終了位置をセット */
      let startPosition = new Vector3(0, 0, 0); // 開始位置
      let endPosition = new Vector3(0, 0, 0); // 到着位置

      switch (true) {
        // 1920以上
        case width >= BREAK_POINTS['2XL']:
          camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.xxl.start);
          startPosition = camera.position;
          endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.xxl.end;
          models.position.y = -0.85;
          break;
        // 1920未満、1536以上
        case width < BREAK_POINTS['2XL'] && width >= BREAK_POINTS.XL:
          camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.xl.start);
          startPosition = camera.position;
          endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.xl.end;
          models.position.y = -0.6;
          break;
        // 1536未満、1280以上
        case width < BREAK_POINTS.XL && width >= BREAK_POINTS.LG:
          camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.lg.start);
          startPosition = camera.position;
          endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.lg.end;
          models.position.y = -0.4;
          break;
        // 1280未満、1024以上
        case width < BREAK_POINTS.LG && width >= BREAK_POINTS.SM:
          camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.tb.start);
          startPosition = camera.position;
          endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.tb.end;
          models.position.y = -1.4;
          break;
        // 1024未満、768以上
        case width < BREAK_POINTS.SM && width >= BREAK_POINTS.XS:
          if (width < height) {
            camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.sm.wrap.start);
            startPosition = camera.position;
            endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.sm.wrap.end;
            models.position.y = -3.2;
          } else {
            camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.sm.side.start);
            startPosition = camera.position;
            endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.sm.side.end;
            models.position.y = -1.2;
          }
          break;
        // 768未満
        case width < BREAK_POINTS.XS:
          camera.position.copy(HOME_WORLD_RIG_CAMERA_POSITIONS.xs.start);
          startPosition = camera.position;
          endPosition = HOME_WORLD_RIG_CAMERA_POSITIONS.xs.end;
          models.position.y = -0.5;
          break;
        default:
          break;
      }

      /* アニメーションを作成 */
      const ctx = rigCameraAnimation({
        startPosition,
        endPosition,
        portal,
        door,
        room,
        cameraContainerRef,
        camera,
        width,
      });

      return () => {
        ctx.revert();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, camera, scene.children]);

  return { cameraContainerRef };
};

export default useRigCamera;
