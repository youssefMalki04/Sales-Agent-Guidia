"use client";

import { useState } from "react";
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
  LeadDetailModal,
  LeadFormModal,
} from "./lead-action-modals";
import type { LeadActionRow } from "./lead-action-types";

export type { LeadActionRow } from "./lead-action-types";

export function LeadsToolbar() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
        >
          <Download className="size-4" />
          Export CSV
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
        >
          <FileSpreadsheet className="size-4" />
          Export Excel
        </button>
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
  const [modal, setModal] = useState<"delete" | "detail" | "edit" | null>(null);

  return (
    <>
      <div className="flex justify-end gap-2">
        <IconButton label="View" onClick={() => setModal("detail")}>
          <Eye className="size-4" />
        </IconButton>
        <IconButton label="Edit" onClick={() => setModal("edit")}>
          <Pencil className="size-4" />
        </IconButton>
        <IconButton label="Delete" danger onClick={() => setModal("delete")}>
          <Trash2 className="size-4" />
        </IconButton>
      </div>

      {modal === "detail" ? (
        <LeadDetailModal
          lead={lead}
          source={source}
          status={status}
          onClose={() => setModal(null)}
          onEdit={() => setModal("edit")}
        />
      ) : null}

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
