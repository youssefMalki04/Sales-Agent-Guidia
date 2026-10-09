"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { opportunityDialogStyles as styles } from "./opportunity-dialog-styles";

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
    <Dialog open onOpenChange={(open) => { if (!open && !creating) onClose(); }}>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>New opportunity</DialogTitle>
          <DialogDescription>Add verified commercial information.</DialogDescription>
        </DialogHeader>
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className={styles.body}>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <OpportunityField label="Name" value={opportunity.name} onChange={(name) => setOpportunity((current) => ({ ...current, name }))} />
          <OpportunityField label="Professional email" type="email" value={opportunity.email} onChange={(email) => setOpportunity((current) => ({ ...current, email }))} />
          <OpportunityField label="Company" value={opportunity.company} onChange={(company) => setOpportunity((current) => ({ ...current, company }))} />
          <OpportunityField label="Deal value (€)" type="number" value={opportunity.dealValue} onChange={(dealValue) => setOpportunity((current) => ({ ...current, dealValue }))} />
          <div className="sm:col-span-2"><OpportunityField label="Owner" value={opportunity.owner} onChange={(owner) => setOpportunity((current) => ({ ...current, owner }))} /></div>
        </div>
        </div>
        <DialogFooter className={styles.footer}>
          <Button type="button" variant="ghost" disabled={creating} onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={creating} className={styles.primary}>{creating ? "Creating…" : "Create opportunity"}</Button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  );
}

function OpportunityField({ label, onChange, type = "text", value }: { label: string; onChange: (value: string) => void; type?: "email" | "number" | "text"; value: string }) {
  return <label className={styles.label}><span className="block">{label}</span><input required type={type} min={type === "number" ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className={styles.field} /></label>;
}
