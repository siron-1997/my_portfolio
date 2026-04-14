import React from 'react';

import { Html } from '@react-three/drei';
import { type Object3D } from 'three';

import { NumberedCircled } from '@/components/common';
import { APP_THEME_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import { type ModelChildren } from '@/types/world';

import useNavigations from './useNavigations';

/** Props の型定義 */
type Props = {
  /** modelChildren */
  modelChildren: ModelChildren;
  /** isNavigationVisible */
  isNavigationVisible: boolean;
};

const Navigations = ({ modelChildren, isNavigationVisible }: Props) => {
  const { width, handleClick } = useNavigations();

  return (
    <group name="navigations">
      {modelChildren
        /** 名前が IS_Sec3_<番号>_<名前> 形式のものを抽出 */
        .filter((child: Object3D) => /^IS_Sec3_\d+_.+/.test(child.name))
        .map((child: Object3D, i: number) => (
          <Html
            key={i}
            position={[child.position.x, child.position.y, child.position.z]}
            style={{ zIndex: 600 }}
          >
            <NumberedCircled
              index={i}
              sx={{
                fontSize: width >= BREAK_POINTS.XS ? 15 : 13,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.2s',
                padding: width >= BREAK_POINTS.XS ? '5px 9px' : '3.5px 8px',
                '&:hover': {
                  borderColor: APP_THEME_COLORS.navigation,
                  color: APP_THEME_COLORS.navigation,
                },
              }}
              onClick={() => handleClick(i)}
              isNavigationVisible={isNavigationVisible}
            />
          </Html>
        ))}
    </group>
  );
};

Navigations.displayName = 'Navigations';

export default React.memo(Navigations);
