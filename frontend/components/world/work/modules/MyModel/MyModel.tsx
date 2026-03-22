'use client';

import React from 'react';
import { WorkDetail } from '@/types/api';
import { ModelChildren } from '@/types/world';
import { Model } from './Model';
import { Navigations } from './Navigations';

type Props = {
  content: WorkDetail;
  isNavigationVisible: boolean;
  setModelChildren: React.Dispatch<React.SetStateAction<ModelChildren>>;
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
