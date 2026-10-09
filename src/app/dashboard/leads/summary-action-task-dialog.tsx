"use client";
import { usePastDateConfirmation } from "@/components/leadia/use-past-date-confirmation";
import { DuplicateTaskLink, duplicateTaskId, type TaskCreationResponse } from "@/components/leadia/duplicate-task-link";

import { useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";

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
import { initialMembers, STORAGE_KEY, type TeamMember } from "../team/team-data";

export function SummaryActionTaskDialog({
  action,
  leadId,
  summaryId,
  onClose,
  onCreated,
}: {
  action: string | null;
  leadId: string;
  summaryId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState(action ?? "");
  const [dueAt, setDueAt] = useState(tomorrowAtNine);
  const pastDate = usePastDateConfirmation(dueAt);
  const [priority, setPriority] = useState("high");
  const [members] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as TeamMember[];
    } catch {
      // Keep demo members if local storage is unavailable.
    }
    return initialMembers;
  });
  const [assigneeEmail, setAssigneeEmail] = useState(initialMembers[0].email);
  const [notes, setNotes] = useState("Created from the AI commercial brief.");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingTaskId, setExistingTaskId] = useState<string | null>(null);

  async function createTask() {
    if (!action || !title.trim() || !dueAt) return;
    if (saving || !pastDate.check()) return;
    setSaving(true);
    setError("");
    setExistingTaskId(null);
    try {
      const assignee = members.find((member) => member.email === assigneeEmail);
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({
          assignedTo: assignee?.name ?? "",
          assignedToEmail: assignee?.email ?? "",
          dueAt: new Date(dueAt).toISOString(),
          leadId,
          notes,
          priority,
          sourceAction: action,
          sourceSummaryId: summaryId,
          title: title.trim(),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as TaskCreationResponse;
      setExistingTaskId(duplicateTaskId(payload));
      if (!response.ok) throw new Error(payload.error ?? "Unable to create task");
      onCreated();
      onClose();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(action)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[520px]">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-[#5964d6]"><CalendarClock className="size-5" /></span>
          <DialogTitle>Create task from next action</DialogTitle>
          <DialogDescription>Schedule and assign this recommendation.</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          <label className="block space-y-2 text-sm font-semibold">Action<Input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm font-semibold">Date and time<Input type="datetime-local" value={dueAt} onChange={(event) => { setDueAt(event.target.value); pastDate.reset(); }} /></label>
            <label className="block space-y-2 text-sm font-semibold">Priority<select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
          </div>
          <label className="block space-y-2 text-sm font-semibold">Assigned to<select value={assigneeEmail} onChange={(event) => setAssigneeEmail(event.target.value)} className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="">Unassigned</option>{members.filter((member) => member.status === "active").map((member) => <option key={member.id} value={member.email}>{member.name}</option>)}</select></label>
          <label className="block space-y-2 text-sm font-semibold">Notes<Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-20" /></label>
          {error ? <div role="alert" className="text-sm font-semibold text-red-600"><p>{error}</p><DuplicateTaskLink taskId={existingTaskId} /></div> : null}
        </div>
        {pastDate.warning}
        <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-slate-100 bg-white px-5 py-3 sm:px-6">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={createTask} disabled={saving || !title.trim() || !dueAt}><CheckCircle2 className="size-4" /> {saving ? "Creating…" : "Create task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function tomorrowAtNine() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}
