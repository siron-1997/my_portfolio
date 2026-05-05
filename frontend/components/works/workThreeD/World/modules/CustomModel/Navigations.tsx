import React, { useCallback } from 'react';

import { Html } from '@react-three/drei';
import type { Dispatch, JSX } from 'react';
import { type Object3D } from 'three';

import { NumberedCircled } from '@/components/common';
import { APP_THEME_COLORS, WORK_THREE_D_UI_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import { WORK_WORLD_NAVIGATION_SECTION_REGEX } from '@/constants/workThreeD';
import { useWindowSize } from '@/hooks';
import { type WorkThreeDAction } from '@/types/contexts';
import { type ModelChildren } from '@/types/world';

type Props = {
  /** モデルの子要素リスト */
  modelChildren: ModelChildren;

  /** ナビゲーション表示フラグ */
  isNavigationVisible: boolean;

  /** work 個別ページの状態 (3D) を更新する関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

const Navigations = React.memo(
  ({ modelChildren, isNavigationVisible, dispatch }: Props): JSX.Element => {
    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /**
     * ナビゲーションクリック時のコールバック
     *
     * @param index クリックされたナビゲーションのインデックス
     */
    const handleClick = useCallback(
      (index: number): void => {
        dispatch({ type: 'NAVIGATE_TO', payload: index });
      },
      [dispatch],
    );

    return (
      <group name="navigations">
        {modelChildren
          /** 名前が IS_Sec3_<番号>_<名前> 形式のものを抽出 */
          .filter((child: Object3D) =>
            WORK_WORLD_NAVIGATION_SECTION_REGEX.test(child.name),
          )
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
                  borderColor: WORK_THREE_D_UI_COLORS.borderDefault,
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
  },
);

Navigations.displayName = 'Navigations';

export default Navigations;
