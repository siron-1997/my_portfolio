/*
 * v_work_detail の json_agg に FILTER を追加して
 * control_items が存在しない場合に [null] ではなく [] を返すように修正する。
 *
 * 背景:
 *   json_agg はグループ内に行が存在しない場合 NULL を含む配列 [null] を返す。
 *   フロントエンドで controls を配列として扱うため、空の場合は [] が必要。
 *   FILTER (WHERE ci.id IS NOT NULL) で NULL 行を除外し、
 *   COALESCE で空集合時の NULL を '[]'::json に変換する。
 */
CREATE OR REPLACE VIEW public.v_work_detail AS (
    SELECT
        w.id                          -- 作品 ID
        , w.key                       -- 作品キー（モデル取得 API で使用）
        , w.title                     -- 作品タイトル
        , w.description               -- 作品概要
        , w.slug                      -- URL スラッグ
        , w.created_at                -- レコード作成日時
        , w.introduction_title        -- イントロダクションセクションの見出し
        , w.introduction_description  -- イントロダクションセクションの本文
        , w.controls_title            -- コントロールパネルの見出し
        , w.controls_description      -- コントロールパネルの説明文
        , mdl.url AS model_url        -- GLB モデルファイルの Storage URL
        , COALESCE(
            json_agg(
                json_build_object(
                    'title',            ci.title
                    , 'description',    ci.description
                    , 'animation_name', ci.animation_name
                    , 'is_loop',        ci.is_loop
                )
            ) FILTER (WHERE ci.id IS NOT NULL),
            '[]'::json
        ) AS controls                 -- コントロール一覧（control_items がない場合は []）
    FROM
        public.works w
    -- Strapi のリレーション中間テーブル経由で GLB モデルのファイル ID を取得する
    LEFT JOIN
        public.files_related_mph m
    ON
        m.related_id   = w.id
        AND m.related_type = 'api::work.work'
        AND m.field        = 'model'
    -- files テーブルから GLB の Storage URL を取得する
    LEFT JOIN
        public.files mdl
    ON
        mdl.id = m.file_id
    -- works_control_items_lnk 中間テーブル経由でコントロール ID を取得する
    LEFT JOIN
        public.works_control_items_lnk wcil
    ON
        wcil.work_id = w.id
    -- control_items テーブルからコントロールの詳細を取得する（作品キーで絞り込み）
    LEFT JOIN
        public.control_items ci
    ON
        ci.id  = wcil.control_item_id
        AND w.key = ci.key
    -- 公開済み（published_at が設定済み）の作品のみ返す
    WHERE
        w.published_at IS NOT NULL
    -- json_agg のために作品カラムでグループ化する
    GROUP BY
        w.id
        , w.key
        , w.title
        , w.description
        , w.created_at
        , w.introduction_title
        , w.introduction_description
        , w.controls_title
        , w.controls_description
        , mdl.url
    -- 最終更新日の降順で並べる
    ORDER BY
        w.updated_at DESC
);
