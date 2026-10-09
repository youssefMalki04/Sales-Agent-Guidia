create table if not exists public.follow_up_activity (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.follow_up_reminders(id) on delete cascade,
  action text not null check (action in ('created', 'updated', 'completed', 'reopened', 'commented')),
  actor_name text not null default 'Leadia team',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists follow_up_activity_reminder_created_idx
  on public.follow_up_activity(reminder_id, created_at desc);

alter table public.follow_up_activity enable row level security;

insert into public.follow_up_activity (
  reminder_id,
  action,
  actor_name,
  message,
  created_at
)
select
  reminder.id,
  'created',
  'Leadia team',
  'Task created.',
  reminder.created_at
from public.follow_up_reminders reminder
where not exists (
  select 1
  from public.follow_up_activity activity
  where activity.reminder_id = reminder.id
    and activity.action = 'created'
);
