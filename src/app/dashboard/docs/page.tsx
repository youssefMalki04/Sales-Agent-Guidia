import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getDocs } from "./docs-data";

export default async function DocsPage() {
  const { documents, chunksByDocument } = await getDocs();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px] space-y-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Content library
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Documents
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse indexed files and knowledge sources available to your AI
              agents.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-[#fafafd] px-4 py-3">
            <p className="text-xl font-semibold text-slate-950">
              {documents.length}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Indexed documents
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
          <div className="flex items-center gap-2">
            <Button className="h-10 rounded-xl bg-white px-4 text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,.10)] hover:bg-white">
              <Download className="size-4" />
              All
              <span className="ml-1 rounded-full bg-[#f1f2ff] px-2 py-0.5 text-xs text-[#5964d6]">
                {documents.length}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="h-10 rounded-xl px-4 text-slate-500 hover:bg-white"
            >
              <FileText className="size-4" />
              Knowledge
              <span className="ml-1 rounded-full bg-[#f0f0f2] px-2 py-0.5 text-xs text-[#777780]">
                {documents.length}
              </span>
            </Button>
          </div>
        </section>

        <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
          <div className="mb-5 grid gap-3 lg:grid-cols-[52px_1fr_1fr]">
            <button
              aria-label="Search"
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-[#fafafd] text-[#5964d6]"
            >
              <Search className="size-5" />
            </button>
            <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-[#3d3d45] outline-none focus:border-[#939ae2]">
              <option>All apps</option>
              <option>lynara</option>
              <option>leadia</option>
            </select>
            <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-[#3d3d45] outline-none focus:border-[#939ae2]">
              <option>All types</option>
              <option>Document</option>
              <option>Knowledge</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafd] hover:bg-[#fafafd]">
                  <TableHead className="px-4 text-xs uppercase tracking-normal text-[#777780]">
                    File
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
                    Type
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
                    Folder
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
                    Application
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
                    Size
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-normal text-[#777780]">
                    Last modified
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-normal text-[#777780]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => {
                  const chunkCount = chunksByDocument.get(document.id) ?? 0;
                  const size = Math.max(80, chunkCount * 55);

                  return (
                    <TableRow
                      key={document.id}
                      className="transition hover:bg-[#fafaff]"
                    >
                      <TableCell className="max-w-[330px] px-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                            <FileText className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#202026]">
                              {document.title}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#a0a0a8]">
                              {document.source ?? "knowledge"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full border-[#e1e4f8] bg-[#f5f6ff] text-[#5964d6]"
                        >
                          Document
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#686872]">
                        Knowledge
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#686872]">
                        lynara
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-[#34343b]">
                        {size} KB
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-full border border-[#bfe8d1] bg-[#e9f8ef] text-[#1f8a52] hover:bg-[#e9f8ef]">
                          Indexed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#777780]">
                        {formatDate(document.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            aria-label="Open document"
                            variant="outline"
                            size="icon"
                            className="rounded-xl border-slate-200 bg-white text-[#5964d6] hover:bg-[#f5f6ff]"
                          >
                            <ExternalLink className="size-4" />
                          </Button>
                          <Button
                            aria-label="Download document"
                            variant="outline"
                            size="icon"
                            className="rounded-xl border-slate-200 bg-white text-[#5964d6] hover:bg-[#f5f6ff]"
                          >
                            <Download className="size-4" />
                          </Button>
                          <Button
                            aria-label="Delete document"
                            variant="outline"
                            size="icon"
                            className="rounded-xl border-[#f0c9c9] bg-white text-[#d94b4b] hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!documents.length ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center">
                      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#f1f2ff] text-[#5964d6]">
                        <BookOpen className="size-5" />
                      </span>
                      <p className="mt-4 font-semibold text-slate-900">
                        No indexed documents
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Add content from the Knowledge Base to see it here.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
