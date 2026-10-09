"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { CreateMeeting } from "../meetings/create-meeting";
import { MeetingDetails } from "../meetings/meeting-panels";
import { CalendarDays } from "lucide-react";
import type { Meeting } from "../meetings/meeting-data";
import { safeMeetingUrl } from "@/lib/meetings/video-url";

const labels: Record<string, string> = { pending: "En attente", confirmed: "Confirmé", completed: "Terminé", cancelled: "Annulé" };
export function LeadMeetingsPanel({ leadId, name, email, company }: { leadId: string; name: string | null; email: string | null; company: string | null }) {
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [updateError, setUpdateError] = useState("");
  const [updated, setUpdated] = useState(false);
  const updateLock = useRef(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true); setError(false);
      (async () => {
          const meetings: Meeting[] = [];
          let offset = 0;
          for (;;) {
            const response = await fetch(`/api/meetings?leadId=${encodeURIComponent(leadId)}&offset=${offset}`, { cache: "no-store", signal: controller.signal });
            const result = await response.json() as { meetings?: Meeting[]; nextOffset?: number | null };
            if (!response.ok || !Array.isArray(result.meetings)) throw new Error("Unavailable");
            meetings.push(...result.meetings);
            if (result.nextOffset == null) break;
            if (!Number.isInteger(result.nextOffset) || result.nextOffset <= offset) throw new Error("Invalid pagination");
            offset = result.nextOffset;
          }
          if (!controller.signal.aborted) { setMeetings(meetings); setNow(Date.now()); }
        })().catch(() => { if (!controller.signal.aborted) setError(true); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 0);
    window.addEventListener("focus", refresh);
    return () => { clearTimeout(timer); controller.abort(); window.removeEventListener("focus", refresh); };
  }, [leadId, revision, refresh]);
  const upcoming = (meeting: Meeting) => !meeting.archivedAt && ["pending", "confirmed"].includes(meeting.status) && new Date(`${meeting.date}T${meeting.time}:00`).getTime() + meeting.duration * 60000 > now;
  const next = meetings.filter(upcoming);
  const history = meetings.filter((meeting) => !upcoming(meeting)).reverse();
  function openMeeting(meeting: Meeting) {
    setSelected(meeting); setUpdateError(""); setUpdated(false); setCreated(false);
  }
  async function updateMeeting(patch: Partial<Meeting>): Promise<boolean> {
    if (!selected || updateLock.current) return false;
    const id = selected.id;
    updateLock.current = true; setUpdateError(""); setUpdated(false);
    try {
      const response = await fetch("/api/meetings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patch, id, ...(patch.archivedAt !== undefined ? { archived: Boolean(patch.archivedAt) } : {}) }),
      });
      const result = await response.json() as { meeting?: Meeting; error?: string };
      if (!response.ok || result.meeting?.id !== id) throw new Error(result.error ?? "La modification n’a pas pu être confirmée. Vérifiez le rendez-vous avant de réessayer.");
      const saved = result.meeting;
      setSelected((current) => current?.id === id ? saved : current);
      setUpdated(true); refresh();
      return true;
    } catch (cause) {
      setUpdateError(cause instanceof Error ? cause.message : "Impossible d’enregistrer les modifications.");
      return false;
    } finally { updateLock.current = false; }
  }
  async function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/meetings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, title: String(form.get("title") || ""), prospect: String(form.get("prospect") || ""), company: String(form.get("company") || ""), email: String(form.get("email") || ""), date: String(form.get("date") || ""), time: String(form.get("time") || ""), duration: Number(form.get("duration")), owner: String(form.get("owner") || ""), notes: String(form.get("notes") || ""), videoUrl: String(form.get("videoUrl") || ""), source: "Lead profile" }),
    });
    const result = await response.json() as { error?: string; meeting?: Meeting };
    if (!response.ok || !result.meeting?.id) throw new Error(result.error ?? "L’enregistrement n’a pas pu être confirmé. Vérifiez la liste avant de réessayer.");
    setCreating(false); setCreated(true); refresh();
  }
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><CalendarDays className="size-5 text-indigo-500" />Rendez-vous du prospect</h2>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => { setCreating(true); setCreated(false); }} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700">Planifier un rendez-vous</button>
        <button type="button" disabled={loading} onClick={refresh} className="rounded-lg px-2 py-2 text-xs font-medium text-indigo-600 disabled:opacity-50">Actualiser</button>
      </div>
    </div>
    {created ? <p role="status" className="mt-3 text-sm text-emerald-700">Rendez-vous enregistré.</p> : null}
    {updated ? <p role="status" className="mt-3 text-sm text-emerald-700">Rendez-vous mis à jour.</p> : null}
    {selected ? createPortal(<MeetingDetails key={selected.id} meeting={selected} error={updateError} onClose={() => setSelected(null)} onUpdate={updateMeeting} />, document.body) : null}
    {creating ? createPortal(<CreateMeeting lockLead initialLead={{ id: leadId, name, email, company }} onClose={() => setCreating(false)} onSubmit={createMeeting} />, document.body) : null}
    {loading ? <p role="status" className="mt-4 text-sm text-slate-500">Chargement des rendez-vous…</p> : error ? <p role="alert" className="mt-4 text-sm text-amber-700">Impossible de charger les rendez-vous. Cliquez sur Actualiser pour réessayer.</p> : <>
      <MeetingGroup title="À venir ou en cours" meetings={next} empty="Aucun rendez-vous à venir." onSelect={openMeeting} />
      <MeetingGroup title="Passés ou clôturés" meetings={history} empty="Aucun rendez-vous passé ou clôturé." onSelect={openMeeting} />
      {!meetings.length ? <p className="mt-3 text-xs text-slate-500">Seuls les rendez-vous associés à ce prospect sont affichés. Pour associer un rendez-vous existant, utilisez Modifier dans Meetings.</p> : null}
    </>}
  </section>;
}

function MeetingGroup({ title, meetings, empty, onSelect }: { title: string; meetings: Meeting[]; empty: string; onSelect: (meeting: Meeting) => void }) {
  return <div className="mt-5">
    <h3 className="text-sm font-semibold text-slate-700">{title} <span className="ml-1 text-slate-400">({meetings.length})</span></h3>
    {meetings.length ? <ul className="mt-2 max-h-80 divide-y divide-slate-100 overflow-y-auto">
      {meetings.map((meeting) => {
        const url = safeMeetingUrl(meeting.videoUrl);
        return <li key={meeting.id} className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><button type="button" onClick={() => onSelect(meeting)} aria-label={`Ouvrir le rendez-vous : ${meeting.title}`} className="rounded text-left text-sm font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-500"><span className="break-words">{meeting.title}</span> →</button><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{labels[meeting.status] ?? meeting.status}</span></div>
          <p className="mt-1 text-xs text-slate-500"><time dateTime={`${meeting.date}T${meeting.time}`}>{meeting.date.split("-").reverse().join("/")} à {meeting.time}</time> · {meeting.duration} min · {meeting.owner}</p>
          {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block rounded text-xs font-medium text-indigo-600 hover:underline">Lien de visioconférence ↗</a> : null}
        </li>;
      })}
    </ul> : <p className="mt-2 text-sm text-slate-500">{empty}</p>}
  </div>;
}
