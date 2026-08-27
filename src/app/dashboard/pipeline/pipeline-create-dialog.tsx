"use client";

import { FormEvent, useState } from "react";

import type { PipelineLead } from "./pipeline-types";

const emptyOpportunity = {
  company: "",
  dealValue: "",
  email: "",
  name: "",
  owner: "",
};

type PipelineCreateDialogProps = {
  onClose: () => void;
  onCreated: (lead: PipelineLead) => void;
  onError: (message: string) => void;
};

export function PipelineCreateDialog({ onClose, onCreated, onError }: PipelineCreateDialogProps) {
  const [creating, setCreating] = useState(false);
  const [opportunity, setOpportunity] = useState(emptyOpportunity);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onError("");
    setCreating(true);
    try {
      const response = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...opportunity, dealValue: Number(opportunity.dealValue) }),
      });
      if (!response.ok) {
        onError("Unable to create this opportunity. Check all fields.");
        return;
      }
      const result = await response.json() as { lead: PipelineLead };
      onCreated(result.lead);
      onClose();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <form onSubmit={submit} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="text-xl font-semibold text-slate-950">New opportunity</h2><p className="mt-1 text-sm text-slate-500">Add verified commercial information.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100" aria-label="Close">×</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <OpportunityField label="Name" value={opportunity.name} onChange={(name) => setOpportunity((current) => ({ ...current, name }))} />
          <OpportunityField label="Professional email" type="email" value={opportunity.email} onChange={(email) => setOpportunity((current) => ({ ...current, email }))} />
          <OpportunityField label="Company" value={opportunity.company} onChange={(company) => setOpportunity((current) => ({ ...current, company }))} />
          <OpportunityField label="Deal value (€)" type="number" value={opportunity.dealValue} onChange={(dealValue) => setOpportunity((current) => ({ ...current, dealValue }))} />
          <div className="sm:col-span-2"><OpportunityField label="Owner" value={opportunity.owner} onChange={(owner) => setOpportunity((current) => ({ ...current, owner }))} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600">Cancel</button>
          <button type="submit" disabled={creating} className="h-10 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white disabled:opacity-50">{creating ? "Creating…" : "Create opportunity"}</button>
        </div>
      </form>
    </div>
  );
}

function OpportunityField({ label, onChange, type = "text", value }: { label: string; onChange: (value: string) => void; type?: "email" | "number" | "text"; value: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-slate-500">{label}</span><input required type={type} min={type === "number" ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]" /></label>;
}
