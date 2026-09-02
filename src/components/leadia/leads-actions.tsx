"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Eye,
  FileSpreadsheet,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { IconButton } from "./lead-action-fields";
import {
  ConfirmDeleteModal,
  LeadFormModal,
} from "./lead-action-modals";
import type { LeadActionRow } from "./lead-action-types";

export type { LeadActionRow } from "./lead-action-types";

export function LeadsToolbar() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "xls" | null>(null);
  const [exportError, setExportError] = useState("");

  async function downloadLeads(format: "csv" | "xls") {
    setExporting(format);
    setExportError("");
    try {
      const response = await fetch(`/api/import-export?format=${format}`);
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Export failed");
      }
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? `leadia-leads.${format}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-2xl bg-transparent px-1">
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
        >
          <Plus className="size-4" />
          New lead
        </button>
        <button
          type="button"
          onClick={() => void downloadLeads("csv")}
          disabled={exporting !== null}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
        >
          <Download className="size-4" />
          {exporting === "csv" ? "Exporting…" : "Export CSV"}
        </button>
        <button
          type="button"
          onClick={() => void downloadLeads("xls")}
          disabled={exporting !== null}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
        >
          <FileSpreadsheet className="size-4" />
          {exporting === "xls" ? "Exporting…" : "Export Excel"}
        </button>
        {exportError ? <p className="w-full text-sm font-medium text-red-600">{exportError}</p> : null}
      </div>

      {isCreateOpen ? (
        <LeadFormModal mode="create" onClose={() => setIsCreateOpen(false)} />
      ) : null}
    </>
  );
}

export function LeadRowActions({
  lead,
  source,
  status,
}: {
  lead: LeadActionRow;
  source: string;
  status: string;
}) {
  const [modal, setModal] = useState<"delete" | "edit" | null>(null);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Link
          href={`/dashboard/leads/${encodeURIComponent(lead.id)}`}
          aria-label="View full lead profile"
          className="inline-flex size-8 items-center justify-center rounded-md text-[#55555f] hover:bg-[#f4f4f5]"
        >
          <Eye className="size-4" />
        </Link>
        <IconButton label="Edit" onClick={() => setModal("edit")}>
          <Pencil className="size-4" />
        </IconButton>
        <IconButton label="Delete" danger onClick={() => setModal("delete")}>
          <Trash2 className="size-4" />
        </IconButton>
      </div>

      {modal === "edit" ? (
        <LeadFormModal
          mode="edit"
          lead={lead}
          source={source}
          status={status}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === "delete" ? (
        <ConfirmDeleteModal leadId={lead.id} onClose={() => setModal(null)} />
      ) : null}
    </>
  );
}
