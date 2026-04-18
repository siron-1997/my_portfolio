import { NextResponse, NextRequest } from 'next/server';

import { supabase } from '@/services/supabase';

/**
 * Content-Type をファイルパスの拡張子から判定する処理
 *
 * @param path - Storage のファイルパス（例: `large_rc_plane.webp-abc123.webp`）
 * @returns MIME タイプ文字列。未知の拡張子の場合は `application/octet-stream`
 * @example
 * getContentType(path);
 */
function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    webp: 'image/webp',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    avif: 'image/avif',
  };
  return map[ext ?? ''] ?? 'application/octet-stream';
}

/**
 * 作品サムネイル画像のプロキシストリーミング
 *
 * Supabase Storage の URL をクライアントに公開せず、
 * サーバーサイドで画像バイナリを取得して ReadableStream で返す。
 * Network タブには /api/supabase/image/[slug] のみ表示し、
 * Storage の URL は露出させない。
 *
 * @param req - Next.js リクエストオブジェクト
 * @param params - URL パラメータ（slug: 作品スラッグ）
 * @returns 画像バイナリの ReadableStream レスポンス
 * @example
 * await GET(req, {});
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug: slugParts } = await params;

  /** slug は複数セグメント（例: `['3d', 'rc_plane']`）→ 結合して `'3d/rc_plane'` 形式に戻す */
  const slug = slugParts?.join('/');

  /** slug が存在しない場合 */
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  /** v_works から image_url のみ取得する */
  const { data, error } = await supabase
    .from('v_works')
    .select('image_url')
    .eq('slug', slug)
    .single();

  /** image_url が存在しない場合 */
  if (error || !data?.image_url) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  /** Storage パスを URL から抽出する */
  const path = (data.image_url as string).split('/portfolio-works/')[1];

  /** path が存在しない場合 */
  if (!path) {
    return NextResponse.json({ error: 'Invalid image path' }, { status: 500 });
  }

  /** Supabase Storage から画像バイナリを Blob として取得する */
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('portfolio-works')
    .download(path);

  /** 画像のダウンロードに失敗した場合 */
  if (downloadError || !fileData) {
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 },
    );
  }

  /** Blob を ReadableStream としてクライアントへストリーミングする */
  return new NextResponse(fileData.stream(), {
    headers: {
      'Content-Type': getContentType(path),
      'Cache-Control': 'private, no-store',
    },
  });
}
