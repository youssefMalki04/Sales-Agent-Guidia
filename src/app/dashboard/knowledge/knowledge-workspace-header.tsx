import { useRef } from "react";
import {
  BookOpen,
  FileText,
  Globe2,
  NotebookPen,
  Sparkles,
  Upload,
} from "lucide-react";

import type { ClientKnowledgeDocument } from "./knowledge-data";
import { KnowledgeActionButton, KnowledgeMetric } from "./knowledge-ui";

export function KnowledgeWorkspaceHeader({
  documents,
  uploading,
  onCreateNote,
  onImportUrl,
  onUploadFile,
}: {
  documents: ClientKnowledgeDocument[];
  uploading: boolean;
  onCreateNote: () => void;
  onImportUrl: () => void;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chunksCount = documents.reduce(
    (total, document) => total + document.chunks,
    0,
  );

  return (
    <>
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
          <KnowledgeMetric value={chunksCount} label="Chunks" icon={BookOpen} />
        </div>
      </header>

      <section className="mt-7 grid gap-3 sm:grid-cols-3">
        <KnowledgeActionButton
          icon={NotebookPen}
          label="Create business note"
          description="Write structured knowledge"
          onClick={onCreateNote}
        />
        <KnowledgeActionButton
          icon={Upload}
          label={uploading ? "Uploading..." : "Upload a file"}
          description="TXT, MD or CSV · max 2 MB"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        />
        <KnowledgeActionButton
          icon={Globe2}
          label="Import from URL"
          description="Crawl trusted documentation"
          onClick={onImportUrl}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.md,.csv"
          onChange={onUploadFile}
        />
      </section>
    </>
  );
}
