"use client";

import { type ReactNode, useState } from "react";
import {
  Download,
  Eye,
  FileSpreadsheet,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type LeadActionRow = {
  company: string | null;
  conversion_score: number | null;
  country: string | null;
  created_at: string;
  crm_status: string | null;
  email: string | null;
  id: string;
  lead_temperature: string | null;
  name: string | null;
  need: string | null;
  sector: string | null;
  suggested_next_action: string | null;
  summary: string | null;
  urgency: string | null;
};

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
        <ConfirmDeleteModal onClose={() => setModal(null)} />
      ) : null}
    </>
  );
}

function LeadFormModal({
  lead,
  mode,
  onClose,
  source,
  status,
}: {
  lead?: LeadActionRow;
  mode: "create" | "edit";
  onClose: () => void;
  source?: string;
  status?: string;
}) {
  return (
    <ModalFrame onClose={onClose}>
      <form className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[#202026]">
          {mode === "create" ? "Create lead" : "Edit lead"}
        </h2>

        <FormInput
          label="Name"
          placeholder="John Doe"
          defaultValue={lead?.name ?? ""}
          autoFocus
        />
        <FormInput
          label="Email"
          placeholder="john@example.com"
          defaultValue={lead?.email ?? ""}
        />
        <FormInput label="Phone" placeholder="+33 6 12 34 56 78" />
        <FormInput
          label="Company"
          placeholder="Acme Corp"
          defaultValue={lead?.company ?? ""}
        />

        <FormSelect
          label="Status"
          defaultValue={status ?? "New"}
          options={["New", "Qualified", "Won", "Failed"]}
        />
        <FormSelect
          label="Source"
          defaultValue={source ?? "Manual"}
          options={["Manual", "Agent", "Website"]}
        />

        <label>
          <span className="mb-1 block text-sm font-semibold text-[#4f4f59]">
            Notes
          </span>
          <textarea
            rows={2}
            defaultValue={lead?.summary ?? ""}
            placeholder="Notes about this lead..."
            className="w-full resize-y rounded-md border border-[#dedee4] bg-white px-3 py-2 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
          />
        </label>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#dedee4] bg-white px-5 text-sm font-semibold text-[#3f3f46] hover:bg-[#f6f6f7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            Save
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}

function LeadDetailModal({
  lead,
  onClose,
  onEdit,
  source,
  status,
}: {
  lead: LeadActionRow;
  onClose: () => void;
  onEdit: () => void;
  source: string;
  status: string;
}) {
  return (
    <ModalFrame onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-[#202026]">Lead detail</h2>

        <div className="mt-5 divide-y divide-[#ededf0]">
          <DetailRow label="Name" value={lead.name} />
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="Phone" />
          <DetailRow label="Company" value={lead.company} />
          <DetailRow label="Source" value={source} />
          <DetailRow label="Status" value={status} />
          <DetailRow label="UTM Source" />
          <DetailRow label="UTM Medium" />
          <DetailRow label="UTM Campaign" />
          <DetailRow label="Referrer" />
          <DetailRow label="Country" value={lead.country} />
          <DetailRow label="City" />
          <DetailRow label="Browser" />
        </div>

        <div className="mt-4 rounded-md border border-[#e3e3e8] bg-[#f7f7f8] p-4">
          <p className="text-sm font-semibold text-[#2f2f36]">AI Insights</p>
          <p className="mt-1 text-sm text-[#73737d]">
            {lead.summary ||
              lead.suggested_next_action ||
              "Not yet analyzed (conversation may still be active)"}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#dedee4] bg-white px-5 text-sm font-semibold text-[#3f3f46] hover:bg-[#f6f6f7]"
          >
            <Pencil className="size-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#dedee4] bg-white px-5 text-sm font-semibold text-[#3f3f46] hover:bg-[#f6f6f7]"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

function ConfirmDeleteModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalFrame onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-[#202026]">Delete lead</h2>
        <p className="mt-3 text-sm leading-6 text-[#686872]">
          Confirm delete this lead?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#dedee4] bg-white px-5 text-sm font-semibold text-[#3f3f46] hover:bg-[#f6f6f7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

function ModalFrame({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 px-4 py-20 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[470px] rounded-3xl bg-white p-6 shadow-xl">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-[#686872] hover:bg-[#f4f4f5]"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function FormInput({
  autoFocus,
  defaultValue,
  label,
  placeholder,
}: {
  autoFocus?: boolean;
  defaultValue?: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold text-[#4f4f59]">
        {label}
      </span>
      <input
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
      />
    </label>
  );
}

function FormSelect({
  defaultValue,
  label,
  options,
}: {
  defaultValue: string;
  label: string;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold text-[#4f4f59]">
        {label}
      </span>
      <select
        defaultValue={defaultValue}
        className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-center gap-4 py-3 text-sm">
      <span className="text-[#7b7b85]">{label}</span>
      <span className="truncate text-right font-semibold text-[#303038]">
        {value || "-"}
      </span>
    </div>
  );
}

function IconButton({
  children,
  danger,
  label,
  onClick,
}: {
  children: ReactNode;
  danger?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-[#55555f] hover:bg-[#f4f4f5]",
        danger && "text-red-500 hover:bg-red-50",
      )}
    >
      {children}
    </button>
  );
}
