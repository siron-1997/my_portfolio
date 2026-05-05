'use client';

import React, { useEffect } from 'react';
import type { JSX } from 'react';

import { useGLTF } from '@react-three/drei';
import { FrontSide } from 'three';
import type { Mesh, Object3D } from 'three';

import { DRACO_DECODER_PATH } from '@/constants/common';
import { WORK_WORLD_ROOM_MODEL_PATH } from '@/constants/workThreeD';

/** DRACO デコーダーパスを設定 */
useGLTF.setDecoderPath(DRACO_DECODER_PATH);

const Room = React.memo((): JSX.Element => {
  /** GLTF モデルを読み込む */
  const gltf = useGLTF(WORK_WORLD_ROOM_MODEL_PATH, true);

  /** マテリアルを FrontSide に統一（両面描画を無効化） */
  useEffect(() => {
    gltf.scene.traverse((child: Object3D) => {
      if (!(child as Mesh).isMesh) return;

      const mesh = child as Mesh;

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => {
          material.side = FrontSide;
        });
      } else {
        mesh.material.side = FrontSide;
      }
    });
  }, [gltf]);

  return (
    <group name="Room">
      <primitive object={gltf.scene} />
    </group>
  );
});

Room.displayName = 'Room';

useGLTF.preload(WORK_WORLD_ROOM_MODEL_PATH, true);

export default Room;
