'use client';

import React from 'react';
import type { JSX } from 'react';

import { useGLTF } from '@react-three/drei';

import { DRACO_DECODER_PATH } from '@/constants/common';
import { WORK_WORLD_ROOM_MODEL_PATH } from '@/constants/workThreeD';

/** DRACO デコーダーパスを設定 */
useGLTF.setDecoderPath(DRACO_DECODER_PATH);

const Room = React.memo((): JSX.Element => {
  /** GLTF モデルを読み込む */
  const gltf = useGLTF(WORK_WORLD_ROOM_MODEL_PATH, true);

  return (
    <group name="Room">
      <primitive object={gltf.scene} />
    </group>
  );
});

Room.displayName = 'Room';

useGLTF.preload(WORK_WORLD_ROOM_MODEL_PATH, true);

export default Room;
