"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { opportunityDialogStyles as styles } from "./opportunity-dialog-styles";
import type { PipelineLead } from "./pipeline-types";

export function PipelineEditDialog({ lead, onClose, onUpdated }: {
  lead: PipelineLead;
  onClose: () => void;
  onUpdated: (lead: PipelineLead) => void;
}) {
  const [value, setValue] = useState(String(lead.value));
  const [owner, setOwner] = useState(lead.owner);
  const [date, setDate] = useState(lead.dueDateValue ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, dealValue: Number(value), owner: owner.trim(), dueDate: date || null }),
      });
      const result = await response.json() as { lead?: PipelineLead; error?: string };
      if (!response.ok || !result.lead) throw new Error(result.error ?? "Unable to save this opportunity.");
      onUpdated(result.lead);
      onClose();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save this opportunity.");
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open onOpenChange={(open) => { if (!open && !saving) onClose(); }}>
    <DialogContent className={styles.content}>
      <DialogHeader className={styles.header}>
        <DialogTitle className={styles.title}>Edit opportunity</DialogTitle>
        <DialogDescription className="break-words">{lead.name} · {lead.company}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="flex min-h-0 flex-col">
        <div className={styles.body}>
          <label className={styles.label}>Owner<Input className={styles.field} required maxLength={200} value={owner} onChange={(event) => setOwner(event.target.value)} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={styles.label}>Deal value (€)<Input className={styles.field} required type="number" min="0" step="0.01" value={value} onChange={(event) => setValue(event.target.value)} /></label>
            <label className={styles.label}>Due date<Input className={styles.field} type="date" value={date} onChange={(event) => setDate(event.target.value)} /><span className="block text-xs font-normal text-slate-500">Optional</span></label>
          </div>
          {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </div>
        <DialogFooter className={styles.footer}>
          <Button type="button" variant="ghost" disabled={saving} onClick={onClose}>Cancel</Button>
          <Button className={styles.primary} type="submit" disabled={saving || !owner.trim() || !value}>{saving ? "Saving…" : "Save changes"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
