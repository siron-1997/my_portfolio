import { Metadata } from 'next';
import { CategoryFilter, Contents, Portal } from '@/components/works';
import { Container } from '@/components/common';
import { WorksProvider } from '@/contexts';
import { getWorks, getWorkCategories } from '@/services/works';

/** ISR 1時間 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Works',
};

export default async function Works() {
  /** ポートフォリオ作品一覧を取得 */
  const worksData = await getWorks();
  /** 作品カテゴリ一覧を取得 */
  const categoriesData = await getWorkCategories();

  return (
    <div className="root_container">
      <Container className="top_container">
        <Portal title="Works" />
        <WorksProvider>
          <CategoryFilter data={categoriesData} />
          <Contents data={worksData} />
        </WorksProvider>
      </Container>
    </div>
  );
}
