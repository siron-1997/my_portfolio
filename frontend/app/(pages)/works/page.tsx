import { Metadata } from 'next';
import { CategoryFilter, Contents, Portal } from '@/components/works';
import { Container } from '@/components/common';
import { WorksProvider } from '@/contexts';
import { getWorks, getWorkCategories } from '@/services/works';

export const revalidate = 3600; // ISR 1時間

export const metadata: Metadata = {
  title: 'Works',
};

export default async function Works() {
  const worksData = await getWorks();
  const categoriesData = await getWorkCategories();

  return (
    <div className="root_container">
      <Container className="top_container">
        <WorksProvider>
          <Portal title="Works" />
          <CategoryFilter data={categoriesData} />
          <Contents data={worksData} />
        </WorksProvider>
      </Container>
    </div>
  );
}
