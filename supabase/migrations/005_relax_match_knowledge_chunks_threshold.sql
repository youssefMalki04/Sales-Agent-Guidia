create or replace function public.match_knowledge_chunks(
  query_embedding extensions.vector(768),
  match_count integer default 5,
  match_threshold double precision default -1
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity double precision,
  source text,
  title text,
  category text
)
language sql
stable
as $$
  select
    kc.id,
    kc.document_id,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) as similarity,
    kd.source,
    kd.title,
    kd.category
  from public.knowledge_chunks kc
  left join public.knowledge_documents kd on kd.id = kc.document_id
  where kc.embedding is not null
    and (
      match_threshold < 0
      or (1 - (kc.embedding <=> query_embedding)) >= match_threshold
    )
  order by kc.embedding <=> query_embedding
  limit greatest(1, least(match_count, 20));
$$;
