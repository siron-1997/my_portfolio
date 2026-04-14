import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

import { type WorkSummary } from '@/types/api';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * 作品一覧を取得する Route Handler。
 * `v_works` ビューからデータを取得し、`image_url` をプロキシ経由の URL に差し替えて返す。
 * Storage URL をクライアントに露出させず、Strapi でファイルを更新した際も
 * 常に DB の最新パスを参照できる。
 *
 * @param req - Next.js リクエストオブジェクト（クエリパラメータ: `limit`）
 * @returns 作品一覧 JSON（`image_url` はプロキシ URL `/api/supabase/image/[...slug]`）
 
 *
 * @example
 * await GET(req);
 */
export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  let query = supabase.from('v_works').select('*');
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /** image_url をプロキシ URL に差し替える。GLB と同様に Storage URL をクライアントに非公開にする */
  const result: WorkSummary[] = data.map((row) => ({
    ...row,
    image_url: row.image_url
      ? `/api/supabase/image/${row.slug}`
      : row.image_url,
  }));

  return NextResponse.json(result);
}
