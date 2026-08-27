"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";

import type {
  ClientKnowledgeDocument,
  KnowledgeDocument,
  NoteForm,
  Scope,
  SourceType,
  UrlForm,
} from "./knowledge-data";
import { initialNoteForm, initialUrlForm, templates } from "./knowledge-data";
import type { KnowledgeSearchResult } from "./knowledge-panels";

export function useKnowledgeBase({
  initialDocuments,
  initialChunksByDocument,
}: {
  initialDocuments: KnowledgeDocument[];
  initialChunksByDocument: Record<string, number>;
}) {
  const [documents, setDocuments] = useState<ClientKnowledgeDocument[]>(
    initialDocuments.map((document) => ({
      ...document,
      chunks: initialChunksByDocument[document.id] ?? 0,
      scope: inferScope(document.category),
      active: true,
    })),
  );

  const [query, setQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"all" | Scope>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceType>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [noteForm, setNoteForm] = useState<NoteForm>(initialNoteForm);
  const [urlForm, setUrlForm] = useState<UrlForm>(initialUrlForm);
  const [busy, setBusy] = useState<
    "reindex" | "create" | "crawl" | "upload" | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);
  const [testQuery, setTestQuery] = useState("");
  const [testResults, setTestResults] = useState<KnowledgeSearchResult[]>([]);
  const [testingSearch, setTestingSearch] = useState(false);
  async function refreshDocuments() {
    const response = await fetch("/api/knowledge", { cache: "no-store" });
    const payload = (await response.json()) as {
      documents?: KnowledgeDocument[];
      chunkCounts?: Record<string, number>;
      error?: string;
    };
    if (!response.ok)
      throw new Error(payload.error ?? "Unable to load documents");

    setDocuments(
      (payload.documents ?? []).map((document) => ({
        ...document,
        chunks: payload.chunkCounts?.[document.id] ?? 0,
        scope: inferScope(document.category),
        active: true,
      })),
    );
  }

  useEffect(() => {
    // Loading from the external knowledge API is the synchronization performed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshDocuments().catch((error) =>
      showToast(
        error instanceof Error ? error.message : "Unable to load documents",
      ),
    );
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        !normalized ||
        document.title.toLowerCase().includes(normalized) ||
        (document.category ?? "").toLowerCase().includes(normalized) ||
        (document.source ?? "").toLowerCase().includes(normalized);

      const matchesScope =
        scopeFilter === "all" || document.scope === scopeFilter;
      const detectedSource = detectSourceType(document.source);
      const matchesSource =
        sourceFilter === "all" || detectedSource === sourceFilter;

      return matchesSearch && matchesScope && matchesSource;
    });
  }, [documents, query, scopeFilter, sourceFilter]);

  const allVisibleSelected =
    filteredDocuments.length > 0 &&
    filteredDocuments.every((document) => selectedIds.includes(document.id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      const visibleIds = new Set(
        filteredDocuments.map((document) => document.id),
      );
      setSelectedIds((current) => current.filter((id) => !visibleIds.has(id)));
      return;
    }

    setSelectedIds((current) => [
      ...new Set([
        ...current,
        ...filteredDocuments.map((document) => document.id),
      ]),
    ]);
  }

  function toggleDocument(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((currentId) => currentId !== id)
        : [...current, id],
    );
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function reindexAll() {
    setBusy("reindex");
    try {
      const response = await fetch("/api/knowledge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Reindexing failed");
      await refreshDocuments();
      showToast("All documents reindexed.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Reindexing failed");
    } finally {
      setBusy(null);
    }
  }

  function applyTemplate(templateId: string) {
    const template = templates.find((item) => item.id === templateId);
    if (!template) {
      setNoteForm((current) => ({ ...current, template: "" }));
      return;
    }

    setNoteForm((current) => ({
      ...current,
      mode: "template",
      template: template.id,
      title: template.title,
      content: template.content,
      scope: template.scope,
      category: template.category,
      tags: template.tags,
    }));
  }

  async function createNote() {
    if (!noteForm.title.trim() || !noteForm.content.trim()) return;

    setBusy("create");
    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "note",
          title: noteForm.title,
          content: noteForm.content,
          source: noteForm.sourceUrl || "business-note",
          category: noteForm.category,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error ?? "Document creation failed");
      await refreshDocuments();
      setNoteForm(initialNoteForm);
      setNoteOpen(false);
      showToast("Document created.");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Document creation failed",
      );
    } finally {
      setBusy(null);
    }
  }

  async function startCrawl() {
    if (!urlForm.startUrl.trim()) return;

    setBusy("crawl");
    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "url",
          url: urlForm.startUrl,
          title: getHostname(urlForm.startUrl),
          category: urlForm.category || "Web documentation",
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "URL import failed");
      await refreshDocuments();
      setUrlForm(initialUrlForm);
      setUrlOpen(false);
      showToast("Web page imported and indexed.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "URL import failed");
    } finally {
      setBusy(null);
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy("upload");
    event.target.value = "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/knowledge", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "File upload failed");
      await refreshDocuments();
      showToast("File uploaded and indexed.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "File upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function reindexDocument(id: string) {
    setBusy("reindex");
    try {
      const response = await fetch("/api/knowledge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Reindexing failed");
      await refreshDocuments();
      showToast("Document reindexed.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Reindexing failed");
    } finally {
      setBusy(null);
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
    if (!response.ok) {
      showToast(payload.error ?? "Deletion failed");
      return;
    }
    setSelectedIds((current) => current.filter((item) => item !== id));
    await refreshDocuments();
    showToast("Document deleted.");
  }

  async function testKnowledgeSearch() {
    if (!testQuery.trim()) return;
    setTestingSearch(true);
    try {
      const response = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: testQuery,
          matchCount: 3,
          matchThreshold: -1,
        }),
      });
      const payload = (await response.json()) as {
        matches?: Array<{
          id: string;
          content: string;
          similarity: number;
          title: string | null;
        }>;
        error?: string;
        details?: string;
      };
      if (!response.ok)
        throw new Error(payload.details ?? payload.error ?? "Search failed");
      setTestResults(payload.matches ?? []);
    } catch (error) {
      setTestResults([]);
      showToast(error instanceof Error ? error.message : "Search failed");
    } finally {
      setTestingSearch(false);
    }
  }

  return {
    allVisibleSelected,
    applyTemplate,
    busy,
    createNote,
    deleteDocument,
    documents,
    filteredDocuments,
    handleFileUpload,
    noteForm,
    noteOpen,
    query,
    reindexAll,
    reindexDocument,
    scopeFilter,
    selectedIds,
    setNoteForm,
    setNoteOpen,
    setQuery,
    setScopeFilter,
    setSourceFilter,
    setTestQuery,
    setUrlForm,
    setUrlOpen,
    sourceFilter,
    startCrawl,
    testKnowledgeSearch,
    testQuery,
    testResults,
    testingSearch,
    toast,
    toggleAllVisible,
    toggleDocument,
    urlForm,
    urlOpen,
  };
}

function inferScope(category: string | null): Scope {
  const normalized = (category ?? "").toLowerCase();
  if (normalized.includes("sales") || normalized.includes("demo"))
    return "Demo";
  if (normalized.includes("training") || normalized.includes("journey"))
    return "Training";
  if (normalized.includes("pre-sales")) return "Pre-sales";
  return "Support";
}
function detectSourceType(source: string | null): Exclude<SourceType, "all"> {
  const normalized = (source ?? "").toLowerCase();
  if (normalized.startsWith("http://") || normalized.startsWith("https://"))
    return "url";
  if (
    [".pdf", ".doc", ".docx", ".txt", ".md", ".csv"].some((ext) =>
      normalized.endsWith(ext),
    )
  )
    return "file";
  return "note";
}
function getHostname(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}
