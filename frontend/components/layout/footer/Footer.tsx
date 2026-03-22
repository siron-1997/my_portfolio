'use client';

import Image from 'next/image';
import { Container } from '@/components/common';
import { SNS_LIST } from '@/constants/common';
import useFooter from './useFooter';
import s from '@/styles/layout/Footer.module.css';

const Footer = () => {
  const { iconSize, copyright } = useFooter();

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
};

export default Footer;
