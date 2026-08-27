create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  description text not null default '',
  requester_name text not null default 'Visitor',
  requester_email text,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to text,
  lead_id uuid references public.leads(id) on delete set null,
  session_id text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_notes (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  author text not null default 'Support team',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists tickets_status_idx on public.tickets(status);
create index if not exists tickets_priority_idx on public.tickets(priority);
create index if not exists tickets_lead_id_idx on public.tickets(lead_id);
create index if not exists tickets_session_id_idx on public.tickets(session_id);
create index if not exists ticket_notes_ticket_id_idx on public.ticket_notes(ticket_id, created_at);

drop trigger if exists set_tickets_updated_at on public.tickets;
create trigger set_tickets_updated_at before update on public.tickets
for each row execute function public.set_updated_at();

alter table public.tickets enable row level security;
alter table public.ticket_notes enable row level security;
