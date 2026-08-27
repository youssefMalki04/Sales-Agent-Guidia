create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create table if not exists public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  secret text not null,
  events text[] not null default '{}',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid not null references public.webhook_endpoints(id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','delivered','failed')),
  response_code integer,
  response_body text,
  duration_ms integer,
  attempt_count integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists webhook_deliveries_endpoint_idx on public.webhook_deliveries(endpoint_id, created_at desc);
create index if not exists webhook_endpoints_enabled_idx on public.webhook_endpoints(enabled);
drop trigger if exists set_webhook_endpoints_updated_at on public.webhook_endpoints;
create trigger set_webhook_endpoints_updated_at before update on public.webhook_endpoints for each row execute function public.set_updated_at();
alter table public.webhook_endpoints enable row level security;
alter table public.webhook_deliveries enable row level security;
