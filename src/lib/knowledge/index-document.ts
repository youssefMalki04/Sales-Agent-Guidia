import { createHash } from "node:crypto";

import {
  generateDocumentEmbedding,
  toEmbeddingLiteral,
} from "@/lib/ai/embeddings";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

const TARGET_WORDS = 650;
const OVERLAP_WORDS = 90;

export type KnowledgeInput = {
  title: string;
  content: string;
  source: string;
  category?: string;
  language?: string;
};

function normalizeContent(content: string) {
  return content.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function splitContent(content: string) {
  const words = normalizeContent(content).match(/\S+/g) ?? [];
  const chunks: string[] = [];

  for (let start = 0; start < words.length; start += TARGET_WORDS - OVERLAP_WORDS) {
    chunks.push(words.slice(start, start + TARGET_WORDS).join(" "));
    if (start + TARGET_WORDS >= words.length) break;
  }

  return chunks;
}

export async function indexKnowledgeDocument(input: KnowledgeInput) {
  const content = normalizeContent(input.content);
  const chunks = splitContent(content);

  if (!input.title.trim() || content.length < 10 || chunks.length === 0) {
    throw new Error("The document title and content are required.");
  }

  const { data: document, error: documentError } = await supabaseAdmin
    .from("knowledge_documents")
    .insert({
      title: input.title.trim(),
      content,
      source: input.source,
      category: input.category?.trim() || "General",
      language: input.language ?? "fr",
    })
    .select("id,title,source,category,language,created_at")
    .single();

  if (documentError) throw new Error(documentError.message);

  try {
    const rows = [];
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const embedding = await generateDocumentEmbedding(chunk);
      rows.push({
        document_id: document.id,
        content: chunk,
        embedding: toEmbeddingLiteral(embedding),
        metadata: {
          source: input.source,
          title: input.title.trim(),
          category: input.category?.trim() || "General",
          language: input.language ?? "fr",
          chunkIndex: index,
          wordCount: chunk.split(/\s+/).length,
          contentHash: createHash("sha256").update(chunk).digest("hex"),
        },
      });
    }

    const { error } = await supabaseAdmin.from("knowledge_chunks").insert(rows);
    if (error) throw new Error(error.message);
  } catch (error) {
    await supabaseAdmin.from("knowledge_documents").delete().eq("id", document.id);
    throw error;
  }

  return { document, chunks: chunks.length };
}

export async function reindexKnowledgeDocument(documentId: string) {
  const { data, error } = await supabaseAdmin
    .from("knowledge_documents")
    .select("id,title,content,source,category,language")
    .eq("id", documentId)
    .single();

  if (error || !data) throw new Error(error?.message ?? "Document not found");

  const result = await indexKnowledgeDocument({
    title: data.title,
    content: data.content,
    source: data.source ?? "business-note",
    category: data.category ?? "General",
    language: data.language,
  });

  const { error: deleteError } = await supabaseAdmin
    .from("knowledge_documents")
    .delete()
    .eq("id", documentId);
  if (deleteError) throw new Error(deleteError.message);

  return result;
}
