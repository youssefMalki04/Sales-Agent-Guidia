import { isIP } from "node:net";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import {
  indexKnowledgeDocument,
  reindexKnowledgeDocument,
} from "@/lib/knowledge/index-document";

export const runtime = "nodejs";

function errorResponse(error: unknown, status = 500) {
  return Response.json(
    { error: error instanceof Error ? error.message : "Unexpected error" },
    { status },
  );
}

export async function GET(request: Request) {
  const documentId = new URL(request.url).searchParams.get("id");

  if (documentId) {
    const [documentResult, chunksResult] = await Promise.all([
      supabaseAdmin
        .from("knowledge_documents")
        .select("id,title,content,source,category,language,created_at")
        .eq("id", documentId)
        .single(),
      supabaseAdmin
        .from("knowledge_chunks")
        .select("id,content,metadata,created_at")
        .eq("document_id", documentId)
        .order("created_at", { ascending: true }),
    ]);
    if (documentResult.error) return errorResponse(documentResult.error, 404);
    if (chunksResult.error) return errorResponse(chunksResult.error, 502);
    return Response.json({ document: documentResult.data, chunks: chunksResult.data ?? [] });
  }

  const [documentsResult, chunksResult] = await Promise.all([
    supabaseAdmin
      .from("knowledge_documents")
      .select("id,title,source,category,language,created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("knowledge_chunks").select("document_id"),
  ]);

  if (documentsResult.error) return errorResponse(documentsResult.error, 502);
  if (chunksResult.error) return errorResponse(chunksResult.error, 502);

  const counts: Record<string, number> = {};
  for (const chunk of chunksResult.data ?? []) {
    if (chunk.document_id) counts[chunk.document_id] = (counts[chunk.document_id] ?? 0) + 1;
  }

  return Response.json({ documents: documentsResult.data ?? [], chunkCounts: counts });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      title?: string;
      content?: string;
      category?: string;
      source?: string;
      language?: string;
    };
    if (!body.id) return errorResponse(new Error("Missing document id"), 400);

    const result = await indexKnowledgeDocument({
      title: body.title ?? "",
      content: body.content ?? "",
      category: body.category ?? "General",
      source: body.source ?? "business-note",
      language: body.language ?? "fr",
    });

    const { error } = await supabaseAdmin
      .from("knowledge_documents")
      .delete()
      .eq("id", body.id);
    if (error) {
      await supabaseAdmin
        .from("knowledge_documents")
        .delete()
        .eq("id", result.document.id);
      throw new Error(error.message);
    }

    return Response.json(result);
  } catch (error) {
    return errorResponse(error, 502);
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return errorResponse(new Error("Missing file"), 400);
      if (file.size > 2_000_000) return errorResponse(new Error("File is larger than 2 MB"), 413);

      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !["txt", "md", "csv"].includes(extension)) {
        return errorResponse(new Error("Only TXT, MD and CSV files are supported"), 415);
      }

      const result = await indexKnowledgeDocument({
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: await file.text(),
        source: file.name,
        category: "Uploaded file",
      });
      return Response.json(result, { status: 201 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const type = body.type === "url" ? "url" : "note";
    let content = String(body.content ?? "").trim();
    let title = String(body.title ?? "").trim();
    let source = String(body.source ?? "business-note").trim();

    if (type === "url") {
      const url = new URL(String(body.url ?? ""));
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return errorResponse(new Error("Only HTTP and HTTPS URLs are accepted"), 400);
      }
      const host = url.hostname.toLowerCase();
      const privateIp = isIP(host) > 0 && /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
      if (host === "localhost" || host.endsWith(".local") || privateIp) {
        return errorResponse(new Error("Private URLs are not accepted"), 400);
      }

      const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
      if (!response.ok) throw new Error(`The URL returned HTTP ${response.status}`);
      const html = await response.text();
      content = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
      title = title || url.hostname;
      source = url.toString();
    }

    const result = await indexKnowledgeDocument({
      title,
      content,
      source,
      category: String(body.category ?? "General"),
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error, 502);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; all?: boolean };
    const ids = body.all
      ? ((await supabaseAdmin.from("knowledge_documents").select("id")).data ?? []).map(
          (item) => item.id,
        )
      : body.id
        ? [body.id]
        : [];
    if (ids.length === 0) return errorResponse(new Error("No document selected"), 400);

    for (const id of ids) await reindexKnowledgeDocument(id);
    return Response.json({ reindexed: ids.length });
  } catch (error) {
    return errorResponse(error, 502);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return errorResponse(new Error("Missing document id"), 400);
  const { error } = await supabaseAdmin.from("knowledge_documents").delete().eq("id", id);
  if (error) return errorResponse(error, 502);
  return Response.json({ deleted: id });
}
