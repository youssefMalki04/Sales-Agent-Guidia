"use client";

import { Check } from "lucide-react";

import type { KnowledgeDocument } from "./knowledge-data";
import {
  KnowledgeDocumentsPanel,
  KnowledgeSearchTester,
} from "./knowledge-panels";
import { BusinessNoteSheet, ImportUrlSheet } from "./knowledge-sheets";
import { KnowledgeWorkspaceHeader } from "./knowledge-workspace-header";
import { useKnowledgeBase } from "./use-knowledge-base";

function KnowledgeBaseClient({
  initialDocuments,
  initialChunksByDocument,
}: {
  initialDocuments: KnowledgeDocument[];
  initialChunksByDocument: Record<string, number>;
}) {
  const {
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
  } = useKnowledgeBase({ initialDocuments, initialChunksByDocument });

  return (
    <>
      <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 sm:px-8 xl:px-14">
        <div className="soft-page-enter mx-auto max-w-[1180px]">
          <KnowledgeWorkspaceHeader
            documents={documents}
            uploading={busy === "upload"}
            onCreateNote={() => setNoteOpen(true)}
            onImportUrl={() => setUrlOpen(true)}
            onUploadFile={handleFileUpload}
          />

          <KnowledgeSearchTester
            query={testQuery}
            results={testResults}
            testing={testingSearch}
            onQueryChange={setTestQuery}
            onSearch={testKnowledgeSearch}
          />

          <KnowledgeDocumentsPanel
            documents={filteredDocuments}
            searchQuery={query}
            scopeFilter={scopeFilter}
            sourceFilter={sourceFilter}
            selectedIds={selectedIds}
            allVisibleSelected={allVisibleSelected}
            reindexing={busy === "reindex"}
            onSearchQueryChange={setQuery}
            onScopeFilterChange={setScopeFilter}
            onSourceFilterChange={setSourceFilter}
            onToggleAll={toggleAllVisible}
            onToggleDocument={toggleDocument}
            onReindexAll={reindexAll}
            onReindexDocument={reindexDocument}
            onDeleteDocument={deleteDocument}
          />
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

export default function KnowledgeDashboardPage() {
  return (
    <KnowledgeBaseClient initialDocuments={[]} initialChunksByDocument={{}} />
  );
}
