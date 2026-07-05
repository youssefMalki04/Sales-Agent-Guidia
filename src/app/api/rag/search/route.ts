import { generateQueryEmbedding, toEmbeddingLiteral } from "@/lib/ai/embeddings";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

type RagSearchRequestBody = {
  query?: string;
  matchCount?: number;
  matchThreshold?: number;
};

type KnowledgeMatch = {
  id: string;
  document_id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
  source: string | null;
  title: string | null;
  category: string | null;
};

function normalizeMatchCount(matchCount: unknown) {
  if (typeof matchCount !== "number" || !Number.isFinite(matchCount)) {
    return 5;
  }

  return Math.min(Math.max(Math.trunc(matchCount), 1), 10);
}

function normalizeMatchThreshold(matchThreshold: unknown) {
  if (typeof matchThreshold !== "number" || !Number.isFinite(matchThreshold)) {
    return -1;
  }

  return Math.min(Math.max(matchThreshold, -1), 1);
}

export async function POST(request: Request) {
  let body: RagSearchRequestBody;

  try {
    body = (await request.json()) as RagSearchRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body.query?.trim();

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const matchCount = normalizeMatchCount(body.matchCount);
  const matchThreshold = normalizeMatchThreshold(body.matchThreshold);
  let queryEmbedding: number[];

  try {
    queryEmbedding = await generateQueryEmbedding(query);
  } catch (error) {
    return Response.json(
      {
        error: "Embedding generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }

  const { data, error } = await supabaseAdmin.rpc("match_knowledge_chunks", {
    query_embedding: toEmbeddingLiteral(queryEmbedding),
    match_count: matchCount,
    match_threshold: matchThreshold,
  });

  if (error) {
    return Response.json(
      {
        error: "RAG search failed",
        details: error.message,
      },
      { status: 502 },
    );
  }

  return Response.json({
    query,
    matchCount,
    matchThreshold,
    matches: (data ?? []) as KnowledgeMatch[],
  });
}
