/*
 * v_works の image_url を formats フォールバック対応に修正。
 *
 * 背景:
 *   Strapi のアップロードプロバイダーはオリジナルファイルを Storage に保存しないため、
 *   files.url が指すファイルが Storage に存在せず署名付き URL 生成が失敗していた。
 *   formats カラムの large → medium → small → url の順でフォールバックし、
 *   実際に Storage に存在するファイルの URL を返すように修正する。
 */
CREATE OR REPLACE VIEW public.v_works AS (
    SELECT
        w.id                                                             -- 作品 ID
        , w.title                                                        -- 作品タイトル
        , w.description                                                  -- 作品概要
        , w.slug                                                         -- URL スラッグ（カテゴリ/キー 形式）
        , w.created                                                      -- 制作日
        , w.created_at                                                   -- レコード作成日時
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
