-- Historical notes remain unlinked: titles and dates are not unique identifiers.
alter table public.lead_notes
  add column if not exists meeting_id uuid references public.meetings(id) on delete set null;

create index if not exists lead_notes_meeting_created_idx
  on public.lead_notes(meeting_id, created_at desc)
  where meeting_id is not null;

notify pgrst, 'reload schema';
