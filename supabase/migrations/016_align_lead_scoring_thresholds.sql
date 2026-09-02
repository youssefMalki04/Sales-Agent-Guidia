alter table public.qualification_flows
  alter column scoring set default '{"coldMax":39,"warmMax":69}'::jsonb;

update public.qualification_flows
set scoring = jsonb_set(scoring, '{coldMax}', '39'::jsonb, true)
where key = 'leadia-sales-qualification'
  and coalesce((scoring ->> 'coldMax')::integer, 34) = 34;
