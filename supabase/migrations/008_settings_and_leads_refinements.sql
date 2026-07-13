create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists settings_key_idx
  on public.settings(key);

drop trigger if exists set_settings_updated_at on public.settings;

create trigger set_settings_updated_at
before update on public.settings
for each row
execute function public.set_updated_at();

alter table public.settings enable row level security;

with ranked_leads as (
  select
    id,
    row_number() over (
      partition by session_id
      order by updated_at desc, created_at desc, id desc
    ) as row_rank
  from public.leads
)
delete from public.leads
where id in (
  select id
  from ranked_leads
  where row_rank > 1
);

drop index if exists leads_session_id_idx;

alter table public.leads
  drop constraint if exists leads_session_id_key;

alter table public.leads
  add constraint leads_session_id_key unique (session_id);
