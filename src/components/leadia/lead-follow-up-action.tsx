"use client";
import { usePastDateConfirmation } from "@/components/leadia/use-past-date-confirmation";
import { DuplicateTaskLink, duplicateTaskId, type TaskCreationResponse } from "@/components/leadia/duplicate-task-link";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { initialMembers } from "@/app/dashboard/team/team-data";

export function LeadFollowUpAction({
  leadId,
  meetingId,
  leadName,
  open: controlledOpen,
  onOpenChange,
  onCreated,
  initialTitle = "Commercial follow-up",
  initialNotes = "",
  withAssignee = false,
}: {
  leadId: string;
  meetingId?: string;
  leadName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreated?: () => void;
  initialTitle?: string;
  initialNotes?: string;
  withAssignee?: boolean;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  function setOpen(value: boolean) {
    pastDate.reset();
    setInternalOpen(value);
    onOpenChange?.(value);
  }
  const [title, setTitle] = useState(initialTitle);
  const [dueAt, setDueAt] = useState("");
  const pastDate = usePastDateConfirmation(dueAt);
  const [notes, setNotes] = useState(initialNotes);
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingTaskId, setExistingTaskId] = useState<string | null>(null);

  async function schedule() {
    if (!dueAt || !title.trim() || saving) return;
    if (saving || !pastDate.check()) return;
    setSaving(true);
    setError("");
    setExistingTaskId(null);
    try {
      const response = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dueAt: new Date(dueAt).toISOString(),
          leadId,
          meetingId,
          notes,
          title,
          ...(withAssignee ? {
            assignedToEmail: assigneeEmail,
            assignedTo: initialMembers.find((member) => member.email === assigneeEmail)?.name ?? "",
          } : {}),
        }),
      });
      const payload = (await response.json()) as TaskCreationResponse;
      setExistingTaskId(duplicateTaskId(payload));
      if (!response.ok) {
        setError(payload.error ?? "Unable to schedule this follow-up");
        return;
      }
      setOpen(false);
      setDueAt("");
      setNotes(initialNotes);
      onCreated?.();
      router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {controlledOpen === undefined ? <Button
        className="rounded-xl bg-white"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <CalendarClock className="size-4" /> Follow-up
      </Button> : null}
      <Dialog open={open} onOpenChange={(value) => { if (!saving) setOpen(value); }}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[520px]">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle className="text-xl font-bold">
              Schedule a follow-up
            </DialogTitle>
            <DialogDescription>
              Plan the next action for {leadName}.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {withAssignee ? <label className="block space-y-2 text-sm font-semibold">Responsable
              <select value={assigneeEmail} disabled={saving} onChange={(event) => setAssigneeEmail(event.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="">Non attribuée</option>
                {initialMembers.filter((member) => member.status === "active").map((member) => <option key={member.id} value={member.email}>{member.name}</option>)}
              </select>
            </label> : null}
            <label className="block space-y-2 text-sm font-semibold">
              Action
              <Input
                value={title}
                maxLength={300}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold">
              Date and time
              <Input
                type="datetime-local"
                value={dueAt}
                onChange={(event) => { setDueAt(event.target.value); pastDate.reset(); }}
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold">
              Notes
              <Textarea
                maxLength={2000}
                className="min-h-24"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add context for the next action…"
              />
            </label>
            {error ? (
              <div role="alert" className="text-sm font-semibold text-red-600"><p>{error}</p><DuplicateTaskLink taskId={existingTaskId} /></div>
            ) : null}
          </div>
          {pastDate.warning}
          <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t bg-white px-6 py-4">
            <Button variant="ghost" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving || !title.trim() || !dueAt}
              onClick={schedule}
            >
              <CheckCircle2 className="size-4" />{" "}
              {saving ? "Saving…" : "Schedule follow-up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
