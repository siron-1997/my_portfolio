'use client';

import React, { type JSX } from 'react';
import Image from 'next/image';

import { Container } from '@/components/common';
import { SITE_START_YEAR, SNS_LIST } from '@/constants/common';
import s from '@/styles/layout.module.css';

const Footer = React.memo((): JSX.Element => {
  /** 現在の年（ビルド時ではなくレンダリング時に評価される） */
  const currentYear = new Date().getFullYear();

  /** 著作権表記。開始年と現在年が異なる場合は範囲表記にする */
  const copyright =
    currentYear === SITE_START_YEAR
      ? `${SITE_START_YEAR} Junpei Oue`
      : `${SITE_START_YEAR}–${currentYear} Junpei Oue`;

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
                  width={35}
                  height={35}
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
