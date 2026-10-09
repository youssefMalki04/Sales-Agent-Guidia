-- Run only against an isolated test database with the leads/agent_events schema
-- from migrations 001 and 009, followed by migration 028. For example:
-- psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/pipeline_stage_history.sql
-- Requires permission to create a temporary trigger on public.agent_events.
-- All fixtures, helper functions, and the failure-injection trigger roll back.
begin;

create function pg_temp.assert_pipeline_history(condition boolean, description text)
returns void
language plpgsql
as $$
begin
  if condition is distinct from true then
    raise exception 'Pipeline stage history assertion failed: %', description;
  end if;
end;
$$;

create function pg_temp.reject_pipeline_history_test_event()
returns trigger
language plpgsql
as $$
begin
  raise exception using
    errcode = 'P9001',
    message = 'Forced pipeline history event insert failure';
end;
$$;

create trigger pipeline_history_test_reject_event
before insert on public.agent_events
for each row
when (
  new.event_type = 'lead_pipeline_stage_changed'
  and new.lead_id::text = current_setting('leadia.pipeline_history_test_lead_id', true)
)
execute function pg_temp.reject_pipeline_history_test_event();

do $$
declare
  first_lead_id uuid := gen_random_uuid();
  second_lead_id uuid := gen_random_uuid();
  missing_lead_id uuid := gen_random_uuid();
  transition_started_at timestamptz;
  expected_event_count integer := 0;
  transition text[];
  transitions text[][] := array[
    ['new', 'qualified'],
    ['qualified', 'meeting'],
    ['meeting', 'qualified'],
    ['qualified', 'proposal'],
    ['proposal', 'won'],
    ['won', 'lost'],
    ['lost', 'new']
  ];
begin
  insert into public.leads (id, session_id)
  values
    (first_lead_id, 'pipeline-history-test-' || first_lead_id::text),
    (second_lead_id, 'pipeline-history-test-' || second_lead_id::text);

  perform pg_temp.assert_pipeline_history(
    (select count(*) = 0 from public.agent_events
      where lead_id in (first_lead_id, second_lead_id)
        and event_type = 'lead_pipeline_stage_changed'),
    'inserting leads must not invent stage transitions'
  );

  update public.leads set pipeline_stage = 'new' where id = first_lead_id;
  update public.leads set owner = 'Pipeline regression owner' where id = first_lead_id;
  update public.leads set crm_status = 'sent' where id = first_lead_id;
  update public.leads set pipeline_stage = 'meeting' where id = missing_lead_id;

  perform pg_temp.assert_pipeline_history(
    (select count(*) = 0 from public.agent_events
      where lead_id in (first_lead_id, second_lead_id, missing_lead_id)
        and event_type = 'lead_pipeline_stage_changed'),
    'same-stage, unrelated-field, and unmatched updates must not create history'
  );

  foreach transition slice 1 in array transitions loop
    transition_started_at := clock_timestamp();
    update public.leads set pipeline_stage = transition[2] where id = first_lead_id;
    expected_event_count := expected_event_count + 1;

    perform pg_temp.assert_pipeline_history(
      (select count(*) = expected_event_count from public.agent_events
        where lead_id = first_lead_id
          and event_type = 'lead_pipeline_stage_changed'),
      'each forward or backward transition must produce exactly one event'
    );
    perform pg_temp.assert_pipeline_history(
      (select count(*) = 1 from public.agent_events
        where lead_id = first_lead_id
          and event_type = 'lead_pipeline_stage_changed'
          and payload = jsonb_build_object('fromStage', transition[1], 'toStage', transition[2])
          and created_at >= transition_started_at
          and created_at <= clock_timestamp()),
      'history must preserve exact stages and the transition time, not transaction start'
    );
    perform pg_temp.assert_pipeline_history(
      (select pipeline_stage = transition[2] and crm_status = 'sent'
        from public.leads where id = first_lead_id),
      'stage changes must persist without changing CRM status'
    );
  end loop;

  begin
    update public.leads set pipeline_stage = 'not-a-stage' where id = first_lead_id;
    raise exception 'Expected invalid stage to be rejected';
  exception when check_violation then
    null;
  end;

  begin
    update public.leads set pipeline_stage = 'qualified' where id = first_lead_id;
    raise exception using errcode = 'P9002', message = 'Roll back a successful stage update';
  exception when sqlstate 'P9002' then
    null;
  end;

  perform pg_temp.assert_pipeline_history(
    (select pipeline_stage = 'new' and crm_status = 'sent'
      from public.leads where id = first_lead_id),
    'invalid and rolled-back updates must leave the lead unchanged'
  );
  perform pg_temp.assert_pipeline_history(
    (select count(*) = expected_event_count from public.agent_events
      where lead_id = first_lead_id
        and event_type = 'lead_pipeline_stage_changed'),
    'invalid and rolled-back updates must not leave history behind'
  );

  update public.leads set pipeline_stage = 'qualified'
  where id in (first_lead_id, second_lead_id);
  expected_event_count := expected_event_count + 1;

  perform pg_temp.assert_pipeline_history(
    (select count(*) = expected_event_count from public.agent_events
      where lead_id = first_lead_id and event_type = 'lead_pipeline_stage_changed')
    and (select count(*) = 1 from public.agent_events
      where lead_id = second_lead_id
        and event_type = 'lead_pipeline_stage_changed'
        and payload = '{"fromStage":"new","toStage":"qualified"}'::jsonb),
    'multi-row updates must record each changed lead separately'
  );

  update public.leads set pipeline_stage = 'qualified'
  where id in (first_lead_id, second_lead_id);
  perform pg_temp.assert_pipeline_history(
    (select count(*) = expected_event_count + 1 from public.agent_events
      where lead_id in (first_lead_id, second_lead_id)
        and event_type = 'lead_pipeline_stage_changed'),
    'repeating a multi-row stage update must not duplicate history'
  );

  perform set_config('leadia.pipeline_history_test_lead_id', first_lead_id::text, true);
  begin
    update public.leads set pipeline_stage = 'meeting' where id = first_lead_id;
    raise exception 'Expected history insertion to fail';
  exception when sqlstate 'P9001' then
    null;
  end;

  perform pg_temp.assert_pipeline_history(
    (select pipeline_stage = 'qualified' and crm_status = 'sent'
      from public.leads where id = first_lead_id),
    'an event insertion failure must roll back its stage update'
  );
  perform pg_temp.assert_pipeline_history(
    (select count(*) = expected_event_count from public.agent_events
      where lead_id = first_lead_id
        and event_type = 'lead_pipeline_stage_changed'),
    'a failed event insertion must leave no partial history'
  );

  raise notice 'All pipeline stage history regression checks passed';
end;
$$;

rollback;
