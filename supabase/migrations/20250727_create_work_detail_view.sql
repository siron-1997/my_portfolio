create or replace view public.v_work_detail as (
    select
        w.id
        , w.key
        , w.title
        , w.description
        , w.slug
        , w.created_at
        , w.introduction_title 
        , w.introduction_description 
        , w.controls_title 
        , w.controls_description 
        , mdl.url as model_url
        , json_agg(
        	json_build_object(
        		'title', ci.title
        		, 'description', ci.description
        		, 'animation_name', ci.animation_name 
                , 'is_loop', ci.is_loop
        	)
        ) as controls
    from 
        public.works w
    left join 
        public.files_related_mph m
    on 
        m.related_id = w.id
        and m.related_type = 'api::work.work'
        and m.field = 'model'
    -- files テーブルから実際のファイル情報 (URLなど) を取得
    left join 
        public.files mdl
    on 
        mdl.id = m.file_id
    -- works と control_items の中間テーブル
    left join
    	public.works_control_items_lnk wcil 
    on
    	w.id = wcil.work_id
    -- control_items テーブル
    left join
    	public.control_items ci 
    on
    	ci.id = wcil.control_item_id
    	and w.key = ci.key
    where
    	w.published_at is not null
    group by
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
    order by
    	w.updated_at desc
);