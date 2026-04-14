'use client';

import React from 'react';

import { type WorkDetail } from '@/types/api';
import { type ModelChildren } from '@/types/world';

import { Model } from './Model';
import { Navigations } from './Navigations';

/** Props の型定義 */
type Props = {
  /** content */
  content: WorkDetail;
  /** isNavigationVisible */
  isNavigationVisible: boolean;
  /** setModelChildren */
  setModelChildren: React.Dispatch<React.SetStateAction<ModelChildren>>;
  /** modelChildren */
  modelChildren: ModelChildren;
};

const MyModel = ({
  content,
  isNavigationVisible,
  setModelChildren,
  modelChildren,
}: Props) => {
  return (
    <group name="import-model" scale={[1, 1, 1]}>
      <Navigations
        modelChildren={modelChildren}
        isNavigationVisible={isNavigationVisible}
      />
      <Model content={content} setModelChildren={setModelChildren} />
    </group>
  );
};

export default React.memo(MyModel);
