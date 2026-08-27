import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  RefreshCcw,
  TableProperties,
} from "lucide-react";

import { fieldOptions } from "./import-export-data";
import type { CsvRow, LeadField } from "./import-export-types";
import { Tip } from "./import-export-ui";

export function DataPreview({
  headers,
  rows,
}: {
  headers: string[];
  rows: CsvRow[];
}) {
  if (!rows.length) return null;

  return (
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
                  <td key={header} className="max-w-48 truncate px-4 py-3">
                    {row[header] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ExportPanel({
  fields,
  leadCount,
  working,
  onFieldsChange,
  onExport,
}: {
  fields: LeadField[];
  leadCount: number;
  working: boolean;
  onFieldsChange: (fields: LeadField[]) => void;
  onExport: () => void;
}) {
  return (
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
                  checked={fields.includes(field.value)}
                  onChange={(event) =>
                    onFieldsChange(
                      event.target.checked
                        ? [...fields, field.value]
                        : fields.filter((item) => item !== field.value),
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
        onClick={onExport}
        disabled={!fields.length || working}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5964d6] text-sm font-semibold text-white hover:bg-[#4f5acb] disabled:opacity-40"
      >
        <Download className="size-4" />
        Export {leadCount} leads
      </button>
    </section>
  );
}

export function ImportRequirements() {
  return (
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
          text="Imports are validated again by the server before being stored."
        />
      </div>
    </section>
  );
}
