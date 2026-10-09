"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Task = { id: string; title: string; status: string; dueAt: string; assignedTo?: string | null };
export function MeetingTasks({ meetingId, leadId }: { meetingId: string; leadId: string }) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [now] = useState(() => Date.now());
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/follow-ups?meetingId=${encodeURIComponent(meetingId)}&leadId=${encodeURIComponent(leadId)}`, { signal: controller.signal, cache: "no-store" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok || !Array.isArray(payload.reminders)) throw new Error();
      if (!controller.signal.aborted) setTasks(payload.reminders);
    }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [meetingId, leadId, attempt]);
  return <div className="mt-4 space-y-2">
    <div className="flex justify-between gap-2"><h4 className="text-xs font-semibold">Tâches de ce rendez-vous</h4><button type="button" className="text-xs text-indigo-600" onClick={() => { setError(false); setTasks(null); setAttempt((value) => value + 1); }}>Actualiser</button></div>
    {error ? <p role="alert" className="text-xs text-red-600">Tâches indisponibles. Vérifiez la migration puis réessayez.</p> : tasks === null ? <p className="text-xs text-slate-500">Chargement…</p> : !tasks.length ? <p className="text-xs text-slate-500">Aucune tâche rattachée. Les anciennes restent accessibles dans Tasks.</p> : <ul className="space-y-2">{tasks.map((task) => <li key={task.id} className="rounded-lg border p-3 text-xs"><Link href={`/dashboard/tasks?taskId=${encodeURIComponent(task.id)}`} className="font-medium text-indigo-600 underline">{task.title}</Link><p className="mt-1">{new Date(task.dueAt).toLocaleString("fr-FR")} · {task.status === "completed" ? "Terminée" : new Date(task.dueAt).getTime() < now ? "En retard" : "À faire"}</p><p>{task.assignedTo || "Non attribuée"}</p></li>)}</ul>}
  </div>;
}
