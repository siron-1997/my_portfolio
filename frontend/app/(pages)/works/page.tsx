import { type Metadata } from 'next';

import { Container } from '@/components/common';
import { Portal, WorksClient } from '@/components/works';
import { WORKS_PORTAL_TITLE } from '@/constants/works';
import { getWorkCategories, getWorks } from '@/services/works';

/** ISR 1時間 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: WORKS_PORTAL_TITLE,
};

export default async function Works() {
  /** ポートフォリオ作品一覧を取得 */
  const worksData = await getWorks();
  /** 作品カテゴリ一覧を取得 */
  const workCategoriesData = await getWorkCategories();

  return (
    <div className="root_container">
      <Container className="top_container">
        {/** タイトル */}
        <Portal title={WORKS_PORTAL_TITLE} />
        {/** カテゴリフィルターとコンテンツ表示 */}
        <WorksClient
          worksDatum={worksData}
          workCategoriesDatum={workCategoriesData}
        />
      </Container>
    </div>
  );
}
