create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null default 'demo-org',
  name text not null,
  email text not null,
  role text not null default 'sales'
    check (role in ('admin', 'manager', 'sales')),
  status text not null default 'pending'
    check (status in ('active', 'pending', 'disabled')),
  active_leads integer not null default 0,
  meetings integer not null default 0,
  conversion integer not null default 0,
  capacity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_org_idx
  on public.team_members (organization_id);

create index if not exists team_members_email_idx
  on public.team_members (email);

create or replace function public.set_team_members_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_team_members_updated_at on public.team_members;

create trigger set_team_members_updated_at
before update on public.team_members
for each row
execute function public.set_team_members_updated_at();

alter table public.team_members enable row level security;

create policy "team members are readable within organization"
on public.team_members
for select
to authenticated
using (organization_id = current_setting('request.jwt.claims', true)::jsonb ->> 'organization_id');

create policy "team members can be upserted within organization"
on public.team_members
for insert
to authenticated
with check (organization_id = current_setting('request.jwt.claims', true)::jsonb ->> 'organization_id');

create policy "team members can be updated within organization"
on public.team_members
for update
to authenticated
using (organization_id = current_setting('request.jwt.claims', true)::jsonb ->> 'organization_id')
with check (organization_id = current_setting('request.jwt.claims', true)::jsonb ->> 'organization_id');

create policy "team members can be deleted within organization"
on public.team_members
for delete
to authenticated
using (organization_id = current_setting('request.jwt.claims', true)::jsonb ->> 'organization_id');
