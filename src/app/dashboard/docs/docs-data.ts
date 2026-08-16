import { supabaseAdmin } from "@/lib/database/supabase-admin";

import type { KnowledgeChunk, KnowledgeDocument } from "./docs-types";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function getDocs() {
  if (process.env.ENABLE_SUPABASE_DASHBOARD !== "true") {
    return {
      documents: [] as KnowledgeDocument[],
      chunksByDocument: new Map<string, number>(),
    };
  }

  try {
    const [documentsResult, chunksResult] = await Promise.all([
      supabaseAdmin
        .from("knowledge_documents")
        .select("id,title,source,category,language,created_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("knowledge_chunks").select("document_id"),
    ]);

    if (documentsResult.error || chunksResult.error) {
      console.error(
        "Documents fetch failed",
        documentsResult.error?.message ?? chunksResult.error?.message,
      );
      return {
        documents: [] as KnowledgeDocument[],
        chunksByDocument: new Map<string, number>(),
      };
    }

    const documents = (documentsResult.data ?? []) as KnowledgeDocument[];
    const chunks = (chunksResult.data ?? []) as KnowledgeChunk[];
    const chunksByDocument = new Map<string, number>();

    for (const chunk of chunks) {
      if (!chunk.document_id) continue;
      chunksByDocument.set(
        chunk.document_id,
        (chunksByDocument.get(chunk.document_id) ?? 0) + 1,
      );
    }

    return { documents, chunksByDocument };
  } catch (error) {
    console.error(
      "Documents fetch failed",
      error instanceof Error ? error.message : "Unknown Supabase error",
    );
    return {
      documents: [] as KnowledgeDocument[],
      chunksByDocument: new Map<string, number>(),
    };
  }
}
