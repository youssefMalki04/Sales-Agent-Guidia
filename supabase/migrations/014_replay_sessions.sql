create table if not exists public.replay_sessions (
  session_id text primary key,
  lead_id uuid references public.leads(id) on delete set null,
  landing_page text,
  last_page text,
  status text not null default 'active' check (status in ('active','completed')),
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.replay_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.replay_sessions(session_id) on delete cascade,
  event_type text not null check (event_type in ('page_view','chat_opened','chat_closed','message_sent','contact_saved','demo_requested','meeting_booked')),
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists replay_sessions_last_seen_idx on public.replay_sessions(last_seen_at desc);
create index if not exists replay_events_session_idx on public.replay_events(session_id, created_at);
alter table public.replay_sessions enable row level security;
alter table public.replay_events enable row level security;
