"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  Loader2,
  MoreVertical,
  NotebookPen,
  RefreshCcw,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type {
  ClientKnowledgeDocument,
  KnowledgeDocument,
  NoteForm,
  Scope,
  SourceType,
  UrlForm,
} from "./knowledge-data";
import { initialNoteForm, initialUrlForm, templates } from "./knowledge-data";
import { BusinessNoteSheet, ImportUrlSheet } from "./knowledge-sheets";
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function KnowledgeBaseClient({
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  function reindexAll() {
    setBusy("reindex");
    window.setTimeout(() => {
      setBusy(null);
      showToast("All documents reindexed.");
    }, 1100);
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

  function createNote() {
    if (!noteForm.title.trim() || !noteForm.content.trim()) return;

    setBusy("create");
    window.setTimeout(() => {
      const now = new Date().toISOString();
      const newDocument: ClientKnowledgeDocument = {
        id: crypto.randomUUID(),
        title: noteForm.title.trim(),
        source: noteForm.sourceUrl.trim() || "business-note",
        category: noteForm.category || "General",
        language: "fr",
        created_at: now,
        chunks: Math.max(1, Math.ceil(noteForm.content.length / 700)),
        scope: noteForm.scope,
        active: true,
      };

      setDocuments((current) => [newDocument, ...current]);
      setNoteForm(initialNoteForm);
      setNoteOpen(false);
      setBusy(null);
      showToast("Document created.");
    }, 800);
  }

  function startCrawl() {
    if (!urlForm.startUrl.trim()) return;

    setBusy("crawl");
    window.setTimeout(() => {
      const now = new Date().toISOString();
      const newDocument: ClientKnowledgeDocument = {
        id: crypto.randomUUID(),
        title: getHostname(urlForm.startUrl) || "Imported documentation",
        source: urlForm.startUrl,
        category: urlForm.category || "Web documentation",
        language: "en",
        created_at: now,
        chunks: Math.max(1, Math.min(urlForm.maxPages, 12)),
        scope: urlForm.scope,
        active: true,
      };

      setDocuments((current) => [newDocument, ...current]);
      setUrlForm(initialUrlForm);
      setUrlOpen(false);
      setBusy(null);
      showToast("URL import started.");
    }, 1000);
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy("upload");
    window.setTimeout(() => {
      const now = new Date().toISOString();
      const newDocument: ClientKnowledgeDocument = {
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        source: file.name,
        category: "Uploaded file",
        language: "fr",
        created_at: now,
        chunks: Math.max(1, Math.ceil(file.size / 25000)),
        scope: "Support",
        active: true,
      };

      setDocuments((current) => [newDocument, ...current]);
      setBusy(null);
      event.target.value = "";
      showToast("File uploaded.");
    }, 900);
  }

  return (
    <>
      <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 sm:px-8 xl:px-14">
        <div className="soft-page-enter mx-auto max-w-[1180px]">
          <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
                <Sparkles className="size-3.5" /> Knowledge workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Knowledge base
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Give your agents reliable business context from notes, files and
                trusted web pages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:min-w-64">
              <KnowledgeMetric
                value={documents.length}
                label="Documents"
                icon={FileText}
              />
              <KnowledgeMetric
                value={documents.reduce(
                  (total, document) => total + document.chunks,
                  0,
                )}
                label="Chunks"
                icon={BookOpen}
              />
            </div>
          </header>

          <section className="mt-7 grid gap-3 sm:grid-cols-3">
            <ActionButton
              icon={NotebookPen}
              label="Create business note"
              description="Write structured knowledge"
              onClick={() => setNoteOpen(true)}
            />
            <ActionButton
              icon={Upload}
              label={busy === "upload" ? "Uploading..." : "Upload a file"}
              description="PDF, DOCX, TXT or CSV"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy === "upload"}
            />
            <ActionButton
              icon={Globe2}
              label="Import from URL"
              description="Crawl trusted documentation"
              onClick={() => setUrlOpen(true)}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.csv"
              onChange={handleFileUpload}
            />
          </section>

          <section className="soft-panel-enter mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
            <div className="grid gap-4 rounded-2xl border border-slate-100 bg-[#fafafd] p-4 lg:grid-cols-[52px_1.4fr_0.8fr_0.9fr_auto_auto] lg:items-end">
              <div className="flex size-11 items-center justify-center rounded-xl border border-[#e1e4f8] bg-[#f1f2ff] text-sm font-semibold text-[#5964d6]">
                {filteredDocuments.length}
              </div>

              <FilterField label="Search">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa2]" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by title, category, or tag..."
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10"
                  />
                </div>
              </FilterField>

              <FilterField label="Scope">
                <select
                  value={scopeFilter}
                  onChange={(event) =>
                    setScopeFilter(event.target.value as "all" | Scope)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
                >
                  <option value="all">All scopes</option>
                  <option value="Support">Support</option>
                  <option value="Demo">Demo</option>
                  <option value="Training">Training</option>
                  <option value="Pre-sales">Pre-sales</option>
                </select>
              </FilterField>

              <FilterField label="Source type">
                <select
                  value={sourceFilter}
                  onChange={(event) =>
                    setSourceFilter(event.target.value as SourceType)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
                >
                  <option value="all">All sources</option>
                  <option value="note">Business notes</option>
                  <option value="file">Uploaded files</option>
                  <option value="url">Imported URLs</option>
                </select>
              </FilterField>

              <Button
                variant="outline"
                onClick={reindexAll}
                disabled={busy === "reindex"}
                className="h-11 rounded-xl border-[#cfd3ed] bg-white px-5 text-[#5964d6] hover:bg-[#f5f6ff]"
              >
                {busy === "reindex" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCcw className="size-4" />
                )}
                Reindex all
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl border-slate-200 px-5"
              >
                Selection
                {selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
              </Button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse">
                  <thead>
                    <tr className="bg-[#fafafd] text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                      <th className="w-12 px-4 py-4">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={toggleAllVisible}
                        />
                      </th>
                      <th className="px-4 py-4">Title</th>
                      <th className="px-4 py-4">Scope</th>
                      <th className="px-4 py-4">Chunks</th>
                      <th className="px-4 py-4">Active</th>
                      <th className="px-4 py-4">Created</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <tr
                          key={document.id}
                          className="border-t border-[#ececef] text-sm"
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(document.id)}
                              onChange={() => toggleDocument(document.id)}
                            />
                          </td>
                          <td className="max-w-[340px] px-4 py-4 font-semibold text-[#303038]">
                            <p className="truncate">{document.title}</p>
                          </td>
                          <td className="px-4 py-4">
                            <ScopeBadge scope={document.scope} />
                          </td>
                          <td className="px-4 py-4 font-medium">
                            {document.chunks}
                          </td>
                          <td className="px-4 py-4">
                            <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                              Active
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-[#777780]">
                            {formatDate(document.created_at)}
                          </td>
                          <td className="px-4 py-4 text-[#686872]">
                            {document.category ?? "General"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center">
                          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#f1f2ff] text-[#5964d6]">
                            <BookOpen className="size-5" />
                          </span>
                          <p className="mt-4 font-semibold text-slate-900">
                            No documents found
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Create a note, upload a file or import your
                            documentation.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-4 border-t border-[#ececef] px-4 py-5 text-sm text-[#777780] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing 1–{filteredDocuments.length} of{" "}
                  {filteredDocuments.length}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="h-9 rounded-full bg-white px-4"
                  >
                    1 / 1
                  </Badge>
                  <Button variant="outline" disabled>
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button variant="outline" disabled>
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BusinessNoteSheet
        open={noteOpen}
        form={noteForm}
        busy={busy === "create"}
        onOpenChange={setNoteOpen}
        onFormChange={setNoteForm}
        onTemplateChange={applyTemplate}
        onCreate={createNote}
      />
      <ImportUrlSheet
        open={urlOpen}
        form={urlForm}
        busy={busy === "crawl"}
        onOpenChange={setUrlOpen}
        onFormChange={setUrlForm}
        onStart={startCrawl}
      />

      {toast ? (
        <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          <Check className="size-5" />
          {toast}
        </div>
      ) : null}
    </>
  );
}

function KnowledgeMetric({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafafd] px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[#5964d6]" />
        <p className="text-xl font-semibold text-slate-950">{value}</p>
      </div>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}
function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  disabled,
}: {
  icon: typeof NotebookPen;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="soft-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_6px_22px_rgba(15,23,42,0.04)] transition hover:border-[#cfd3ed] hover:bg-[#fafaff] disabled:opacity-50"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
        <Icon className="size-5" />
      </span>
      <span>
        <strong className="block text-sm text-slate-900">{label}</strong>
        <small className="mt-1 block text-xs text-slate-500">
          {description}
        </small>
      </span>
    </button>
  );
}
function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8a93]">
        {label}
      </span>
      {children}
    </label>
  );
}
function ScopeBadge({ scope }: { scope: Scope }) {
  const style = {
    Support: "border-cyan-200 bg-cyan-50 text-cyan-700",
    Demo: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Training: "border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]",
    "Pre-sales": "border-amber-200 bg-amber-50 text-amber-700",
  }[scope];
  return (
    <Badge variant="outline" className={cn("rounded-full", style)}>
      {scope}
    </Badge>
  );
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

export default function KnowledgeDashboardPage() {
  return (
    <KnowledgeBaseClient initialDocuments={[]} initialChunksByDocument={{}} />
  );
}
