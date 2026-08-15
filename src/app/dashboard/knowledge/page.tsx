// import Link from "next/link";
// import { BookOpen, Database, FileText, Layers3 } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { supabaseAdmin } from "@/lib/database/supabase-admin";

// type KnowledgeDocument = {
//   id: string;
//   title: string;
//   source: string | null;
//   category: string | null;
//   language: string;
//   created_at: string;
// };

// type KnowledgeChunk = {
//   document_id: string | null;
//   created_at: string;
// };

// function formatDate(value: string) {
//   return new Intl.DateTimeFormat("fr-FR", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(value));
// }

// async function getKnowledgeOverview() {
//   const [documentsResult, chunksResult] = await Promise.all([
//     supabaseAdmin
//       .from("knowledge_documents")
//       .select("id,title,source,category,language,created_at")
//       .order("created_at", { ascending: false }),
//     supabaseAdmin
//       .from("knowledge_chunks")
//       .select("document_id,created_at")
//       .order("created_at", { ascending: false }),
//   ]);

//   if (documentsResult.error) {
//     throw new Error(documentsResult.error.message);
//   }

//   if (chunksResult.error) {
//     throw new Error(chunksResult.error.message);
//   }

//   const documents = (documentsResult.data ?? []) as KnowledgeDocument[];
//   const chunks = (chunksResult.data ?? []) as KnowledgeChunk[];
//   const chunksByDocument = new Map<string, number>();

//   for (const chunk of chunks) {
//     if (!chunk.document_id) {
//       continue;
//     }

//     chunksByDocument.set(
//       chunk.document_id,
//       (chunksByDocument.get(chunk.document_id) ?? 0) + 1,
//     );
//   }

//   const categories = new Set(
//     documents.map((document) => document.category).filter(Boolean),
//   );

//   return {
//     documents,
//     chunks,
//     categories,
//     chunksByDocument,
//   };
// }

// export default async function KnowledgeDashboardPage() {
//   const { documents, chunks, categories, chunksByDocument } =
//     await getKnowledgeOverview();

//   return (
//     <div className="bg-[#fbfbfc] px-5 py-8 text-[#171717] sm:px-8 xl:px-14">
//       <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
//         <div className="flex flex-col gap-4 border-b border-[#e6e6eb] pb-6 lg:flex-row lg:items-end lg:justify-between">
//           <div>
//             <Link
//               href="/"
//               className="text-sm font-semibold text-[#686872] hover:text-[#171717]"
//             >
//               Workspace
//             </Link>
//             <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#171717]">
//               Knowledge base
//             </h1>
//             <p className="mt-2 max-w-2xl text-sm leading-6 text-[#686872]">
//               Vue de controle des documents Guidia indexes dans Supabase pour
//               alimenter la recherche RAG.
//             </p>
//           </div>

//           <Badge
//             variant="outline"
//             className="h-8 rounded-md border-[#d9d9df] bg-white px-3 text-[#50505a]"
//           >
//             RAG Supabase Vector
//           </Badge>
//         </div>

//         <section className="grid gap-3 md:grid-cols-3">
//           <div className="rounded-lg border border-[#e3e3e8] bg-white p-4">
//             <div className="flex items-center gap-3">
//               <FileText className="size-5 text-[#4f46e5]" />
//               <p className="text-sm font-semibold text-[#686872]">Documents</p>
//             </div>
//             <p className="mt-4 text-3xl font-semibold text-[#171717]">
//               {documents.length}
//             </p>
//           </div>

//           <div className="rounded-lg border border-[#e3e3e8] bg-white p-4">
//             <div className="flex items-center gap-3">
//               <Layers3 className="size-5 text-[#0f766e]" />
//               <p className="text-sm font-semibold text-[#686872]">Chunks</p>
//             </div>
//             <p className="mt-4 text-3xl font-semibold text-[#171717]">
//               {chunks.length}
//             </p>
//           </div>

//           <div className="rounded-lg border border-[#e3e3e8] bg-white p-4">
//             <div className="flex items-center gap-3">
//               <Database className="size-5 text-[#b45309]" />
//               <p className="text-sm font-semibold text-[#686872]">
//                 Categories
//               </p>
//             </div>
//             <p className="mt-4 text-3xl font-semibold text-[#171717]">
//               {categories.size}
//             </p>
//           </div>
//         </section>

//         <section className="rounded-lg border border-[#e3e3e8] bg-white">
//           <div className="flex items-center justify-between border-b border-[#eeeef1] px-4 py-4">
//             <div className="flex items-center gap-3">
//               <BookOpen className="size-5 text-[#50505a]" />
//               <h2 className="text-base font-semibold text-[#202026]">
//                 Documents indexes
//               </h2>
//             </div>
//             <p className="text-sm font-medium text-[#777780]">
//               {chunks.length} chunks disponibles
//             </p>
//           </div>

//           {documents.length ? (
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
//                   <TableHead className="px-4 text-xs uppercase tracking-normal text-[#777780]">
//                     Document
//                   </TableHead>
//                   <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
//                     Categorie
//                   </TableHead>
//                   <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
//                     Langue
//                   </TableHead>
//                   <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
//                     Chunks
//                   </TableHead>
//                   <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
//                     Ajoute
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {documents.map((document) => (
//                   <TableRow key={document.id}>
//                     <TableCell className="max-w-[420px] px-4">
//                       <p className="truncate font-semibold text-[#202026]">
//                         {document.title}
//                       </p>
//                       <p className="mt-1 truncate text-xs text-[#777780]">
//                         {document.source ?? "Source non renseignee"}
//                       </p>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant="outline"
//                         className="rounded-md border-[#d9d9df] bg-[#fbfbfc] text-[#50505a]"
//                       >
//                         {document.category ?? "general"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="font-medium uppercase text-[#50505a]">
//                       {document.language}
//                     </TableCell>
//                     <TableCell className="font-semibold text-[#202026]">
//                       {chunksByDocument.get(document.id) ?? 0}
//                     </TableCell>
//                     <TableCell className="text-[#686872]">
//                       {formatDate(document.created_at)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="px-4 py-12 text-center">
//               <p className="text-sm font-semibold text-[#202026]">
//                 Aucun document indexe
//               </p>
//               <p className="mt-2 text-sm text-[#777780]">
//                 Lance le script d&apos;ingestion pour remplir la base RAG.
//               </p>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type KnowledgeDocument = {
  id: string;
  title: string;
  source: string | null;
  category: string | null;
  language: string;
  created_at: string;
};

type Scope = "Support" | "Demo" | "Training" | "Pre-sales";
type SourceType = "all" | "note" | "file" | "url";
type NoteMode = "scratch" | "template";

type ClientKnowledgeDocument = KnowledgeDocument & {
  chunks: number;
  scope: Scope;
  active: boolean;
};

type NoteForm = {
  mode: NoteMode;
  template: string;
  title: string;
  content: string;
  scope: Scope;
  category: string;
  tags: string;
  sourceUrl: string;
};

type UrlForm = {
  startUrl: string;
  scope: Scope;
  category: string;
  tags: string;
  maxPages: number;
  maxDepth: number;
  includeSubdomains: boolean;
  sameRootPath: boolean;
};

const categories = [
  "FAQ & common questions",
  "Troubleshooting & errors",
  "Pricing, plans & billing",
  "Account & subscription",
  "Product & features",
  "Integrations & API",
  "Security & compliance",
  "Escalation & human handoff",
  "Policies & legal",
  "Glossary & definitions",
  "Journeys & workflows",
  "Sales pitch",
];

const templates = [
  {
    id: "pricing",
    label: "Pricing, packaging & commercial terms · Support",
    scope: "Support" as Scope,
    category: "Pricing, plans & billing",
    title: "Pricing, packaging & commercial terms",
    tags: "pricing, packaging, billing, faq",
    content: `## Pricing overview\n\n- Available plans:\n- Included features:\n- Usage limits:\n- Upgrade and downgrade rules:\n\n## Billing\n\n- Billing cycles:\n- Accepted payment methods:\n- Invoice availability:\n- Refund policy:\n\n## Guardrails\n\n- Never invent discounts or contractual commitments.\n- Escalate custom pricing requests to a human.`,
  },
  {
    id: "product-facts",
    label: "Product facts, agent capabilities & boundaries · Support",
    scope: "Support" as Scope,
    category: "Product & features",
    title: "Product facts, capabilities & boundaries",
    tags: "product, capabilities, limits, support",
    content: `## Product facts\n\n- Core capabilities:\n- Supported use cases:\n- Known limitations:\n\n## Agent boundaries\n\n- What the agent may explain:\n- What requires confirmation:\n- What requires human escalation:`,
  },
  {
    id: "onboarding",
    label: "User onboarding & guided flows · Training",
    scope: "Training" as Scope,
    category: "Journeys & workflows",
    title: "User onboarding & guided flows",
    tags: "onboarding, training, workflows, ui",
    content: `## Onboarding journey\n\n1. Account setup\n2. Workspace configuration\n3. First successful action\n4. Validation checklist\n\n## Common blockers\n\n- Missing permissions\n- Incomplete setup\n- Wrong workspace selection`,
  },
  {
    id: "sales",
    label: "Sales playbook & discovery · Demo",
    scope: "Demo" as Scope,
    category: "Sales pitch",
    title: "Sales playbook & discovery",
    tags: "vente, argumentaire, bénéfices, différenciation",
    content: `## Commercial motion\n\n### ICP & narrative\n- Ideal customer profile, segments to disqualify:\n- One-line value proposition plus three proof points:\n\n### Discovery\n- Qualification questions:\n- Buying signals / anti-signals:\n\n### Objections\n- Objection → aligned product answer + proof:\n- When to propose a demo:\n\n### Compliance\n- Never promise outside contract; route legal or custom terms to a human.`,
  },
];

const initialNoteForm: NoteForm = {
  mode: "scratch",
  template: "",
  title: "",
  content: "",
  scope: "Support",
  category: "",
  tags: "",
  sourceUrl: "",
};

const initialUrlForm: UrlForm = {
  startUrl: "",
  scope: "Support",
  category: "",
  tags: "",
  maxPages: 30,
  maxDepth: 2,
  includeSubdomains: false,
  sameRootPath: true,
};

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

function BusinessNoteSheet({
  open,
  form,
  busy,
  onOpenChange,
  onFormChange,
  onTemplateChange,
  onCreate,
}: {
  open: boolean;
  form: NoteForm;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: NoteForm) => void;
  onTemplateChange: (templateId: string) => void;
  onCreate: () => void;
}) {
  const canCreate =
    form.title.trim().length > 1 && form.content.trim().length > 5;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[820px]">
        <SheetHeader className="border-b border-[#e5e5e8] px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-[#dedee3] bg-[#f7f7f8]">
              <NotebookPen className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#777780]">
                Business note
              </p>
              <SheetTitle className="mt-1 text-xl">
                Create a business note
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="rounded-lg bg-[#f4f4f5] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
              How do you want to start?
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <ChoiceCard
                active={form.mode === "scratch"}
                title="From scratch"
                description="Write the title and content freely with no pre-filled template."
                onClick={() =>
                  onFormChange({ ...initialNoteForm, mode: "scratch" })
                }
              />
              <ChoiceCard
                active={form.mode === "template"}
                title="From a template"
                description="Pick a template below to pre-fill title, content, scope, and category."
                onClick={() => onFormChange({ ...form, mode: "template" })}
              />
            </div>
          </section>

          {form.mode === "template" ? (
            <section className="mt-4 rounded-lg bg-[#f4f4f5] p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-md border bg-white">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Quick templates</p>
                  <p className="mt-1 text-sm text-[#777780]">
                    Pre-fill the knowledge blocks the agent must master to
                    become autonomous.
                  </p>
                  <label className="mt-4 block">
                    <span className="text-sm font-semibold">
                      Quick template
                    </span>
                    <select
                      value={form.template}
                      onChange={(event) => onTemplateChange(event.target.value)}
                      className="mt-2 h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
                    >
                      <option value="">Choose a template...</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </section>
          ) : null}

          <div className="mt-5 space-y-5">
            <Field label="Title">
              <Input
                value={form.title}
                onChange={(event) =>
                  onFormChange({ ...form, title: event.target.value })
                }
                placeholder="Installation FAQ"
                className="h-11"
              />
            </Field>
            <Field label="Content">
              <Textarea
                value={form.content}
                onChange={(event) =>
                  onFormChange({ ...form, content: event.target.value })
                }
                placeholder="Document content..."
                className="min-h-[260px] font-mono text-sm"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Scope">
                <ScopeSelect
                  value={form.scope}
                  onChange={(value) => onFormChange({ ...form, scope: value })}
                />
              </Field>
              <Field label="Category">
                <CategorySelect
                  value={form.category}
                  onChange={(value) =>
                    onFormChange({ ...form, category: value })
                  }
                />
              </Field>
            </div>
            <Field label="Tags (comma separated)">
              <Input
                value={form.tags}
                onChange={(event) =>
                  onFormChange({ ...form, tags: event.target.value })
                }
                placeholder="pricing, onboarding, billing, faq"
                className="h-11"
              />
              <p className="mt-2 text-xs text-[#8a8a93]">
                Tags are suggested from the category — you can edit them.
              </p>
            </Field>
            <Field label="Source URL (optional)">
              <Input
                value={form.sourceUrl}
                onChange={(event) =>
                  onFormChange({ ...form, sourceUrl: event.target.value })
                }
                placeholder="https://help.example.com/pricing"
                className="h-11"
              />
            </Field>
          </div>
        </div>
        <SheetFooter className="border-t border-[#e5e5e8] px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canCreate || busy}
            onClick={onCreate}
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}Create
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ImportUrlSheet({
  open,
  form,
  busy,
  onOpenChange,
  onFormChange,
  onStart,
}: {
  open: boolean;
  form: UrlForm;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: UrlForm) => void;
  onStart: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[820px]">
        <SheetHeader className="border-b border-[#e5e5e8] px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-[#dedee3] bg-[#f7f7f8]">
              <Globe2 className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#777780]">
                Web documentation
              </p>
              <SheetTitle className="mt-1 text-xl">Import from URL</SheetTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777780]">
                The crawler discovers internal pages from this URL, extracts
                main text, and creates indexed documents automatically.
              </p>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <Field label="Start URL">
              <Input
                value={form.startUrl}
                onChange={(event) =>
                  onFormChange({ ...form, startUrl: event.target.value })
                }
                placeholder="https://docs.example.com"
                className="h-11"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Scope">
                <ScopeSelect
                  value={form.scope}
                  onChange={(value) => onFormChange({ ...form, scope: value })}
                />
              </Field>
              <Field label="Category (optional)">
                <CategorySelect
                  value={form.category}
                  onChange={(value) =>
                    onFormChange({ ...form, category: value })
                  }
                />
              </Field>
            </div>
            <Field label="Tags (comma separated)">
              <Input
                value={form.tags}
                onChange={(event) =>
                  onFormChange({ ...form, tags: event.target.value })
                }
                placeholder="pricing, onboarding, billing, faq"
                className="h-11"
              />
              <p className="mt-2 text-xs text-[#8a8a93]">
                Tags are suggested from the category — you can edit them.
              </p>
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Max pages">
                <Input
                  type="number"
                  value={form.maxPages}
                  min={1}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      maxPages: Number(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Max depth">
                <Input
                  type="number"
                  value={form.maxDepth}
                  min={0}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      maxDepth: Number(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
            </div>
            <section className="space-y-3 rounded-lg border border-[#dedee3] p-4">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.includeSubdomains}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      includeSubdomains: event.target.checked,
                    })
                  }
                />
                Include subdomains
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.sameRootPath}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      sameRootPath: event.target.checked,
                    })
                  }
                />
                Limit to same root path (e.g. /docs/)
              </label>
            </section>
          </div>
        </div>
        <SheetFooter className="border-t border-[#e5e5e8] px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!form.startUrl.trim() || busy}
            onClick={onStart}
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}Start
            crawl
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
function ChoiceCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white p-4 text-left transition",
        active
          ? "border-[#939ae2] bg-[#f5f6ff] shadow-[inset_0_0_0_1px_#939ae2]"
          : "border-[#dedee3] hover:border-[#b8b8bf]",
      )}
    >
      <p className={cn("font-semibold", active && "text-[#5964d6]")}>{title}</p>
      <p className="mt-1 text-sm leading-5 text-[#777780]">{description}</p>
    </button>
  );
}
function ScopeSelect({
  value,
  onChange,
}: {
  value: Scope;
  onChange: (value: Scope) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Scope)}
      className="h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
    >
      <option value="Support">Support</option>
      <option value="Demo">Demo</option>
      <option value="Training">Training</option>
      <option value="Pre-sales">Pre-sales</option>
    </select>
  );
}
function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
    >
      <option value="">Choose a category...</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
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
