export type KnowledgeDocument = {
  id: string;
  title: string;
  source: string | null;
  category: string | null;
  language: string;
  created_at: string;
  content?: string;
};

export type KnowledgeDocumentDetails = KnowledgeDocument & {
  content: string;
};

export type KnowledgeChunk = {
  document_id: string | null;
};
