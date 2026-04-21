import { createClient } from '@supabase/supabase-js';

/**
 * Supabase クライアント（サービスロール）。
 * Route Handler から Supabase に接続するための共有クライアント。
 * サービスロールキーを使用するため、サーバーサイド専用。
 */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
