import React from 'react';
import { WorkDetail } from '@/types/api';
import { ModelChildren } from '@/types/world';
import useModel from './useModel';

/** Props の型定義 */
type Props = {
  /** content */
  content: WorkDetail;
  /** setModelChildren */
  setModelChildren: React.Dispatch<React.SetStateAction<ModelChildren>>;
};

const Model = ({ content, setModelChildren }: Props) => {
  const { groupRef, gltf } = useModel({ content, setModelChildren });

  return (
    <group name="model-container" ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};

Model.displayName = 'Model';

export default React.memo(Model);
