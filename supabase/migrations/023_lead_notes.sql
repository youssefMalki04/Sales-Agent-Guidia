create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_name text not null default 'Leadia team',
  content text not null check (char_length(content) between 1 and 5000),
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_created_idx
  on public.lead_notes(lead_id, pinned desc, created_at desc);

alter table public.lead_notes enable row level security;
