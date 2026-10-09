"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { CalendarClock, Check } from "lucide-react";
import { usePipelineFollowUps } from "@/app/dashboard/pipeline/use-pipeline-follow-ups";
import { LeadFollowUpAction } from "./lead-follow-up-action";
import { EditPreviewFollowUp } from "./edit-preview-follow-up";

const FollowUps = createContext<ReturnType<typeof usePipelineFollowUps> | null>(null);
export function LeadsNextActionProvider({ children }: { children: ReactNode }) {
  const followUps = usePipelineFollowUps();
  return <FollowUps.Provider value={followUps}>{children}</FollowUps.Provider>;
}

export function LeadsNextAction({ leadId, name, editable = false }: { leadId: string; name: string; editable?: boolean }) {
  const followUps = useContext(FollowUps);
  const [open, setOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const [completing, setCompleting] = useState(false);
  const completionLock = useRef(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [completionError, setCompletionError] = useState("");
  const [lastCompletedId, setLastCompletedId] = useState<string | null>(null);

  async function complete(taskId: string, undo = false) {
    if (completionLock.current || !followUps) return;
    completionLock.current = true;
    setCompleting(true);
    setCompletionMessage("");
    setCompletionError("");
    try {
      const response = await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: undo ? "upcoming" : "completed" }),
      });
      if (!response.ok) throw new Error("Impossible de terminer la relance. Réessayez.");
      setLastCompletedId(undo ? null : taskId);
      setCompletionMessage(undo ? "Relance remise en cours." : "Relance terminée.");
      await followUps.refresh();
    } catch {
      setCompletionError("La mise à jour n’a pas pu être confirmée. Actualisez avant de réessayer.");
    } finally {
      completionLock.current = false;
      setCompleting(false);
    }
  }

  const completionFeedback = <>
    {completionMessage ? <p role="status" className="mt-2 text-xs text-emerald-700">{completionMessage}</p> : null}
    {editable && lastCompletedId ? <button type="button" disabled={completing} onClick={() => void complete(lastCompletedId, true)} aria-label="Annuler la dernière relance terminée" className="mt-1 rounded px-1 py-1 text-xs font-medium text-indigo-600 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-50">
      {completing ? "Enregistrement…" : "Annuler"}
    </button> : null}
    {completionError ? <p role="alert" className="mt-2 text-xs text-red-600">{completionError}</p> : null}
  </>;
  if (!followUps) return null;
  if (followUps.error) return <div className="text-xs text-amber-700">
    {completionFeedback}
    <span>Follow-up unavailable</span>
    <button type="button" onClick={() => void followUps.refresh()} className="ml-2 rounded px-1 py-1 underline">Retry</button>
  </div>;
  if (!followUps.loaded) return <span className="text-xs text-slate-400">Loading…</span>;
  const task = followUps.tasks[leadId];
  if (task) {
    const overdue = Date.parse(task.dueAt) < now;
    return <div><Link href={`/dashboard/tasks?taskId=${encodeURIComponent(task.id)}`} className={`${editable ? "w-full" : "w-44"} block rounded-md text-xs focus-visible:outline-2 focus-visible:outline-indigo-500`}>
      <span title={task.title} className={`block ${editable ? "break-words" : "truncate"} font-medium text-slate-700 hover:text-indigo-600`}>{task.title}</span>
      <time dateTime={task.dueAt} className={`mt-1 block ${overdue ? "text-rose-600" : "text-slate-500"}`}>
        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(task.dueAt))}
      </time>
      {overdue ? <span className="mt-0.5 block text-[10px] text-rose-600">Overdue</span> : null}
    </Link>
      {editable ? <EditPreviewFollowUp key={task.id} taskId={task.id} leadId={leadId} onUpdated={followUps.refresh} /> : null}
      {editable ? <button type="button" disabled={completing} onClick={() => void complete(task.id)} className="mt-2 inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-50">
        <Check className="size-3.5" aria-hidden="true" />{completing ? "Enregistrement…" : "Terminer la relance"}
      </button> : null}
      {completionFeedback}
    </div>;
  }
  return <>
    {editable ? <p className="mb-3 text-xs text-slate-500">Aucune relance en cours.</p> : null}
    {completionFeedback}
    <button type="button" onClick={() => setOpen(true)} aria-label={`Plan follow-up for ${name}`} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 px-2.5 py-2 text-xs font-medium text-[#5964d6] hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500">
      <CalendarClock className="size-3.5" />Plan follow-up
    </button>
    {open ? <LeadFollowUpAction leadId={leadId} leadName={name} open onOpenChange={setOpen} onCreated={() => void followUps.refresh()} /> : null}
  </>;
}
