create table if not exists public.sales_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  base_url text,
  allowed_domains text not null default '*',
  active boolean not null default true,
  token text not null default encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sales_agents_slug_idx
  on public.sales_agents(slug);

drop trigger if exists set_sales_agents_updated_at on public.sales_agents;

create trigger set_sales_agents_updated_at
before update on public.sales_agents
for each row
execute function public.set_updated_at();

alter table public.sales_agents enable row level security;

create policy "public read active agents"
on public.sales_agents
for select
to anon
using (active = true);