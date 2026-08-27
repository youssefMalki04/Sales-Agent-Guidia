alter table public.leads
  add column if not exists pipeline_stage text not null default 'new'
    check (pipeline_stage in ('new', 'qualified', 'meeting', 'proposal', 'won', 'lost')),
  add column if not exists deal_value numeric(12, 2) not null default 0
    check (deal_value >= 0),
  add column if not exists owner text not null default 'Yosra',
  add column if not exists due_date date;

update public.leads
set pipeline_stage = case
  when crm_status = 'sent' then 'won'
  when crm_status = 'failed' then 'lost'
  when conversion_score >= 70 or lead_temperature = 'hot' then 'qualified'
  else 'new'
end
where pipeline_stage = 'new';

update public.leads as lead
set pipeline_stage = 'meeting'
where exists (
  select 1 from public.meetings as meeting
  where meeting.lead_id = lead.id
    and meeting.status in ('pending', 'confirmed')
);

create index if not exists leads_pipeline_stage_idx on public.leads(pipeline_stage);
