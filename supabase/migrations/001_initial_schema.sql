create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  name text,
  email text,
  company text,
  country text,
  sector text,
  need text,
  budget text,
  urgency text,
  lead_temperature text not null default 'cold'
    check (lead_temperature in ('cold', 'warm', 'hot')),
  conversion_score integer not null default 0
    check (conversion_score >= 0 and conversion_score <= 100),
  objections jsonb not null default '[]'::jsonb,
  summary text,
  suggested_next_action text,
  crm_status text not null default 'not_sent'
    check (crm_status in ('not_sent', 'pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  session_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  source text,
  category text,
  language text not null default 'fr',
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.knowledge_documents(id) on delete cascade,
  content text not null,
  embedding extensions.vector(768),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_exports (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  type text not null check (type in ('hubspot', 'salesforce', 'slack', 'webhook')),
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed')),
  payload jsonb,
  response jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_session_id_idx
  on public.leads(session_id);

create index if not exists leads_temperature_score_idx
  on public.leads(lead_temperature, conversion_score desc);

create index if not exists conversations_session_id_idx
  on public.conversations(session_id);

create index if not exists conversations_lead_id_idx
  on public.conversations(lead_id);

create index if not exists knowledge_chunks_document_id_idx
  on public.knowledge_chunks(document_id);

create index if not exists crm_exports_lead_id_idx
  on public.crm_exports(lead_id);

create index if not exists agent_events_lead_id_idx
  on public.agent_events(lead_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;

create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;
alter table public.crm_exports enable row level security;
alter table public.agent_events enable row level security;

create policy "dev read leads"
on public.leads
for select
to anon
using (true);

create policy "dev insert leads"
on public.leads
for insert
to anon
with check (true);

create policy "dev read conversations"
on public.conversations
for select
to anon
using (true);

create policy "dev insert conversations"
on public.conversations
for insert
to anon
with check (true);
