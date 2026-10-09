alter table public.follow_up_reminders
  add column if not exists notified_at timestamptz;

create index if not exists follow_up_reminders_due_delivery_idx
  on public.follow_up_reminders(due_at)
  where status = 'upcoming' and notified_at is null;

update public.notification_preferences
set enabled_events = enabled_events || '["follow-up-due"]'::jsonb
where id = 'default'
  and not enabled_events @> '["follow-up-due"]'::jsonb;
