"use client";

import { Download, Sparkles } from "lucide-react";
import { ImportLeadsPanel } from "./import-leads-panel";
import {
  DataPreview,
  ExportPanel,
  ImportRequirements,
} from "./import-export-panels";
import { useImportExport } from "./use-import-export";

export default function ImportExportPage() {
  const {
    fileName,
    rows,
    headers,
    mapping,
    duplicateMode,
    setDuplicateMode,
    importResult,
    working,
    error,
    leadCount,
    exportFields,
    setExportFields,
    emailHeader,
    invalidRows,
    duplicateRows,
    validRows,
    parseFile,
    resetImport,
    changeMapping,
    finishImport,
    downloadCsv,
  } = useImportExport();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-12">
      <div className="soft-page-enter mx-auto max-w-[1300px] space-y-7">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Lead operations
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Import / Export
            </h1>
            <p className="mt-2 text-sm text-[#73737c]">
              Move lead data safely between Leadia and your existing tools.
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadCsv("template")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
          >
            <Download className="size-4" />
            Download CSV template
          </button>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div className="space-y-5">
            <ImportLeadsPanel
              fileName={fileName}
              rows={rows}
              headers={headers}
              mapping={mapping}
              duplicateMode={duplicateMode}
              importResult={importResult}
              working={working}
              error={error}
              emailHeader={emailHeader}
              validRows={validRows}
              invalidRows={invalidRows}
              duplicateRows={duplicateRows}
              onFile={parseFile}
              onReset={resetImport}
              onMappingChange={changeMapping}
              onDuplicateModeChange={setDuplicateMode}
              onImport={finishImport}
            />

            <DataPreview headers={headers} rows={rows} />
          </div>

          <aside className="space-y-5">
            <ExportPanel
              fields={exportFields}
              leadCount={leadCount}
              working={working}
              onFieldsChange={setExportFields}
              onExport={() => downloadCsv("export")}
            />
            <ImportRequirements />
          </aside>
        </section>
      </div>
    </main>
  );
}
