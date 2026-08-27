alter table public.conversations
  add column if not exists author_type text
    check (author_type in ('visitor', 'ai', 'agent', 'system'));

update public.conversations
set author_type = case
  when role = 'user' then 'visitor'
  when role = 'assistant' then 'ai'
  else 'system'
end
where author_type is null;

create table if not exists public.conversation_sessions (
  session_id text primary key,
  lead_id uuid references public.leads(id) on delete set null,
  mode text not null default 'ai'
    check (mode in ('ai', 'human', 'waiting', 'resolved')),
  owner text,
  updated_at timestamptz not null default now()
);

insert into public.conversation_sessions (session_id, lead_id)
select conversation.session_id, max(conversation.lead_id::text)::uuid
from public.conversations as conversation
group by conversation.session_id
on conflict (session_id) do nothing;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists set_conversation_sessions_updated_at on public.conversation_sessions;
create trigger set_conversation_sessions_updated_at
before update on public.conversation_sessions
for each row execute function public.set_updated_at();

alter table public.conversation_sessions enable row level security;
