'use client';

import React, { type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Typography } from '@mui/material';

import { useImageSize } from '@/hooks';
import s from '@/styles/workCard.module.css';

/**
 * WorkCard コンポーネントの Props。
 * 作品一覧で表示するカード。
 */
type Props = {
  /** カード画像の URL */
  image?: string;

  /** リンク先のパス */
  link?: string;

  /** 画像の代替テキスト */
  alt?: string;

  /** カードのタイトル */
  title: string;

  /** カードの説明 */
  description: string;

  /** カテゴリの種類 */
  categoryType: string;
};

/**
 * 作品カードコンポーネント。
 * Figmaデザインに基づくフルブリード画像 + テキストオーバーレイレイアウト。
 * ブレークポイント（XS / SM / LG / XL / 2XL）に応じたカードサイズ調整に対応。
 * バリアント: デフォルト / ホバー（CSS transition で制御）
 */
const WorkCard = React.memo(
  ({
    image = '',
    alt = '',
    link = '',
    title,
    description,
    categoryType,
  }: Props): JSX.Element => {
    /** ブレークポイント別の画像レンダリングサイズを取得 */
    const { pointWidth, pointHeight } = useImageSize({
      sm: { pointWidth: 320, pointHeight: 240 },
      md: { pointWidth: 360, pointHeight: 270 },
      lg: { pointWidth: 300, pointHeight: 225 },
      xl: { pointWidth: 380, pointHeight: 285 },
      xl2: { pointWidth: 420, pointHeight: 315 },
      xl3: { pointWidth: 520, pointHeight: 390 },
    });

    return (
      <Link href={link}>
        <div className={s.work_card}>
          {/** フルブリード画像 */}
          <div className={s.work_card_image_wrapper}>
            {image && (
              <Image
                src={image}
                alt={alt}
                width={pointWidth}
                height={pointHeight}
                quality={100}
              />
            )}
          </div>

          {/** グラデーションオーバーレイ */}
          <div className={s.work_card_gradient} />

          {/** テキストオーバーレイコンテナ */}
          <div className={s.work_card_content}>
            <div className={s.work_card_section}>
              {/** タイトル */}
              <Typography component="h4" className={s.work_card_title}>
                {title}
              </Typography>

              {/** 説明 */}
              <Typography component="p" className={s.work_card_description}>
                {description}
              </Typography>
            </div>

            {/** カテゴリタグ */}
            <Typography component="span" className={s.work_card_tag}>
              {categoryType}
            </Typography>
          </div>
        </div>
      </Link>
    );
  },
);

WorkCard.displayName = 'WorkCard';

export default WorkCard;
