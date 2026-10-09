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
  MoreHorizontal,
} from "lucide-react";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
        >
          <Plus className="size-4" />
          New lead
        </button>
        <DropdownMenu>
        <DropdownMenuTrigger asChild><button
          type="button"
          disabled={exporting !== null}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
        >
          <Download className="size-4" />
          {exporting ? "Exporting…" : "Export"}
        </button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={exporting !== null} onSelect={() => void downloadLeads("csv")}><Download className="size-4" />Export CSV</DropdownMenuItem>
          <DropdownMenuItem disabled={exporting !== null} onSelect={() => void downloadLeads("xls")}><FileSpreadsheet className="size-4" />Export Excel</DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="Lead actions" className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-500">
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild><Link href={`/dashboard/leads/${encodeURIComponent(lead.id)}`}><Eye className="size-4" />Open lead</Link></DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setModal("edit")}><Pencil className="size-4" />Edit lead</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setModal("delete")}><Trash2 className="size-4" />Delete lead</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
