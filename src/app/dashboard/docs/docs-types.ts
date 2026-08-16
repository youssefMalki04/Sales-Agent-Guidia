export type KnowledgeDocument = {
  id: string;
  title: string;
  source: string | null;
  category: string | null;
  language: string;
  created_at: string;
};

export type KnowledgeChunk = {
  document_id: string | null;
};
