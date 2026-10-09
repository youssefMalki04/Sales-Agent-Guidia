create table if not exists public.lead_note_attachments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.lead_notes(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz not null default now()
);

create index if not exists lead_note_attachments_note_idx
  on public.lead_note_attachments(note_id, created_at desc);

create index if not exists lead_note_attachments_lead_idx
  on public.lead_note_attachments(lead_id, created_at desc);

alter table public.lead_note_attachments enable row level security;

insert into storage.buckets (id, name, public, file_size_limit)
values ('lead-note-attachments', 'lead-note-attachments', false, 10485760)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;
