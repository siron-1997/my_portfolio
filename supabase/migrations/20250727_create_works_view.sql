create or replace view public.v_works as (
    select
        w.id
        , w.title
        , w.description
        , w.slug
        , w.created
        , w.created_at
        , img.url as image_url
        , img.alternative_text as alternative_text
        , c.key as category_key
        , c.name as category_name
    from 
        public.works w
    -- main_image フィールドに紐づくファイルを取得
    left join 
        public.files_related_mph m
    on 
        m.related_id = w.id
        and m.related_type = 'api::work.work'
        and m.field = 'main_image'
    -- files テーブルから実際のファイル情報（URLなど）を取得
    left join 
        public.files img
    on 
        img.id = m.file_id
    -- works と categories の中間テーブルを結合してカテゴリ ID を取得
    left join
        public.works_category_lnk wc
    on 
        w.id = wc.work_id
    -- categories テーブル
    left join
        public.categories c
    on 
        c.id = wc.category_id
    where
        w.published_at is not null
    order by
        w.updated_at desc
);