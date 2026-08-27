import { useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  FileSpreadsheet,
  FileUp,
  Upload,
  X,
} from "lucide-react";

import { fieldOptions } from "./import-export-data";
import type { CsvRow, ImportResult, LeadField } from "./import-export-types";
import { Validation } from "./import-export-ui";

export function ImportLeadsPanel({
  fileName,
  rows,
  headers,
  mapping,
  duplicateMode,
  importResult,
  working,
  error,
  emailHeader,
  validRows,
  invalidRows,
  duplicateRows,
  onFile,
  onReset,
  onMappingChange,
  onDuplicateModeChange,
  onImport,
}: {
  fileName: string;
  rows: CsvRow[];
  headers: string[];
  mapping: Record<string, LeadField>;
  duplicateMode: "skip" | "update";
  importResult: ImportResult | null;
  working: boolean;
  error: string;
  emailHeader?: string;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  onFile: (file: File) => void;
  onReset: () => void;
  onMappingChange: (header: string, field: LeadField) => void;
  onDuplicateModeChange: (mode: "skip" | "update") => void;
  onImport: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
          <FileUp className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">Import leads</h2>
          <p className="mt-1 text-xs text-[#7d7d86]">
            Upload a UTF-8 CSV file up to 10 MB.
          </p>
        </div>
      </div>

      {!rows.length ? (
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) onFile(file);
          }}
          className={`mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragging
              ? "border-[#939ae2] bg-[#f1f2ff]"
              : "border-[#dfe2eb] bg-[#fafafd]"
          }`}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Upload className="size-6 text-[#62626b]" />
          </span>
          <h3 className="mt-4 text-sm font-semibold">
            Drop your CSV file here
          </h3>
          <p className="mt-2 text-xs text-[#85858e]">
            or choose a file from your computer
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 h-9 rounded-xl bg-[#5964d6] px-4 text-xs font-semibold text-white hover:bg-[#4f5acb]"
          >
            Choose file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFile(file);
              event.target.value = "";
            }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="size-5 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold">{fileName}</p>
                <p className="mt-1 text-xs text-emerald-700">
                  {rows.length} rows detected
                </p>
              </div>
            </div>
            <button type="button" onClick={onReset} aria-label="Remove file">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Map CSV columns</h3>
            <p className="mt-1 text-xs text-[#85858e]">
              Confirm where each source column should be imported.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {headers.map((header) => (
                <label
                  key={header}
                  className="rounded-lg border border-[#e4e4e9] p-3"
                >
                  <span className="block truncate text-xs font-semibold">
                    {header}
                  </span>
                  <span className="mt-1 block truncate text-[10px] text-[#9999a2]">
                    Example: {rows[0]?.[header] || "Empty"}
                  </span>
                  <select
                    value={mapping[header]}
                    onChange={(event) =>
                      onMappingChange(header, event.target.value as LeadField)
                    }
                    className="mt-3 h-9 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold"
                  >
                    {fieldOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Validation label="Valid rows" value={validRows} tone="green" />
            <Validation label="Invalid emails" value={invalidRows} tone="red" />
            <Validation label="Duplicates" value={duplicateRows} tone="amber" />
          </div>

          <div className="mt-6 rounded-lg bg-[#f5f5f7] p-4">
            <p className="text-xs font-bold uppercase text-[#777780]">
              Duplicate handling
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {(["skip", "update"] as const).map((mode) => (
                <label
                  key={mode}
                  className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
                    duplicateMode === mode
                      ? "border-[#939ae2] bg-white text-[#5964d6]"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    checked={duplicateMode === mode}
                    onChange={() => onDuplicateModeChange(mode)}
                    className="accent-[#5964d6]"
                  />
                  {mode === "skip"
                    ? "Skip existing emails"
                    : "Update existing leads"}
                </label>
              ))}
            </div>
          </div>

          {importResult ? (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="size-5" />
              {importResult.imported} imported, {importResult.updated} updated,{" "}
              {importResult.skipped} skipped.
            </div>
          ) : (
            <button
              type="button"
              onClick={onImport}
              disabled={!emailHeader || !validRows || working}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb] disabled:opacity-40"
            >
              <Check className="size-4" />
              {working ? "Importing…" : `Import ${validRows} leads`}
            </button>
          )}
        </div>
      )}

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}
    </section>
  );
}
