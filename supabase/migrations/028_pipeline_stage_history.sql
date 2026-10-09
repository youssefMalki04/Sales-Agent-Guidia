begin;

-- Capture only transitions observed after this migration. A lead's current
-- stage does not establish when (or through which stages) it arrived there.
create or replace function public.record_lead_pipeline_stage_change()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  insert into public.agent_events (lead_id, event_type, payload, created_at)
  values (
    new.id,
    'lead_pipeline_stage_changed',
    jsonb_build_object(
      'fromStage', old.pipeline_stage,
      'toStage', new.pipeline_stage
    ),
    clock_timestamp()
  );

  return new;
end;
$$;

drop trigger if exists record_lead_pipeline_stage_change on public.leads;

create trigger record_lead_pipeline_stage_change
after update of pipeline_stage on public.leads
for each row
when (old.pipeline_stage is distinct from new.pipeline_stage)
execute function public.record_lead_pipeline_stage_change();

commit;
