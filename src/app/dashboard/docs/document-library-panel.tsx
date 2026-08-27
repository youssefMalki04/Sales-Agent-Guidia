import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KnowledgeDocument } from "./docs-types";

type DocumentLibraryPanelProps = {
  documents: KnowledgeDocument[];
  chunkCounts: Record<string, number>;
  categories: string[];
  query: string;
  category: string;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onOpen: (id: string) => void;
  onDownload: (document: KnowledgeDocument) => void;
  onDelete: (id: string) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function DocumentLibraryPanel({
  documents,
  chunkCounts,
  categories,
  query,
  category,
  loading,
  onQueryChange,
  onCategoryChange,
  onOpen,
  onDownload,
  onDelete,
}: DocumentLibraryPanelProps) {
  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_280px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search documents, categories or sources..."
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafd] hover:bg-[#fafafd]">
              <TableHead className="px-4 text-xs uppercase text-[#777780]">
                File
              </TableHead>
              <TableHead className="text-xs uppercase text-[#777780]">
                Category
              </TableHead>
              <TableHead className="text-xs uppercase text-[#777780]">
                Chunks
              </TableHead>
              <TableHead className="text-xs uppercase text-[#777780]">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase text-[#777780]">
                Created
              </TableHead>
              <TableHead className="text-right text-xs uppercase text-[#777780]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-[#5964d6]" />
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow key={document.id} className="hover:bg-[#fafaff]">
                  <TableCell className="max-w-[360px] px-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {document.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#a0a0a8]">
                          {document.source ?? "knowledge"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#686872]">
                    {document.category ?? "General"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {chunkCounts[document.id] ?? 0}
                  </TableCell>
                  <TableCell>
                    <Badge className="border border-[#bfe8d1] bg-[#e9f8ef] text-[#1f8a52] hover:bg-[#e9f8ef]">
                      Indexed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[#777780]">
                    {formatDate(document.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        aria-label="Open document"
                        variant="outline"
                        size="icon"
                        className="rounded-xl text-[#5964d6]"
                        onClick={() => onOpen(document.id)}
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                      <Button
                        aria-label="Download document"
                        variant="outline"
                        size="icon"
                        className="rounded-xl text-[#5964d6]"
                        onClick={() => onDownload(document)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        aria-label="Delete document"
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-[#f0c9c9] text-[#d94b4b]"
                        onClick={() => onDelete(document.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <BookOpen className="mx-auto size-6 text-[#5964d6]" />
                  <p className="mt-3 font-semibold">No documents found</p>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
