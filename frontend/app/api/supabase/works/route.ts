import { type NextRequest, NextResponse } from 'next/server';

import { type WorkSummary } from '@/types/api';

import { supabase } from '@/services/supabase';

/**
 * 作品一覧を取得するAPIエンドポイント
 *
 * `v_works` ビューからデータを取得し、`image_url` をプロキシ経由の URL に差し替えて、
 * Storage URL をクライアントに露出させない。
 *
 * @param req - Next.js リクエストオブジェクト（クエリパラメータ: `limit`）
 * @returns 作品一覧 JSON（`image_url` はプロキシ URL `/api/supabase/image/[...slug]`）
 * @example
 * await GET(req);
 */
export async function GET(req: NextRequest) {
  /** クエリパラメータから limit を取得 */
  const limitParam = req.nextUrl.searchParams.get('limit');

  /** limit パラメータを整数に変換 */
  const limit = limitParam !== null ? parseInt(limitParam, 10) : undefined;

  /** limit が NaN または 1 未満の場合は不正なパラメータとして 400 を返す */
  if (limit && (isNaN(limit) || limit < 1)) {
    return NextResponse.json(
      { error: 'Invalid limit parameter' },
      { status: 400 },
    );
  }

  /** Supabase クエリの作成 */
  let query = supabase.from('v_works').select('*');
  if (limit) {
    query = query.limit(limit);
  }

  /** クエリの実行 */
  const { data, error } = await query;

  /** エラー発生 */
  if (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  /** image_url をプロキシ URL に差し替える (Storage URL をクライアントに非公開にする) */
  const result: WorkSummary[] = data.map((row) => ({
    ...row,
    image_url: row.image_url
      ? `/api/supabase/image/${row.slug}`
      : row.image_url,
  }));

  return NextResponse.json(result);
}
