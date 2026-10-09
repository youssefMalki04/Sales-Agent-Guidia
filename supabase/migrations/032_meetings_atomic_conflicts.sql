-- Run after reviewing existing overlaps. This migration intentionally fails
-- instead of deleting or moving conflicting appointments.
begin;
create extension if not exists btree_gist;
alter table public.meetings add constraint meetings_no_owner_overlap
exclude using gist (
  (lower(btrim(owner))) with =,
  (tsrange(scheduled_date + scheduled_time,
    scheduled_date + scheduled_time + duration * interval '1 minute', '[)')) with &&
) where (status in ('pending','confirmed') and archived_at is null);
commit;
