"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  RefreshCcw,
  Sparkles,
  TableProperties,
  Upload,
  X,
} from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { fieldOptions, sampleLeads } from "./import-export-data";
import type { CsvRow, LeadField } from "./import-export-types";
import {
  escapeCsv,
  normalizeHeader,
  parseCsvLine,
} from "./import-export-utils";
import { Tip, Validation } from "./import-export-ui";

export default function ImportExportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, LeadField>>({});
  const [duplicateMode, setDuplicateMode] = useState<"skip" | "update">("skip");
  const [imported, setImported] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [exportFields, setExportFields] = useState<LeadField[]>([
    "name",
    "email",
    "company",
    "country",
    "sector",
    "score",
    "temperature",
    "status",
  ]);

  const emailHeader = headers.find((header) => mapping[header] === "email");
  const invalidRows = useMemo(
    () =>
      rows.filter(
        (row) => !emailHeader || !/^\S+@\S+\.\S+$/.test(row[emailHeader] ?? ""),
      ).length,
    [emailHeader, rows],
  );
  const duplicateRows = useMemo(
    () =>
      emailHeader
        ? rows.filter(
            (row, index) =>
              rows.findIndex(
                (candidate) =>
                  candidate[emailHeader]?.toLowerCase() ===
                  row[emailHeader]?.toLowerCase(),
              ) !== index,
          ).length
        : 0,
    [emailHeader, rows],
  );
  const validRows = Math.max(
    0,
    rows.length - invalidRows - (duplicateMode === "skip" ? duplicateRows : 0),
  );

  function parseFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "").replace(/^\uFEFF/, "");
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (!lines.length) return;
      const delimiter =
        lines[0].split(";").length > lines[0].split(",").length ? ";" : ",";
      const parsed = lines.map((line) => parseCsvLine(line, delimiter));
      const nextHeaders = parsed[0].map((header) => header.trim());
      const nextRows = parsed
        .slice(1)
        .map((values) =>
          Object.fromEntries(
            nextHeaders.map((header, index) => [
              header,
              values[index]?.trim() ?? "",
            ]),
          ),
        );
      setHeaders(nextHeaders);
      setRows(nextRows);
      setMapping(
        Object.fromEntries(
          nextHeaders.map((header) => [header, normalizeHeader(header)]),
        ),
      );
      setFileName(file.name);
      setImported(false);
    };
    reader.readAsText(file);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) parseFile(file);
    event.target.value = "";
  }

  function reset() {
    setRows([]);
    setHeaders([]);
    setMapping({});
    setFileName("");
    setImported(false);
  }

  function finishImport() {
    if (!emailHeader || !validRows) return;
    setImported(true);
  }

  function downloadCsv(kind: "export" | "template") {
    const fields =
      kind === "template"
        ? ([
            "name",
            "email",
            "company",
            "country",
            "sector",
            "score",
            "temperature",
            "status",
          ] as LeadField[])
        : exportFields;
    const data =
      kind === "template"
        ? [
            {
              name: "Jane Doe",
              email: "jane@example.com",
              company: "Acme",
              country: "France",
              sector: "SaaS",
              score: "80",
              temperature: "Hot",
              status: "Qualified",
            },
          ]
        : sampleLeads;
    const csv = [
      fields.join(","),
      ...data.map((row) =>
        fields
          .map((field) =>
            escapeCsv(
              field === "ignore" ? "" : (row[field as keyof typeof row] ?? ""),
            ),
          )
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download =
      kind === "template"
        ? "leadia-import-template.csv"
        : "leadia-leads-export.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

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
                    if (file) parseFile(file);
                  }}
                  className={`mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-[#939ae2] bg-[#f1f2ff]" : "border-[#dfe2eb] bg-[#fafafd]"}`}
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
                    onChange={handleFile}
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
                    <button
                      type="button"
                      onClick={reset}
                      aria-label="Remove file"
                    >
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
                              setMapping((current) => ({
                                ...current,
                                [header]: event.target.value as LeadField,
                              }))
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
                    <Validation
                      label="Valid rows"
                      value={validRows}
                      tone="green"
                    />
                    <Validation
                      label="Invalid emails"
                      value={invalidRows}
                      tone="red"
                    />
                    <Validation
                      label="Duplicates"
                      value={duplicateRows}
                      tone="amber"
                    />
                  </div>
                  <div className="mt-6 rounded-lg bg-[#f5f5f7] p-4">
                    <p className="text-xs font-bold uppercase text-[#777780]">
                      Duplicate handling
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      {(["skip", "update"] as const).map((mode) => (
                        <label
                          key={mode}
                          className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${duplicateMode === mode ? "border-[#939ae2] bg-white text-[#5964d6]" : "border-transparent"}`}
                        >
                          <input
                            type="radio"
                            checked={duplicateMode === mode}
                            onChange={() => setDuplicateMode(mode)}
                            className="accent-[#5964d6]"
                          />
                          {mode === "skip"
                            ? "Skip existing emails"
                            : "Update existing leads"}
                        </label>
                      ))}
                    </div>
                  </div>
                  {imported ? (
                    <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="size-5" />
                      {validRows} leads imported in this frontend demonstration.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={finishImport}
                      disabled={!emailHeader || !validRows}
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb] disabled:opacity-40"
                    >
                      <Check className="size-4" />
                      Import {validRows} leads
                    </button>
                  )}
                </div>
              )}
            </section>

            {rows.length ? (
              <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <div>
                    <h2 className="font-semibold">Data preview</h2>
                    <p className="mt-1 text-xs text-[#85858e]">
                      First five rows from the uploaded file
                    </p>
                  </div>
                  <TableProperties className="size-5 text-[#85858e]" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead>
                      <tr className="border-b bg-[#fafafa] text-[10px] uppercase text-[#85858e]">
                        {headers.slice(0, 6).map((header) => (
                          <th key={header} className="px-4 py-3">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b last:border-0">
                          {headers.slice(0, 6).map((header) => (
                            <td
                              key={header}
                              className="max-w-48 truncate px-4 py-3"
                            >
                              {row[header] || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-5">
            <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Download className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">Export leads</h2>
                  <p className="mt-1 text-xs text-[#7d7d86]">
                    Download lead data as CSV.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase text-[#777780]">
                  Columns to include
                </p>
                <div className="mt-3 space-y-2">
                  {fieldOptions
                    .filter((field) => field.value !== "ignore")
                    .map((field) => (
                      <label
                        key={field.value}
                        className="flex items-center justify-between rounded-md bg-[#f7f7f8] px-3 py-2.5 text-xs font-medium"
                      >
                        <span>{field.label}</span>
                        <input
                          type="checkbox"
                          checked={exportFields.includes(field.value)}
                          onChange={(event) =>
                            setExportFields((current) =>
                              event.target.checked
                                ? [...current, field.value]
                                : current.filter(
                                    (item) => item !== field.value,
                                  ),
                            )
                          }
                          className="size-4 accent-[#5964d6]"
                        />
                      </label>
                    ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadCsv("export")}
                disabled={!exportFields.length}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5964d6] text-sm font-semibold text-white hover:bg-[#4f5acb] disabled:opacity-40"
              >
                <Download className="size-4" />
                Export {sampleLeads.length} demo leads
              </button>
            </section>
            <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
              <h2 className="font-semibold">Import requirements</h2>
              <div className="mt-4 space-y-3 text-xs leading-5 text-[#6e6e77]">
                <Tip
                  icon={<CheckCircle2 className="size-4 text-emerald-600" />}
                  text="Email is required and must be unique."
                />
                <Tip
                  icon={<FileSpreadsheet className="size-4 text-indigo-600" />}
                  text="CSV files may use commas or semicolons."
                />
                <Tip
                  icon={<RefreshCcw className="size-4 text-violet-600" />}
                  text="Existing leads can be skipped or updated."
                />
                <Tip
                  icon={<AlertCircle className="size-4 text-amber-600" />}
                  text="This frontend demo does not write to the database."
                />
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
