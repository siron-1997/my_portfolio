import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * 3D モデルファイルのプロキシストリーミング。
 * Supabase Storage の署名付き URL をクライアントに公開せず、
 * サーバーサイドで GLB バイナリを取得して ReadableStream で返す。
 * Network タブには /api/supabase/model/[key] のみ表示され、
 * Storage の URL は露出しない。
 *
 * @param req - Next.js リクエストオブジェクト
 * @param params - URL パラメータ（key: 作品キー）
 * @returns GLB バイナリの ReadableStream レスポンス
 
 *
 * @example
 * await GET(req, {});
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  /** v_work_detail から model_url のみ取得する */
  const { data, error } = await supabase
    .from('v_work_detail')
    .select('model_url')
    .eq('key', key)
    .single();

  if (error || !data?.model_url) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  /** Storage パスを URL から抽出する */
  const path = (data.model_url as string).split('/portfolio-works/')[1];
  if (!path) {
    return NextResponse.json({ error: 'Invalid model path' }, { status: 500 });
  }

  /** Supabase Storage から GLB バイナリを Blob として取得する */
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('portfolio-works')
    .download(path);

  if (downloadError || !fileData) {
    return NextResponse.json({ error: 'Failed to download model' }, { status: 500 });
  }

  /** Blob を ReadableStream としてクライアントへストリーミングする */
  return new NextResponse(fileData.stream(), {
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Cache-Control': 'private, no-store',
    },
  });
}
