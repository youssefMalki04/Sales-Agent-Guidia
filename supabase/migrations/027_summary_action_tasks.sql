alter table public.follow_up_reminders
  add column if not exists source_summary_id uuid
    references public.lead_note_summaries(id) on delete set null,
  add column if not exists source_action text;

create unique index if not exists follow_up_summary_action_unique_idx
  on public.follow_up_reminders(source_summary_id, source_action)
  where source_summary_id is not null and source_action is not null;

create index if not exists follow_up_summary_action_lookup_idx
  on public.follow_up_reminders(lead_id, source_summary_id);
