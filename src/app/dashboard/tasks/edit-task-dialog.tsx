"use client";
import { usePastDateConfirmation } from "@/components/leadia/use-past-date-confirmation";

import { useEffect, useState } from "react";
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
import type { FollowUpTask } from "./tasks-workspace";
import { initialMembers } from "../team/team-data";
import { taskDialogStyles as styles } from "./task-dialog-styles";

type LeadChoice = {
  company: string | null;
  email: string | null;
  id: string;
  name: string | null;
};

export function EditTaskDialog({
  open,
  task,
  onOpenChange,
  onUpdated,
}: {
  open: boolean;
  task: FollowUpTask;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void>;
}) {
  const [leads, setLeads] = useState<LeadChoice[]>([]);
  const [leadId, setLeadId] = useState(task.leadId);
  const [title, setTitle] = useState(task.title);
  const [dueAt, setDueAt] = useState(toLocalDateTime(task.dueAt));
  const pastDate = usePastDateConfirmation(dueAt);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [assigneeEmail, setAssigneeEmail] = useState(
    task.assignedToEmail ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        if (active) setLeads(items);
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load leads",
          );
      });
    return () => {
      active = false;
    };
  }, [leads.length, open]);

  async function updateTask() {
    if (!leadId || !title.trim() || !dueAt) return;
    if (saving || !pastDate.check()) return;
    setSaving(true);
    setError("");
    try {
      const assignee = initialMembers.find(
        (member) => member.email === assigneeEmail,
      );
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({
          assignedTo: assignee?.name ?? "",
          assignedToEmail: assignee?.email ?? "",
          dueAt: new Date(dueAt).toISOString(),
          id: task.id,
          leadId,
          notes,
          priority,
          title,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to update task");
      await onUpdated();
      onOpenChange(false);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update task",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>Edit task</DialogTitle>
          <DialogDescription>
            Update the next commercial action.
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
              className={styles.field}
            >
              {!leads.length && task.lead ? (
                <option value={task.leadId}>
                  {task.lead.name ||
                    task.lead.company ||
                    task.lead.email ||
                    "Current lead"}
                </option>
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
              onChange={(event) =>
                setPriority(event.target.value as FollowUpTask["priority"])
              }
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
            />
          </label>
          {error ? (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
        </div>
        {pastDate.warning}
        <DialogFooter className={styles.footer}>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
              className={styles.primary}
            disabled={saving || !leadId || !title.trim() || !dueAt}
            onClick={updateTask}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toLocalDateTime(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
