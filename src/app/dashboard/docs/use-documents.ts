"use client";

import { useEffect, useMemo, useState } from "react";
import type { KnowledgeDocument, KnowledgeDocumentDetails } from "./docs-types";

type DocsPayload = {
  documents?: KnowledgeDocument[];
  chunkCounts?: Record<string, number>;
  error?: string;
};

export function useDocuments() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [chunkCounts, setChunkCounts] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<KnowledgeDocumentDetails | null>(
    null,
  );

  async function loadDocuments() {
    setError(null);
    const response = await fetch("/api/knowledge", { cache: "no-store" });
    const payload = (await response.json()) as DocsPayload;
    if (!response.ok)
      throw new Error(payload.error ?? "Unable to load documents");
    setDocuments(payload.documents ?? []);
    setChunkCounts(payload.chunkCounts ?? {});
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDocuments()
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load documents",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () =>
      [
        ...new Set(documents.map((item) => item.category).filter(Boolean)),
      ] as string[],
    [documents],
  );

  const filteredDocuments = useMemo(() => {
    const value = query.trim().toLowerCase();
    return documents.filter(
      (document) =>
        (!value ||
          document.title.toLowerCase().includes(value) ||
          (document.source ?? "").toLowerCase().includes(value) ||
          (document.category ?? "").toLowerCase().includes(value)) &&
        (category === "all" || document.category === category),
    );
  }, [category, documents, query]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function getDocument(id: string) {
    const response = await fetch(
      `/api/knowledge?id=${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as {
      document?: KnowledgeDocumentDetails;
      error?: string;
    };
    if (!response.ok || !payload.document)
      throw new Error(payload.error ?? "Unable to open document");
    return payload.document;
  }

  async function openDocument(id: string) {
    setEditorOpen(true);
    setEditorLoading(true);
    setSelected(null);
    try {
      setSelected(await getDocument(id));
    } catch (reason) {
      setEditorOpen(false);
      showToast(
        reason instanceof Error ? reason.message : "Unable to open document",
      );
    } finally {
      setEditorLoading(false);
    }
  }

  async function saveDocument() {
    if (!selected?.title.trim() || selected.content.trim().length < 10) return;
    setSaving(true);
    try {
      const response = await fetch("/api/knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to save document");
      await loadDocuments();
      setEditorOpen(false);
      showToast("Document saved and reindexed.");
    } catch (reason) {
      showToast(
        reason instanceof Error ? reason.message : "Unable to save document",
      );
    } finally {
      setSaving(false);
    }
  }

  async function downloadDocument(document: KnowledgeDocument) {
    try {
      const details = await getDocument(document.id);
      const url = URL.createObjectURL(
        new Blob([details.content], { type: "text/markdown;charset=utf-8" }),
      );
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = `${details.title.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.md`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Download failed");
    }
  }

  async function deleteDocument(id: string) {
    if (!window.confirm("Delete this document and all its indexed chunks?"))
      return;
    const response = await fetch(
      `/api/knowledge?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) return showToast(payload.error ?? "Deletion failed");
    await loadDocuments();
    showToast("Document deleted.");
  }

  return {
    documents,
    chunkCounts,
    query,
    setQuery,
    category,
    setCategory,
    loading,
    error,
    toast,
    editorOpen,
    setEditorOpen,
    editorLoading,
    saving,
    selected,
    setSelected,
    categories,
    filteredDocuments,
    loadDocuments,
    openDocument,
    saveDocument,
    downloadDocument,
    deleteDocument,
  };
}
