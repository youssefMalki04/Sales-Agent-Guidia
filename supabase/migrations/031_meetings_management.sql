begin;
alter table public.meetings add column if not exists archived_at timestamptz;
alter table public.meetings drop constraint if exists meetings_status_check;
alter table public.meetings add constraint meetings_status_check
  check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'));

alter table public.follow_up_reminders add column if not exists meeting_id uuid
  references public.meetings(id) on delete set null;
create index if not exists follow_up_meeting_idx on public.follow_up_reminders(meeting_id);

create table if not exists public.meeting_activity (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  action text not null,
  changes jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.meeting_activity enable row level security;
create index if not exists meeting_activity_date_idx on public.meeting_activity(meeting_id, created_at desc);

create or replace function public.record_meeting_activity() returns trigger
language plpgsql security definer set search_path = public as $$
declare differences jsonb := '{}'; field text;
begin
  if tg_op = 'INSERT' then
    insert into public.meeting_activity(meeting_id, action) values(new.id, 'created');
  else
    foreach field in array array['title','owner','scheduled_date','scheduled_time','duration','status','archived_at','lead_id'] loop
      if to_jsonb(old)->field is distinct from to_jsonb(new)->field then
        differences := differences || jsonb_build_object(field, jsonb_build_object('before',to_jsonb(old)->field,'after',to_jsonb(new)->field));
      end if;
    end loop;
    if differences <> '{}'::jsonb then
      insert into public.meeting_activity(meeting_id,action,changes) values(new.id,'updated',differences);
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.record_meeting_activity() from public;
drop trigger if exists meetings_activity on public.meetings;
create trigger meetings_activity after insert or update on public.meetings
  for each row execute function public.record_meeting_activity();
notify pgrst, 'reload schema';
commit;
