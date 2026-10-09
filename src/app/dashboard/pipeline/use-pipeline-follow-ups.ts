"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PipelineFollowUp = {
  id: string;
  leadId: string;
  title: string;
  dueAt: string;
  status: string;
};

export function nextFollowUps(tasks: PipelineFollowUp[]) {
  const result: Record<string, PipelineFollowUp> = {};
  for (const task of tasks) {
    if (task.status !== "upcoming" || !Number.isFinite(Date.parse(task.dueAt))) continue;
    if (!result[task.leadId] || Date.parse(task.dueAt) < Date.parse(result[task.leadId].dueAt)) result[task.leadId] = task;
  }
  return result;
}

export function usePipelineFollowUps() {
  const [tasks, setTasks] = useState<Record<string, PipelineFollowUp>>({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const request = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch("/api/follow-ups", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Unable to load follow-ups");
      const payload = await response.json() as { reminders: PipelineFollowUp[] };
      if (!controller.signal.aborted) {
        setTasks(nextFollowUps(payload.reminders));
        setLoaded(true);
        setError("");
      }
    } catch {
      if (!controller.signal.aborted) setError("Unable to refresh follow-ups. Try again.");
    }
  }, []);
  useEffect(() => {
    const initialLoad = window.setTimeout(() => { void refresh(); }, 0);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => { window.clearTimeout(initialLoad); request.current?.abort(); window.removeEventListener("focus", onFocus); };
  }, [refresh]);
  return { tasks, error, refresh, loaded };
}
