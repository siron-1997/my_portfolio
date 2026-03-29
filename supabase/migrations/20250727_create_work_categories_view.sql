/*
 * v_work_categories: 公開済みカテゴリの一覧ビュー。
 * 作品一覧ページのフィルタリング UI で使用するカテゴリ一覧を返す。
 */
CREATE OR REPLACE VIEW public.v_work_categories AS (
    SELECT
        id    -- カテゴリ ID
        , key  -- カテゴリキー（フィルタリング用）
        , name -- カテゴリ表示名
    FROM
        public.categories
    -- 公開済み（published_at が設定済み）のカテゴリのみ返す
    WHERE
        published_at IS NOT NULL
    -- ID 昇順（表示順を固定する）
    ORDER BY
        id
);
