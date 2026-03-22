create or replace view public.v_work_categories as (
	select
		id
		, key
		, name
	from
		public.categories
	where
		published_at is not null
	order by
		id
);