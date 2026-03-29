/*
 * v_works: 公開済み作品の一覧ビュー（初期バージョン）。
 * 作品一覧ページおよびホームの Works セクションで使用する。
 *
 * ※ image_url に files.url をそのまま使用しているが、Strapi のアップロードプロバイダーが
 *   オリジナルファイルを Storage に保存しない場合は Storage に存在しない URL を返す。
 *   → 20260329_fix_v_works_image_url_formats.sql で COALESCE による formats フォールバックに修正済み。
 */
CREATE OR REPLACE VIEW public.v_works AS (
    SELECT
        w.id                          -- 作品 ID
        , w.title                     -- 作品タイトル
        , w.description               -- 作品概要
        , w.slug                      -- URL スラッグ（カテゴリ/キー 形式）
        , w.created                   -- 制作日
        , w.created_at                -- レコード作成日時
        , img.url AS image_url        -- サムネイル URL（files.url をそのまま使用。formats フォールバックなし）
        , img.alternative_text        -- 画像の代替テキスト
        , c.key  AS category_key      -- カテゴリキー（フィルタリング用）
        , c.name AS category_name     -- カテゴリ表示名
    FROM
        public.works w
    -- Strapi のリレーション中間テーブル経由でメイン画像のファイル ID を取得する
    LEFT JOIN
        public.files_related_mph m
    ON
        m.related_id   = w.id
        AND m.related_type = 'api::work.work'
        AND m.field        = 'main_image'
    -- files テーブルから実際のファイル情報（URL・alt テキスト）を取得する
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