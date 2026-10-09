alter table public.follow_up_reminders
  add column if not exists assigned_to text,
  add column if not exists assigned_to_email text;

create index if not exists follow_up_reminders_assigned_to_email_idx
  on public.follow_up_reminders(assigned_to_email);
