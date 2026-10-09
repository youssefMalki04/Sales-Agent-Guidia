alter table public.follow_up_reminders
  add column if not exists priority text not null default 'medium'
  check (priority in ('low', 'medium', 'high', 'urgent'));

create index if not exists follow_up_reminders_priority_idx
  on public.follow_up_reminders(priority, due_at);
