"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Meeting, MeetingStatus } from "./meeting-data";
import { localMeetingDate, meetingMonthRange } from "@/lib/meetings/dates";
import { useMeetingOwners } from "./use-meeting-owners";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedMonth, setSelectedMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | MeetingStatus>("all");
  const [owner, setOwner] = useState("all");
  const [period, setPeriod] = useState("all");
  const [withoutReport, setWithoutReport] = useState(false);
  const [archive, setArchive] = useState("active");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const owners = useMeetingOwners();
  const abort = useRef<AbortController | null>(null);
  const writeLock = useRef(false);
  const mutationVersion = useRef(0);
  const [updating, setUpdating] = useState(false);

  const refresh = useCallback(async () => {
    if (writeLock.current) return;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const version = mutationVersion.current;
    setLoading(true); setError(""); setNow(Date.now());
    try {
      const { from, to } = meetingMonthRange(selectedMonth);
      const rows: Meeting[] = [];
      let offset: number | null = 0;
      do {
        const response = await fetch(`/api/meetings?from=${from}&to=${to}&archive=${archive}&reports=1&limit=200&offset=${offset}`, { cache: "no-store", signal: controller.signal });
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload.meetings)) throw new Error(payload.error || "Réponse invalide");
        rows.push(...payload.meetings);
        const nextOffset: unknown = payload.nextOffset;
        if (nextOffset !== null && nextOffset !== undefined && (typeof nextOffset !== "number" || nextOffset <= offset)) throw new Error("Pagination invalide");
        offset = typeof nextOffset === "number" ? nextOffset : null;
      } while (offset !== null);
      if (!controller.signal.aborted && version === mutationVersion.current) setMeetings(rows);
    } catch {
      if (!controller.signal.aborted) setError("Impossible de charger les rendez-vous. Vérifiez la connexion et réessayez. Si le problème persiste, vérifiez les migrations Meetings côté serveur.");
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }, [selectedMonth, archive]);

  useEffect(() => {
    const timer = window.setTimeout(() => { setMeetings([]); void refresh(); }, 0);
    return () => { clearTimeout(timer); abort.current?.abort(); };
  }, [refresh]);

  const filteredMeetings = useMemo(() => {
    const today = localMeetingDate(new Date(now));
    return meetings.filter((meeting) =>
      (status === "all" || meeting.status === status) &&
      (owner === "all" || meeting.owner === owner) &&
      (period === "all" || (period === "today" ? meeting.date === today : period === "future" ? new Date(`${meeting.date}T${meeting.time}`).getTime() > now : new Date(`${meeting.date}T${meeting.time}`).getTime() < now)) &&
      (!withoutReport || (meeting.status === "completed" && meeting.reportCount === 0)) &&
      (!query.trim() || [meeting.title, meeting.prospect, meeting.company, meeting.email].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())))
    );
  }, [meetings, status, owner, period, withoutReport, query, now]);

  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedId) ?? null;
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(selectedMonth);
  const confirmedCount = meetings.filter((meeting) => meeting.status === "confirmed").length;
  const pendingCount = meetings.filter((meeting) => meeting.status === "pending").length;
  const eligible = meetings.filter((meeting) => !["cancelled", "no_show"].includes(meeting.status));
  const completionRate = eligible.length ? Math.round(100 * eligible.filter((meeting) => meeting.status === "completed").length / eligible.length) : 0;
  function resetFilters() { setQuery(""); setOwner("all"); setStatus("all"); setPeriod("all"); setWithoutReport(false); setArchive("active"); }
  function showCurrentMonth() { const now = new Date(); setSelectedMonth(new Date(now.getFullYear(), now.getMonth(), 1)); }
  function showPreviousMonth() { setSelectedMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1)); }
  function showNextMonth() { setSelectedMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1)); }

  async function updateMeeting(id: string, patch: Partial<Meeting>) {
    if (writeLock.current) return false;
    writeLock.current = true; mutationVersion.current++; abort.current?.abort();
    setUpdating(true); setLoading(false); setError("");
    try {
      const response = await fetch("/api/meetings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patch, id, ...(patch.archivedAt !== undefined ? { archived: Boolean(patch.archivedAt) } : {}) }),
      });
      const result = await response.json();
      if (!response.ok || result.meeting?.id !== id) throw new Error(result.error || "Enregistrement non confirmé.");
      setMeetings((current) => current.map((meeting) => meeting.id === id ? { ...meeting, ...result.meeting, reportCount: result.meeting.reportCount ?? meeting.reportCount } : meeting));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Modification non confirmée. Actualisez avant de réessayer.");
      return false;
    } finally { writeLock.current = false; setUpdating(false); }
  }

  async function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (writeLock.current) throw new Error("Un enregistrement est déjà en cours.");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form);
    writeLock.current = true; mutationVersion.current++; abort.current?.abort(); setLoading(false);
    setError("");
    try {
      const response = await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, leadId: form.get("leadId") || undefined, duration: Number(form.get("duration")), source: "Manual" }) });
      const result = await response.json();
      if (!response.ok || !result.meeting?.id) throw new Error(result.error || "Création non confirmée. Actualisez avant de réessayer.");
      setCreating(false);
      const date = new Date(`${result.meeting.date}T12:00:00`);
      if (date.getMonth() !== selectedMonth.getMonth() || date.getFullYear() !== selectedMonth.getFullYear()) setSelectedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setMeetings((current) => [...current.filter((meeting) => meeting.id !== result.meeting.id), result.meeting]);
      setSelectedId(result.meeting.id);
    } finally { writeLock.current = false; }
  }

  return { meetings, filteredMeetings, error, loading, updating, refresh, owners, period, setPeriod, withoutReport, setWithoutReport, archive, setArchive, resetFilters, view, setView, selectedMonth, query, setQuery, status, setStatus, owner, setOwner, selectedMeeting, setSelectedId, creating, setCreating, monthLabel, confirmedCount, pendingCount, completionRate, showCurrentMonth, showPreviousMonth, showNextMonth, updateMeeting, createMeeting };
}
