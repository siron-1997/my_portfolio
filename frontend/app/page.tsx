import { ModelViewerLoading, Portal, Works } from '@/components/home';
import { PageHeader } from '@/components/common';
import { HomeWorld } from '@/components/world/home';
import { HomeProvider } from '@/contexts';
import { getWorks } from '@/services/works';
import s from '@/styles/home/index.module.css';

export const revalidate = 3600; // ISR 1時間

export default async function Home() {
  const data = await getWorks({ limit: 3 });

  return (
    <HomeProvider>
      <div className={s.world_container}>
        <HomeWorld />
        <ModelViewerLoading />
      </div>
      <PageHeader id="3d-page-header" figcaptionClassName={s.figcaption}>
        <Portal />
      </PageHeader>
      <Works data={data} />
    </HomeProvider>
  );
}
