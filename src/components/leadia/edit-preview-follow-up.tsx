"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { EditTaskDialog } from "@/app/dashboard/tasks/edit-task-dialog";
import type { FollowUpTask } from "@/app/dashboard/tasks/tasks-workspace";

export function EditPreviewFollowUp({ taskId, leadId, onUpdated }: {
  taskId: string;
  leadId: string;
  onUpdated: () => Promise<void>;
}) {
  const [task, setTask] = useState<FollowUpTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function edit() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/follow-ups?taskId=${encodeURIComponent(taskId)}`, { cache: "no-store", signal: controller.signal });
      const payload = await response.json() as { reminders?: FollowUpTask[] };
      if (!response.ok) throw new Error("Impossible de charger la relance. Réessayez.");
      const current = payload.reminders?.find((item) => item.id === taskId && item.leadId === leadId && item.status === "upcoming");
      if (!current) throw new Error("Cette relance n’est plus disponible. Actualisez l’aperçu.");
      if (!controller.signal.aborted) setTask(current);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Impossible de charger la relance.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  return <div className="mt-3">
    <button ref={trigger} type="button" disabled={loading} onClick={() => void edit()} className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50">
      <Pencil className="size-3.5" aria-hidden="true" />{loading ? "Chargement…" : "Modifier"}
    </button>
    {error ? <p role="alert" className="mt-2 text-xs text-red-600">{error}</p> : null}
    {message ? <p role="status" className="mt-2 text-xs text-emerald-700">{message}</p> : null}
    {task ? <EditTaskDialog open task={task} onOpenChange={(open) => {
      if (!open) { setTask(null); trigger.current?.focus(); }
    }} onUpdated={async () => { await onUpdated(); setMessage("Relance modifiée."); }} /> : null}
  </div>;
}
