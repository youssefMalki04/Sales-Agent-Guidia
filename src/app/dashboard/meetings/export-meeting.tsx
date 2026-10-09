"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { meetingCalendarFile } from "@/lib/meetings/calendar-export";
import type { Meeting } from "./meeting-data";

export function ExportMeeting({ meeting }: { meeting: Meeting }) {
  const [error, setError] = useState("");
  const [reminder, setReminder] = useState(0);
  const inactive = Boolean(meeting.archivedAt) || ["cancelled", "completed", "no_show"].includes(meeting.status);
  function download() {
    setError("");
    try {
      const blob = new Blob([meetingCalendarFile(meeting, new Date(), reminder)], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leadia-rendez-vous-${meeting.date}.ics`;
      document.body.appendChild(link);
      link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError("Impossible d’exporter ce rendez-vous. Vérifiez sa date et son heure."); }
  }
  return <details className="mt-4 rounded-xl border border-slate-200 p-3">
    <summary className="cursor-pointer text-sm font-medium text-slate-700"><span className="inline-flex items-center gap-2"><CalendarPlus aria-hidden="true" className="size-4 text-indigo-500" />Exporter vers mon calendrier</span></summary>
    <label className="mb-3 mt-4 block text-xs font-medium text-slate-600">Rappel dans le calendrier
      <select value={inactive ? 0 : reminder} disabled={inactive} onChange={(event) => setReminder(Number(event.target.value))} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-indigo-500 disabled:opacity-50">
        <option value={0}>Aucun</option>
        <option value={15}>15 minutes avant</option>
        <option value={30}>30 minutes avant</option>
        <option value={60}>1 heure avant</option>
      </select>
    </label>
    <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"><CalendarPlus className="size-4" aria-hidden="true" />Ajouter au calendrier</button>
    <p className="mt-2 text-xs text-slate-500">Fichier .ics · horaire selon le fuseau de cet appareil. Aucune invitation envoyée.</p>
    <p className="mt-1 text-xs text-slate-500">{inactive ? "Pas de rappel pour un rendez-vous terminé ou annulé." : "Après l’import, vérifiez le rappel dans votre application calendrier : sa prise en charge dépend de l’application et de ses notifications."}</p>
    {error ? <p role="alert" className="mt-2 text-xs text-red-600">{error}</p> : null}
  </details>;
}
