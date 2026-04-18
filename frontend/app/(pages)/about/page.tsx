import { type Metadata } from 'next';

import {
  CareerHistory,
  Introduction,
  Portal,
  ProfileImage,
  SkillList,
} from '@/components/about';
import { Container } from '@/components/common';
import { ABOUT_PORTAL_TITLE } from '@/constants/about';
import s from '@/styles/about.module.css';

export const metadata: Metadata = {
  title: 'About',
};

export default function About() {
  return (
    <div className="root_container">
      <Container className="top_container">
        <div className={`shadow_container ${s.profile_container}`}>
          {/** ページタイトル */}
          <Portal title={ABOUT_PORTAL_TITLE} />

          {/** プロフィール */}
          <div className={s.profile}>
            {/** プロフィール画像 */}
            <ProfileImage />

            <div className={s.profile_info}>
              {/** 自己紹介文 */}
              <Introduction />

              {/** スキルリスト */}
              <SkillList />
            </div>
          </div>

          {/** 経歴 */}
          <CareerHistory />
        </div>
      </Container>
    </div>
  );
}
