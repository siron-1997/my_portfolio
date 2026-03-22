---
applyTo: "supabase/**"
---

# Supabase コーディングルール

## ディレクトリ構成

```
supabase/
├── config.toml         # Supabase ローカル設定
├── migrations/         # SQLマイグレーションファイル
└── functions/          # Edge Functions（Deno ランタイム）
```

## SQL マイグレーション

- ファイル名は `YYYYMMDD_snake_case_description.sql` 形式で統一する。
  - 例: `20250727_create_works_view.sql`
- View 名は `v_` プレフィックスを付ける（例: `v_works`, `v_work_detail`, `v_work_categories`）。
- マイグレーションは冪等性を保つ（`CREATE OR REPLACE VIEW`、`IF NOT EXISTS` などを活用）。
- カラム名・テーブル名: `snake_case`。

## Deno（Edge Functions）

- ランタイムは Deno。TypeScript を使用する。
- 環境変数は `Deno.env.get('VAR_NAME')` で取得し、`null` チェックを忘れない。
- `.vscode/settings.json` の `deno.enablePaths` で `supabase/functions` が有効化されている。
- インポートは Deno の URL インポートまたは `deno.json` の import map を使用する。
- CORS ヘッダーは必要な場合のみ付与し、許可オリジンをできる限り限定する。

## Supabase Storage

- 署名付き URL（`createSignedUrl`）を使ってプライベートバケットのファイルを安全に提供する。
- 有効期限は用途に応じて設定する（例: 画像表示用は 1 時間 = `60 * 60`）。
- Service Role Key はサーバーサイド（Next.js Route Handler / Edge Function）のみで使用し、クライアントには公開しない。

## セキュリティ

- RLS（Row Level Security）はすべてのテーブルで有効化する。
- 公開用 View はデータ公開範囲を最小限に絞り、個人情報・秘匿情報を含めない。
- Supabase Anon Key はクライアントから参照可能だが、バケット・テーブルのアクセス制御は必ず RLS と Storage ポリシーで担保する。
