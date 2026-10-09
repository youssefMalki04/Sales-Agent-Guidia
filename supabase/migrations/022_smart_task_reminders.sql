alter table public.follow_up_reminders
  add column if not exists upcoming_notified_at timestamptz;

alter table public.notifications
  add column if not exists task_id uuid references public.follow_up_reminders(id) on delete cascade,
  add column if not exists action_url text;

create index if not exists follow_up_reminders_upcoming_delivery_idx
  on public.follow_up_reminders(due_at)
  where status = 'upcoming' and upcoming_notified_at is null;

create index if not exists notifications_task_idx
  on public.notifications(task_id)
  where task_id is not null;
