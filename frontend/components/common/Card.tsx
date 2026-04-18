'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import cn from 'classnames';

import { APP_THEME_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import { useImageSize, useWindowSize } from '@/hooks';
import s from '@/styles/common.module.css';
import p from '@/styles/page.module.css';

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

  /** カードの種類 */
  type: 'work' | 'home';
};

const CustomCard = React.memo(
  ({
    image = '',
    alt = '',
    link = '',
    title,
    description,
    categoryType,
    type,
  }: Props): JSX.Element => {
    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** 画像サイズを取得 */
    const { pointWidth, pointHeight } = useImageSize({
      sm: { pointWidth: 320, pointHeight: 240 },
      md: { pointWidth: 360, pointHeight: 270 },
      lg: { pointWidth: 300, pointHeight: 225 },
      xl: { pointWidth: 380, pointHeight: 285 },
      xl2: { pointWidth: 420, pointHeight: 315 },
      xl3: { pointWidth: 520, pointHeight: 390 },
    });

    /** "work" タイプの場合、または"home"タイプで幅が BREAK_POINTS.XS 未満または BREAK_POINTS.SM 以上の場合に適用 */
    const termsWorks =
      type === 'work' ||
      (type === 'home' &&
        !(width && width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM));

    /** "home" タイプで幅が BREAK_POINTS.XS 以上かつ BREAK_POINTS.SM 未満の場合に適用 */
    const termsHome =
      type === 'home' &&
      width &&
      width >= BREAK_POINTS.XS &&
      width < BREAK_POINTS.SM;

    const cardClassNames = cn(
      { [s.card]: termsWorks, [p.card]: termsHome },
      'card',
    );
    const cardMediaClassNames = cn({ [s.card_media]: termsWorks });
    const txtClassNames = cn({
      [s.txt_container]: termsWorks,
      [p.card_txt_container]: termsHome,
    });

    return (
      <div className="content">
        <Card
          className={cardClassNames}
          sx={{ bgcolor: APP_THEME_COLORS.bgColor.dark.sub }}
        >
          <CardMedia className={cardMediaClassNames}>
            {/* カード画像 */}
            <Link href={link}>
              <Image
                src={image}
                alt={alt}
                width={pointWidth}
                height={pointHeight}
                quality={100}
              />
            </Link>
          </CardMedia>

          <CardContent className={txtClassNames}>
            <Link href={link}>
              {/* タイトル */}
              <Typography component="h4" variant="h4">
                {title}
              </Typography>

              {/* 説明 */}
              <Typography component="p" variant="p" className="card_paragraph">
                {description}
              </Typography>
            </Link>
          </CardContent>

          {/* カテゴリタグ */}
          {termsWorks && (
            <CardActions className={s.tags}>
              <Typography variant="tag">{categoryType}</Typography>
            </CardActions>
          )}
        </Card>
      </div>
    );
  },
);

CustomCard.displayName = 'CustomCard';

export default CustomCard;
