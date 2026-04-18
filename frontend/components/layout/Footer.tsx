'use client';

import React from 'react';
import Image from 'next/image';

import { Container } from '@/components/common';
import { SNS_LIST } from '@/constants/common';
import { useIconSize } from '@/hooks';
import s from '@/styles/layout/Footer.module.css';

const Footer = React.memo(() => {
  /** アイコンサイズを取得 */
  const iconSize = useIconSize(35, 35, 35);

  /** サイト公開年（著作権表記の開始年） */
  const startYear = 2023;

  /** 現在の年（ビルド時ではなくレンダリング時に評価される） */
  const currentYear = new Date().getFullYear();

  /** 著作権表記。開始年と現在年が異なる場合は範囲表記にする */
  const copyright =
    currentYear === startYear
      ? `${startYear} Junpei Oue`
      : `${startYear}–${currentYear} Junpei Oue`;

  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.footer_row}>
          <div className={s.sns}>
            {SNS_LIST.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <Image
                  src={item.imageFilePath}
                  alt={item.alt}
                  width={iconSize}
                  height={iconSize}
                  quality={1}
                />
              </a>
            ))}
          </div>

          <div className={s.copyright}>
            <p>
              {'\u00A9'} {copyright}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
