"use client";
import { usePastDateConfirmation } from "@/components/leadia/use-past-date-confirmation";
import { DuplicateTaskLink, duplicateTaskId, type TaskCreationResponse } from "@/components/leadia/duplicate-task-link";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialMembers } from "../team/team-data";
import { taskDialogStyles as styles } from "./task-dialog-styles";

type LeadChoice = {
  company: string | null;
  email: string | null;
  id: string;
  name: string | null;
};

export function CreateTaskDialog({
  onCreated,
}: {
  onCreated: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState<LeadChoice[]>([]);
  const [leadId, setLeadId] = useState("");
  const [title, setTitle] = useState("Commercial follow-up");
  const [dueAt, setDueAt] = useState("");
  const pastDate = usePastDateConfirmation(dueAt);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assigneeEmail, setAssigneeEmail] = useState(initialMembers[0].email);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingTaskId, setExistingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || leads.length) return;
    let active = true;
    fetch("/api/leads", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as {
          error?: string;
          leads?: LeadChoice[];
        };
        if (!response.ok)
          throw new Error(payload.error ?? "Unable to load leads");
        return payload.leads ?? [];
      })
      .then((items) => {
        if (!active) return;
        setLeads(items);
        setLeadId((current) => current || items[0]?.id || "");
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load leads",
          );
      })
      .finally(() => {
        if (active) setLoadingLeads(false);
      });
    return () => {
      active = false;
    };
  }, [leads.length, open]);

  async function createTask() {
    if (!leadId || !title.trim() || !dueAt) return;
    if (saving || !pastDate.check()) return;
    setSaving(true);
    setError("");
    setExistingTaskId(null);
    try {
      const assignee = initialMembers.find(
        (member) => member.email === assigneeEmail,
      );
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({
          assignedTo: assignee?.name ?? "",
          assignedToEmail: assignee?.email ?? "",
          dueAt: new Date(dueAt).toISOString(),
          leadId,
          notes,
          priority,
          title,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as TaskCreationResponse;
      setExistingTaskId(duplicateTaskId(payload));
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to create task");
      await onCreated();
      setOpen(false);
      setDueAt("");
      setNotes("");
      setTitle("Commercial follow-up");
      setPriority("medium");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create task",
      );
    } finally {
      setSaving(false);
    }
  }

  function openDialog() {
    pastDate.reset();
    setError("");
    if (!leads.length) setLoadingLeads(true);
    setOpen(true);
  }

  return (
    <>
      <Button
        onClick={openDialog}
        className="rounded-xl bg-[#5964d6] shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
      >
        <Plus className="size-4" /> New task
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={styles.content}>
          <DialogHeader className={styles.header}>
            <DialogTitle className={styles.title}>
              Create a new task
            </DialogTitle>
            <DialogDescription>
              Schedule a commercial action for a lead.
            </DialogDescription>
          </DialogHeader>
          <div className={styles.body}>
            <label className={styles.label}>
              Assigned to
              <select
                value={assigneeEmail}
                onChange={(event) => setAssigneeEmail(event.target.value)}
                className={styles.field}
              >
                <option value="">Unassigned</option>
                {initialMembers
                  .filter((member) => member.status === "active")
                  .map((member) => (
                    <option key={member.id} value={member.email}>
                      {member.name} — {member.role}
                    </option>
                  ))}
              </select>
            </label>
            <label className={styles.label}>
              Lead
              <select
                value={leadId}
                onChange={(event) => setLeadId(event.target.value)}
                disabled={loadingLeads}
                className={styles.field}
              >
                {loadingLeads ? <option>Loading leads…</option> : null}
                {!loadingLeads && !leads.length ? (
                  <option value="">No leads available</option>
                ) : null}
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name || lead.company || lead.email || "Unnamed lead"}
                    {lead.email ? ` — ${lead.email}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Action
              <Input
                className={styles.field}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <label className={styles.label}>
              Priority
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className={styles.field}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label className={styles.label}>
              Date and time
              <Input
                className={styles.field}
                type="datetime-local"
                value={dueAt}
                onChange={(event) => { setDueAt(event.target.value); pastDate.reset(); }}
              />
            </label>
            </div>
            <label className={styles.label}>
              Notes <span className="font-normal text-slate-400">(optional)</span>
              <Textarea
                className={styles.notes}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add useful context for this task…"
              />
            </label>
            {error ? (
              <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><p>{error}</p><DuplicateTaskLink taskId={existingTaskId} /></div>
            ) : null}
          </div>
          {pastDate.warning}
          <DialogFooter className={styles.footer}>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className={styles.primary}
              disabled={saving || !leadId || !title.trim() || !dueAt}
              onClick={createTask}
            >
              {saving ? "Creating…" : "Create task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
