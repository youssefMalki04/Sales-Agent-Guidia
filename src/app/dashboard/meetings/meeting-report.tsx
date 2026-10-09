"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Meeting } from "./meeting-data";
import { meetingReportContent } from "@/lib/meetings/report";
import type { ReportEditState } from "@/lib/meetings/report-exit";
import { MeetingReportHistory } from "./meeting-report-history";

export function MeetingReport({ meeting, onEditStateChange, onPrepareEmail }: { meeting: Meeting; onEditStateChange?: (state: ReportEditState) => void; onPrepareEmail?: (content: string) => void }) {
  const id = useId();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [historyRevision, setHistoryRevision] = useState(0);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const lock = useRef(false);
  const editStates = useRef({ draft: { dirty: false, saving: false }, history: { dirty: false, saving: false } });
  function updateEditState(part: "draft" | "history", state: ReportEditState) {
    editStates.current[part] = state;
    onEditStateChange?.({ dirty: editStates.current.draft.dirty || editStates.current.history.dirty, saving: editStates.current.draft.saving || editStates.current.history.saving });
  }
  useEffect(() => {
    if (!text.trim() && !saving) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [text, saving]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || !meeting.leadId || !text.trim()) return;
    lock.current = true; setSaving(true); setNotice(null);
    updateEditState("draft", { dirty: true, saving: true });
    let saved = false;
    try {
      const response = await fetch("/api/leads/notes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: meeting.leadId, meetingId: meeting.id, content: meetingReportContent(meeting, text) }),
      });
      const result = await response.json() as { note?: { id: string } };
      if (!response.ok || !result.note?.id) throw new Error("Unconfirmed save");
      saved = true;
      setHistoryRevision((value) => value + 1);
      setText(""); setNotice({ ok: true, text: "Compte rendu enregistré dans les notes du prospect." });
    } catch {
      setNotice({ ok: false, text: "L’enregistrement n’a pas pu être confirmé. Votre texte est conservé. Vérifiez les notes avant de réessayer." });
    } finally {
      lock.current = false; setSaving(false);
      updateEditState("draft", { dirty: !saved, saving: false });
    }
  }
  return <section className="mt-6 border-t border-slate-100 pt-5">
    <h3 className="text-sm font-semibold text-slate-800">Compte rendu</h3>
    {meeting.leadId ? <form onSubmit={save} className="mt-3 space-y-3">
      <label htmlFor={id} className="block text-xs text-slate-500">Résumé de l’échange et prochaines étapes</label>
      <textarea id={id} value={text} disabled={saving} maxLength={4000} rows={4} onChange={(event) => { setText(event.target.value); setNotice(null); updateEditState("draft", { dirty: Boolean(event.target.value.trim()), saving: false }); }} placeholder="Démonstration faite, client intéressé, envoyer un devis…" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-indigo-500 disabled:opacity-50" />
      <div className="flex items-center justify-between gap-2"><span className="text-xs text-slate-400">{text.length}/4000</span><button type="submit" disabled={saving || !text.trim()} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer le compte rendu"}</button></div>
      {notice ? <p role={notice.ok ? "status" : "alert"} className={`text-xs ${notice.ok ? "text-emerald-700" : "text-red-600"}`}>{notice.text}</p> : null}
      {/* Full navigation reloads the existing note list, including when already on this lead page. */}
      <a href={`/dashboard/leads/${encodeURIComponent(meeting.leadId)}#commercial-notes`} className="inline-block text-xs font-medium text-indigo-600 hover:underline">Voir les notes du prospect →</a>
      <p className="text-xs text-slate-500">L’enregistrement ne change pas le statut du rendez-vous.</p>
    </form> : <p className="mt-2 text-sm text-slate-500">Associez ce rendez-vous à un prospect via Modifier pour enregistrer un compte rendu dans sa fiche.</p>}
    {meeting.leadId && <MeetingReportHistory key={`${meeting.id}-${meeting.leadId}`} revision={historyRevision} leadId={meeting.leadId} meetingId={meeting.id} onPrepareEmail={onPrepareEmail} onEditStateChange={(state) => updateEditState("history", state)} />}
  </section>;
}
