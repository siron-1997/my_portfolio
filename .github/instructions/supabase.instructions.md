---
applyTo: "supabase/**"
---

# Supabase コーディングルール

## ディレクトリ構成

```
supabase/
├── config.toml         # Supabase ローカル設定
├── migrations/         # SQL マイグレーションファイル（追記のみ・変更・削除禁止）
├── queries/            # 調査・デバッグ用クエリ（副作用なし・マイグレーション対象外）
└── functions/          # Edge Functions（Deno ランタイム）
```

## SQL マイグレーション

- ファイル名は `YYYYMMDD_snake_case_description.sql` 形式で統一する。
  - 例: `20250727_create_works_view.sql`
- View 名は `v_` プレフィックスを付ける（例: `v_works`, `v_work_detail`, `v_work_categories`）。
- マイグレーションは冪等性を保つ（`CREATE OR REPLACE VIEW`、`IF NOT EXISTS` などを活用）。
- カラム名・テーブル名: `snake_case`。

### マイグレーションファイルの不変性ルール

**一度作成したマイグレーションファイルは変更・削除禁止。**
Supabase は `supabase_migrations` テーブルでどのファイルが適用済みかを管理しており、
ファイルを削除・改変すると適用記録と実体がズレ、`supabase db push` による新環境構築が失敗する。

- **既存ビューを修正したい場合**: 新しいタイムスタンプで `fix_` プレフィックスのファイルを作成し、`CREATE OR REPLACE VIEW` で上書きする
- **旧ファイルはそのまま残す**: `fix_` ファイルと旧ファイルが共存するのが正しい状態

```
# 例: v_works の修正
20250727_create_works_view.sql          ← 初回作成（残す）
20260329_fix_v_works_image_url_formats.sql   ← 修正版（後から追加）
```

実行順はタイムスタンプ順となり、最後に実行されたファイルの定義が有効になる。

## 調査・デバッグ用クエリ

調査・確認・デバッグ目的のクエリは `migrations/` ではなく `supabase/queries/` に配置する。
`migrations/` に置くと Supabase のマイグレーション管理に誤って取り込まれるリスクがある。

- ファイル名: 内容がわかる `snake_case` の名前（例: `check_works_view.sql`）
- `SELECT` のみで副作用（`INSERT` / `UPDATE` / `DELETE` / `CREATE`）を持たないクエリのみ配置する
- ファイル先頭に目的と注意書きをコメントで記述する

```sql
/*
 * check_works_view.sql: v_works ビューの出力内容を確認するデバッグクエリ。
 * このファイルはマイグレーション対象外。実行しても DB に変更を加えない。
 */
SELECT
    slug          -- 作品スラッグ
    , image_url   -- 署名前の Storage パス
FROM
    public.v_works
LIMIT 10;
```

## SQL スタイルガイド

### キーワードのケース

SQL 予約語（`SELECT`、`FROM`、`WHERE`、`JOIN`、`ON`、`AS`、`ORDER BY` など）は**すべて大文字（UPPERCASE）**で記述する。
識別子（テーブル名・カラム名・エイリアス）は `snake_case` の小文字で記述する。

> **理由**: SQL 予約語と識別子を視覚的に区別しやすく、可読性が向上する。PostgreSQL 公式ドキュメントをはじめ、多くの SQL スタイルガイドで採用されている標準的な慣習。

```sql
-- ✅ Good: 予約語は大文字、識別子は小文字
SELECT w.id, w.title FROM public.works w WHERE w.published_at IS NOT NULL;

-- ❌ Bad: 予約語が小文字で識別子と区別しにくい
select w.id, w.title from public.works w where w.published_at is not null;
```

### コメントスタイル

| 対象                 | スタイル        | 内容                                     |
| -------------------- | --------------- | ---------------------------------------- |
| ファイル先頭（概要） | `/* */` 複数行  | このファイルの目的・背景・変更理由を記述 |
| SELECT カラム        | `--` インライン | カラムの意味・変換・フォールバック理由   |
| JOIN / ON 句         | `--` 直上       | どのテーブルを何の目的で結合するか       |
| WHERE / ORDER BY 句  | `--` 直上       | 条件・並び順の意図                       |

### コード例

```sql
/*
 * v_works: 公開済み作品の一覧ビュー。
 *
 * 背景:
 *   Strapi のアップロードプロバイダーはオリジナル画像を Storage に保存しないため、
 *   files.url が Storage に存在しないケースがある。
 *   formats カラムの large → medium → small → url の順でフォールバックし、
 *   実際に Storage に存在するファイルの URL を返す。
 */
CREATE OR REPLACE VIEW public.v_works AS (
    SELECT
        w.id                                                             -- 作品 ID
        , w.title                                                        -- 作品タイトル
        , w.slug                                                         -- URL スラッグ（カテゴリ/キー 形式）
        , COALESCE(
            img.formats->'large'->>'url',
            img.formats->'medium'->>'url',
            img.formats->'small'->>'url',
            img.url
        ) AS image_url                                                   -- サムネイル URL（large → medium → small → オリジナルの順でフォールバック）
        , img.alternative_text                                           -- 画像の代替テキスト
        , c.key   AS category_key                                        -- カテゴリキー（フィルタリング用）
        , c.name  AS category_name                                       -- カテゴリ表示名
    FROM
        public.works w
    -- Strapi のリレーション中間テーブル経由でメイン画像のファイル ID を取得する
    LEFT JOIN
        public.files_related_mph m
    ON
        m.related_id   = w.id
        AND m.related_type = 'api::work.work'
        AND m.field        = 'main_image'
    -- files テーブルから実際のファイル情報（URL・formats・alt テキスト）を取得する
    LEFT JOIN
        public.files img
    ON
        img.id = m.file_id
    -- works_category_lnk 中間テーブル経由でカテゴリ ID を取得する
    LEFT JOIN
        public.works_category_lnk wc
    ON
        wc.work_id = w.id
    -- カテゴリの表示名・キーを取得する
    LEFT JOIN
        public.categories c
    ON
        c.id = wc.category_id
    -- 公開済み（published_at が設定済み）の作品のみ返す
    WHERE
        w.published_at IS NOT NULL
    -- 最終更新日の降順で並べる
    ORDER BY
        w.updated_at DESC
);
```

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
