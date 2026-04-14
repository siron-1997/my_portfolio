import { type Metadata } from 'next';

import {
  CareerHistory,
  Introduction,
  Portal,
  ProfileImage,
  SkillList,
} from '@/components/about';
import { Container } from '@/components/common';
import s from '@/styles/about/index.module.css';

export const metadata: Metadata = {
  title: 'About',
};

export default function About() {
  return (
    <div className="root_container">
      <Container className="top_container">
        <div className={`shadow_container ${s.profile_container}`}>
          {/* ページタイトル */}
          <Portal title="About" />

          {/* プロフィール */}
          <div className={s.profile}>
            {/* プロフィール画像 */}
            <ProfileImage />

            <div className={s.profile_info}>
              {/* 自己紹介文 */}
              <Introduction />

              {/* スキルリスト */}
              <SkillList />
            </div>
          </div>

          {/* 経歴 */}
          <CareerHistory />
        </div>
      </Container>
    </div>
  );
}
