create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  event_key text unique,
  event_type text not null,
  title text not null,
  message text not null,
  severity text not null default 'info'
    check (severity in ('info', 'success', 'warning', 'error')),
  lead_id uuid references public.leads(id) on delete cascade,
  session_id text,
  read_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  id text primary key default 'default',
  enabled_events jsonb not null default '["new-conversation","high-intent","takeover-request","meeting","crm-error"]'::jsonb,
  recipient_emails text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

insert into public.notification_preferences (id)
values ('default') on conflict (id) do nothing;

create index if not exists notifications_created_at_idx on public.notifications(created_at desc);
create index if not exists notifications_unread_idx on public.notifications(read_at) where archived_at is null;

alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
