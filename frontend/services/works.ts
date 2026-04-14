import { type GetWorksParams, type WorkCategory,type WorkSummary } from '@/types/api';

/**
 * ポートフォリオ作品一覧を取得する。
 *
 * @param params - 取得件数の指定
 * @returns {Promise<WorkSummary[]>} 作品一覧
 
 *
 * @example
 * await getWorks({});
 */
export async function getWorks({ limit }: GetWorksParams = {}): Promise<
  WorkSummary[]
> {
  try {
    const url = new URL(`${process.env.BASE_URL}/api/supabase/works`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    const res = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch works data:', res.statusText);
      }
      return [];
    }

    return res.json();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch works data:', error);
    }
    return [];
  }
}

/**
 * 作品カテゴリ一覧を取得する。
 *
 * @returns {Promise<WorkCategory[]>} 作品カテゴリ一覧
 */
export async function getWorkCategories(): Promise<WorkCategory[]> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/supabase/work-categories`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch work categories:', res.statusText);
      }
      return [];
    }

    return res.json();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch work categories:', error);
    }
    return [];
  }
}
