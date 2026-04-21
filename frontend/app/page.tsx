import { HomeClient } from '@/components/home';
import { getWorks } from '@/services/works';

/** ISR 1時間 */
export const revalidate = 3600;

export default async function Home() {
  /** 取得した作品データ (最新3件) */
  const data = await getWorks({ limit: 3 });

  return (
    <>
      {/*
       * SSR HTML がブラウザに描画された瞬間（React ハイドレーション前）に
       * スクロールを禁止する。
       * Works セクションの margin-top: 800px により scrollHeight > clientHeight に
       * なるため、JS 実行前の一瞬スクロールバーが出現するのを防ぐ。
       * インラインスクリプトは HTML パーサーがこのタグに到達した時点で同期実行される。
       */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';`,
        }}
      />
      <HomeClient worksData={data} />
    </>
  );
}
