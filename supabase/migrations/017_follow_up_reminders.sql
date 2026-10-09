create table if not exists public.follow_up_reminders (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  title text not null,
  notes text,
  due_at timestamptz not null,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists follow_up_reminders_lead_due_idx
  on public.follow_up_reminders(lead_id, due_at desc);

drop trigger if exists set_follow_up_reminders_updated_at
  on public.follow_up_reminders;
create trigger set_follow_up_reminders_updated_at
before update on public.follow_up_reminders
for each row execute function public.set_updated_at();

alter table public.follow_up_reminders enable row level security;
