'use client';

import React from 'react';

import { ListItem, Typography } from '@mui/material';
import type { CSSProperties, JSX } from 'react';

import { WORK_THREE_D_UI_COLORS } from '@/constants/colors';

type Props = {
  /** コントロールパネルの項目タイトル */
  title: string;

  /** コントロールパネルの項目説明 */
  description: string;

  /** コントロールパネルの項目インデックス */
  index: number;

  /** コントロールパネルの項目のクラス名 */
  className: string;

  /** コントロールパネルの項目のスタイル */
  style?: CSSProperties;

  /** コントロールパネルの項目のクリックイベントハンドラ */
  onClick: (index: number) => void;
};

const ControlItems = React.memo(
  ({
    title,
    description,
    index,
    className,
    style,
    onClick,
  }: Props): JSX.Element => {
    /** カスタムスタイル */
    const customStyles = {
      fontSize: 15,
      lineHeight: 1.2,
      letterSpacing: 1,
      borderRadius: 10,
      cursor: 'pointer',
      border: `2px solid ${WORK_THREE_D_UI_COLORS.borderDefault}`,
      backgroundColor: WORK_THREE_D_UI_COLORS.bgTransparent,
      padding: '2px 7px 3px 7px',
    };

    return (
      <ListItem
        className={className}
        style={style}
        onClick={() => onClick(index)}
      >
        {/* タイトル */}
        <Typography
          component="h5"
          variant="h5"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto' }}
        >
          {/* インデックス */}
          <Typography component="span" sx={customStyles}>
            {index + 1}
          </Typography>

          {title}
        </Typography>

        {/* 説明文 */}
        <Typography component="p" variant="p" sx={{ fontSize: 13, mr: 'auto' }}>
          {description}
        </Typography>
      </ListItem>
    );
  },
);

ControlItems.displayName = 'ControlItems';

export default ControlItems;
