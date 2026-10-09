"use client";

import { useEffect, useRef, useState } from "react";
import { savedMeetingReports } from "@/lib/meetings/report-history";

type Note = { id: string; content: string };

export function MeetingReportSource({ leadId, meetingId, value, onChange, disabled }: {
  leadId: string; meetingId: string; value: string; onChange: (value: string) => void; disabled: boolean;
}) {
  const allowAutofill = useRef(!value);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch(`/api/leads/notes?leadId=${encodeURIComponent(leadId)}&meetingId=${encodeURIComponent(meetingId)}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload.notes)) throw new Error();
        if (!controller.signal.aborted) {
          const reports = savedMeetingReports(payload.notes);
          setNotes(reports);
          if (allowAutofill.current && reports[0]) {
            allowAutofill.current = false;
            onChange(reports[0].content);
          }
        }
      } catch { if (!controller.signal.aborted) setError(true); }
    })();
    return () => controller.abort();
  }, [leadId, meetingId, attempt, onChange]);

  return <div className="space-y-2 rounded-xl border border-indigo-100 bg-white p-3 text-sm">
    <label className="block space-y-2 font-medium">Compte rendu enregistré
      <select disabled={disabled || !notes} value="" className="w-full rounded-lg border border-slate-200 p-2 font-normal" onChange={(event) => {
        const note = notes?.find((item) => item.id === event.target.value);
        if (note && (!value || window.confirm("Remplacer le compte rendu utilisé pour ce brouillon ?"))) { allowAutofill.current = false; onChange(note.content); }
      }}>
        <option value="">{notes === null ? "Chargement…" : notes.length ? "Choisir le compte rendu de ce rendez-vous" : "Aucun compte rendu enregistré"}</option>
        {notes?.map((note) => <option key={note.id} value={note.id}>{note.content.slice(0, 150).replaceAll("\n", " · ")}</option>)}
      </select>
    </label>
    {error && <p role="alert" className="text-xs text-red-600">Chargement impossible. <button type="button" className="underline" onClick={() => { setError(false); setAttempt(attempt + 1); }}>Réessayer</button></p>}
    <label className="block space-y-2">Points à utiliser dans l’e-mail
      <textarea disabled={disabled} value={value} maxLength={5000} rows={4} onChange={(event) => { allowAutofill.current = false; onChange(event.target.value); }} placeholder="Ou saisissez les points discutés et les prochaines étapes…" className="w-full rounded-lg border border-slate-200 p-2" />
    </label>
    <p className="text-xs text-slate-500">Le dernier compte rendu rattaché à ce rendez-vous est proposé si ce champ est vide à l’ouverture. Les anciens restent dans les notes du prospect. Retirez les informations internes avant de générer. La note enregistrée reste inchangée.</p>
  </div>;
}
