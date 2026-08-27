"use client";

import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentLibraryPanel } from "./document-library-panel";
import { DocumentEditorSheet } from "./document-editor-sheet";
import { useDocuments } from "./use-documents";

export default function DocsPage() {
  const {
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
  } = useDocuments();

  return (
    <>
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
                Browse, edit and export the knowledge used by your AI agents.
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

          {error ? (
            <section className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              <span>{error}</span>
              <Button
                variant="outline"
                onClick={() => loadDocuments().catch(() => undefined)}
              >
                Retry
              </Button>
            </section>
          ) : null}

          <DocumentLibraryPanel
            documents={filteredDocuments}
            chunkCounts={chunkCounts}
            categories={categories}
            query={query}
            category={category}
            loading={loading}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
            onOpen={openDocument}
            onDownload={downloadDocument}
            onDelete={deleteDocument}
          />
        </div>
      </main>

      <DocumentEditorSheet
        open={editorOpen}
        loading={editorLoading}
        saving={saving}
        document={selected}
        onOpenChange={setEditorOpen}
        onDocumentChange={setSelected}
        onSave={saveDocument}
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
