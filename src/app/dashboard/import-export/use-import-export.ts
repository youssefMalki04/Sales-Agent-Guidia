"use client";

import { useEffect, useMemo, useState } from "react";

import type { CsvRow, ImportResult, LeadField } from "./import-export-types";
import {
  escapeCsv,
  normalizeHeader,
  parseCsvLine,
} from "./import-export-utils";

const defaultFields: LeadField[] = [
  "name",
  "email",
  "company",
  "country",
  "sector",
  "score",
  "temperature",
  "status",
];

export function useImportExport() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, LeadField>>({});
  const [duplicateMode, setDuplicateMode] = useState<"skip" | "update">("skip");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [leadCount, setLeadCount] = useState(0);
  const [exportFields, setExportFields] = useState<LeadField[]>(defaultFields);

  async function refreshCount() {
    const response = await fetch("/api/import-export?format=count", {
      cache: "no-store",
    });
    if (response.ok) setLeadCount((await response.json()).count ?? 0);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCount();
  }, []);

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
      setImportResult(null);
      setError("");
    };
    reader.readAsText(file);
  }

  function resetImport() {
    setRows([]);
    setHeaders([]);
    setMapping({});
    setFileName("");
    setImportResult(null);
    setError("");
  }

  function changeMapping(header: string, field: LeadField) {
    setMapping((current) => ({ ...current, [header]: field }));
  }

  async function finishImport() {
    if (!emailHeader || !validRows) return;

    setWorking(true);
    setError("");
    setImportResult(null);
    const mappedRows = rows.map((row) =>
      Object.fromEntries(
        headers.flatMap((header) =>
          mapping[header] && mapping[header] !== "ignore"
            ? [[mapping[header], row[header] ?? ""]]
            : [],
        ),
      ),
    );

    try {
      const response = await fetch("/api/import-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: mappedRows, duplicateMode }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Import failed");

      setImportResult(payload);
      await refreshCount();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Import failed");
    } finally {
      setWorking(false);
    }
  }

  async function downloadCsv(kind: "export" | "template") {
    const fields = kind === "template" ? defaultFields : exportFields;

    if (kind === "export") {
      setWorking(true);
      setError("");
      try {
        const response = await fetch(
          `/api/import-export?format=csv&fields=${encodeURIComponent(fields.join(","))}`,
        );
        if (!response.ok) {
          throw new Error((await response.json()).error ?? "Export failed");
        }

        const url = URL.createObjectURL(await response.blob());
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download =
          response.headers
            .get("Content-Disposition")
            ?.match(/filename="([^"]+)"/)?.[1] ?? "leadia-leads-export.csv";
        anchor.click();
        URL.revokeObjectURL(url);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Export failed");
      } finally {
        setWorking(false);
      }
      return;
    }

    const templateRow = {
      name: "Jane Doe",
      email: "jane@example.com",
      company: "Acme",
      country: "France",
      sector: "SaaS",
      score: "80",
      temperature: "Hot",
      status: "Qualified",
    };
    const csv = [
      fields.join(","),
      fields
        .map((field) =>
          escapeCsv(
            field === "ignore"
              ? ""
              : (templateRow[field as keyof typeof templateRow] ?? ""),
          ),
        )
        .join(","),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "leadia-import-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return {
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
  };
}
