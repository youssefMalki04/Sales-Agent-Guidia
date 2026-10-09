create table if not exists public.lead_note_summaries (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  overview text not null,
  key_points jsonb not null default '[]'::jsonb,
  next_actions jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  mentioned_people jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  source text not null default 'ai' check (source in ('ai', 'fallback')),
  created_by text not null default 'Yosra Gadhgadhi',
  created_at timestamptz not null default now()
);

create index if not exists lead_note_summaries_lead_created_idx
  on public.lead_note_summaries(lead_id, created_at desc);

alter table public.lead_note_summaries enable row level security;
