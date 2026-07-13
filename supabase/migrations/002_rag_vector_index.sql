create extension if not exists vector with schema extensions;

create index if not exists knowledge_chunks_embedding_ivfflat_idx
  on public.knowledge_chunks
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100)
  where embedding is not null;
