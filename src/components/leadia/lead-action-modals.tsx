"use client";

import { type FormEvent, useState } from "react";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DetailRow,
  FormInput,
  FormSelect,
  ModalFrame,
} from "./lead-action-fields";
import type { LeadActionRow } from "./lead-action-types";

export function LeadFormModal({
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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lead?.id,
        name: form.get("name"),
        email: form.get("email"),
        company: form.get("company"),
        status: String(form.get("status") ?? "new").toLowerCase(),
        summary: form.get("summary"),
      }),
    });
    const result = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setError(result.error ?? "Unable to save this lead.");
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <ModalFrame onClose={onClose}>
      <form onSubmit={saveLead} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[#202026]">
          {mode === "create" ? "Create lead" : "Edit lead"}
        </h2>

        <FormInput
          name="name"
          label="Name"
          placeholder="John Doe"
          defaultValue={lead?.name ?? ""}
          autoFocus
        />
        <FormInput
          name="email"
          label="Email"
          placeholder="john@example.com"
          defaultValue={lead?.email ?? ""}
        />
        <FormInput name="phone" label="Phone" placeholder="+33 6 12 34 56 78" />
        <FormInput
          name="company"
          label="Company"
          placeholder="Acme Corp"
          defaultValue={lead?.company ?? ""}
        />

        <FormSelect
          name="status"
          label="Status"
          defaultValue={status ?? "New"}
          options={["New", "Qualified", "Won", "Failed"]}
        />
        <FormSelect
          name="source"
          label="Source"
          defaultValue={source ?? "Manual"}
          options={["Manual", "Agent", "Website"]}
        />
        <label>
          <span className="mb-1 block text-sm font-semibold text-[#4f4f59]">
            Notes
          </span>
          <textarea
            name="summary"
            rows={2}
            defaultValue={lead?.summary ?? ""}
            placeholder="Notes about this lead..."
            className="w-full resize-y rounded-md border border-[#dedee4] bg-white px-3 py-2 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
          />
        </label>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#dedee4] bg-white px-5 text-sm font-semibold text-[#3f3f46] hover:bg-[#f6f6f7]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-10 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}

export function LeadDetailModal({
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
          <Link
            href={`/dashboard/leads/${encodeURIComponent(lead.id)}`}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            Open full profile
          </Link>
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

export function ConfirmDeleteModal({
  leadId,
  onClose,
}: {
  leadId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function deleteLead() {
    setDeleting(true);
    setError(null);
    const response = await fetch(
      `/api/leads?id=${encodeURIComponent(leadId)}`,
      { method: "DELETE" },
    );
    const result = (await response.json()) as { error?: string };
    setDeleting(false);
    if (!response.ok) {
      setError(result.error ?? "Unable to delete this lead.");
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <ModalFrame onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold text-[#202026]">Delete lead</h2>
        <p className="mt-3 text-sm leading-6 text-[#686872]">
          Confirm delete this lead?
        </p>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
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
            onClick={deleteLead}
            disabled={deleting}
            className="h-10 rounded-md bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
