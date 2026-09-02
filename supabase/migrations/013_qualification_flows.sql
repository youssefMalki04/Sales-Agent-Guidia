create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create table if not exists public.qualification_flows (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text not null default '',
  business_goal text not null default '',
  tags text[] not null default '{}',
  safety_mode text not null default 'guide' check (safety_mode in ('guide','confirm','auto')),
  active boolean not null default true,
  entry_page_ids text[] not null default '{}',
  steps jsonb not null default '[]'::jsonb,
  scoring jsonb not null default '{"coldMax":39,"warmMax":69}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_qualification_flows_updated_at on public.qualification_flows;
create trigger set_qualification_flows_updated_at before update on public.qualification_flows
for each row execute function public.set_updated_at();

alter table public.qualification_flows enable row level security;

insert into public.qualification_flows
  (key, title, description, business_goal, tags, safety_mode, active, steps, scoring)
values (
  'leadia-sales-qualification',
  'Leadia sales qualification',
  'Collect the minimum commercial context required for a useful sales handoff.',
  'Identify the need, company, budget, timeline and contact details, then propose the right next step.',
  array['sales','qualification','leadia'],
  'guide', true,
  '[
    {"id":"need","title":"What problem would you like to solve?","field":"need","required":true,"weight":25},
    {"id":"company","title":"What is your company and business sector?","field":"company","required":false,"weight":15},
    {"id":"budget","title":"Do you have an estimated budget?","field":"budget","required":false,"weight":15},
    {"id":"urgency","title":"When would you like to start?","field":"urgency","required":false,"weight":15},
    {"id":"contact","title":"What email can the sales team use to contact you?","field":"email","required":true,"weight":20},
    {"id":"intent","title":"Would you like to book a demonstration?","field":"intent","required":false,"weight":10}
  ]'::jsonb,
  '{"coldMax":39,"warmMax":69}'::jsonb
) on conflict (key) do nothing;
