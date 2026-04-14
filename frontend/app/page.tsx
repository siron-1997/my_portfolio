import { HomeClient } from '@/components/home';
import { getWorks } from '@/services/works';

/** ISR 1時間 */
export const revalidate = 3600;

export default async function Home() {
  /** 取得した作品データ (最新3件) */
  const data = await getWorks({ limit: 3 });

  return <HomeClient worksData={data} />;
}
