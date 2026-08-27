import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  ClientKnowledgeDocument,
  Scope,
  SourceType,
} from "./knowledge-data";
import { KnowledgeFilterField, KnowledgeScopeBadge } from "./knowledge-ui";

type KnowledgeDocumentsPanelProps = {
  documents: ClientKnowledgeDocument[];
  searchQuery: string;
  scopeFilter: "all" | Scope;
  sourceFilter: SourceType;
  selectedIds: string[];
  allVisibleSelected: boolean;
  reindexing: boolean;
  onSearchQueryChange: (value: string) => void;
  onScopeFilterChange: (value: "all" | Scope) => void;
  onSourceFilterChange: (value: SourceType) => void;
  onToggleAll: () => void;
  onToggleDocument: (id: string) => void;
  onReindexAll: () => void;
  onReindexDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
};

export function KnowledgeDocumentsPanel({
  documents,
  searchQuery,
  scopeFilter,
  sourceFilter,
  selectedIds,
  allVisibleSelected,
  reindexing,
  onSearchQueryChange,
  onScopeFilterChange,
  onSourceFilterChange,
  onToggleAll,
  onToggleDocument,
  onReindexAll,
  onReindexDocument,
  onDeleteDocument,
}: KnowledgeDocumentsPanelProps) {
  return (
    <section className="soft-panel-enter mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <div className="grid gap-4 rounded-2xl border border-slate-100 bg-[#fafafd] p-4 lg:grid-cols-[52px_1.4fr_0.8fr_0.9fr_auto_auto] lg:items-end">
        <div className="flex size-11 items-center justify-center rounded-xl border border-[#e1e4f8] bg-[#f1f2ff] text-sm font-semibold text-[#5964d6]">
          {documents.length}
        </div>

        <KnowledgeFilterField label="Search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa2]" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search by title, category, or tag..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-10"
            />
          </div>
        </KnowledgeFilterField>

        <KnowledgeFilterField label="Scope">
          <select
            value={scopeFilter}
            onChange={(event) =>
              onScopeFilterChange(event.target.value as "all" | Scope)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="all">All scopes</option>
            <option value="Support">Support</option>
            <option value="Demo">Demo</option>
            <option value="Training">Training</option>
            <option value="Pre-sales">Pre-sales</option>
          </select>
        </KnowledgeFilterField>

        <KnowledgeFilterField label="Source type">
          <select
            value={sourceFilter}
            onChange={(event) =>
              onSourceFilterChange(event.target.value as SourceType)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
          >
            <option value="all">All sources</option>
            <option value="note">Business notes</option>
            <option value="file">Uploaded files</option>
            <option value="url">Imported URLs</option>
          </select>
        </KnowledgeFilterField>

        <Button
          variant="outline"
          onClick={onReindexAll}
          disabled={reindexing}
          className="h-11 rounded-xl border-[#cfd3ed] bg-white px-5 text-[#5964d6] hover:bg-[#f5f6ff]"
        >
          {reindexing ? (
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
          Selection{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
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
                    onChange={onToggleAll}
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
              {documents.length > 0 ? (
                documents.map((document) => (
                  <tr
                    key={document.id}
                    className="border-t border-[#ececef] text-sm"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(document.id)}
                        onChange={() => onToggleDocument(document.id)}
                      />
                    </td>
                    <td className="max-w-[340px] px-4 py-4 font-semibold text-[#303038]">
                      <p className="truncate">{document.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <KnowledgeScopeBadge scope={document.scope} />
                    </td>
                    <td className="px-4 py-4 font-medium">{document.chunks}</td>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Reindex document"
                        disabled={reindexing}
                        onClick={() => onReindexDocument(document.id)}
                      >
                        <RefreshCcw className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete document"
                        className="text-rose-500 hover:text-rose-600"
                        onClick={() => onDeleteDocument(document.id)}
                      >
                        <Trash2 className="size-4" />
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
                      Create a note, upload a file or import your documentation.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#ececef] px-4 py-5 text-sm text-[#777780] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing 1–{documents.length} of {documents.length}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-9 rounded-full bg-white px-4">
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
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
