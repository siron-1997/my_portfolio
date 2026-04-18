'use client';

import React, { type JSX } from 'react';
import Image from 'next/image';

import cn from 'classnames';

import { useIconSize } from '@/hooks';
import { CLOSE_ICON_PATH } from '@/constants/common';
import s from '@/styles/common/button/Close.module.css';

type Props = {
  /** クラス名 */
  className?: string;

  /** 閉じるボタンクリック時のコールバック */
  onClose: () => void;
};

const Close = React.memo(({ className, onClose }: Props): JSX.Element => {
  /** アイコンサイズを取得 */
  const iconSize = useIconSize(35, 40, 50);

  const rootClassNames = cn(className, s.close);

  return (
    <div
      className={rootClassNames}
      onClick={onClose}
      role="button"
      tabIndex={0}
      aria-label="閉じる"
      onKeyDown={(e) => e.key === 'Enter' && onClose()}
    >
      <Image
        src={CLOSE_ICON_PATH}
        alt="close"
        width={iconSize}
        height={iconSize}
        quality={1}
        priority={true}
      />
    </div>
  );
});

Close.displayName = 'Close';

export default Close;
