create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  session_id text,
  title text not null default 'Product demonstration',
  prospect text not null,
  company text,
  email text,
  owner text not null default 'Yosra',
  scheduled_date date not null,
  scheduled_time time not null,
  duration integer not null default 30 check (duration in (15, 30, 45, 60)),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  source text not null default 'AI Widget',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meetings_date_idx on public.meetings(scheduled_date, scheduled_time);
create index if not exists meetings_lead_id_idx on public.meetings(lead_id);
create index if not exists meetings_session_id_idx on public.meetings(session_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_meetings_updated_at on public.meetings;
create trigger set_meetings_updated_at
before update on public.meetings
for each row execute function public.set_updated_at();

alter table public.meetings enable row level security;
