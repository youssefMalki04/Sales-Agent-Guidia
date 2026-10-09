"use client";

import { useEffect, useState } from "react";
import { savedMeetingReports, type SavedMeetingReport } from "@/lib/meetings/report-history";
import { EditMeetingReport } from "./edit-meeting-report";
import type { ReportEditState } from "@/lib/meetings/report-exit";

export function MeetingReportHistory({ leadId, meetingId, onPrepareEmail, revision, onEditStateChange }: { leadId: string; meetingId: string; onPrepareEmail?: (content: string) => void; revision: number; onEditStateChange?: (state: ReportEditState) => void }) {
  const [editingReport, setEditingReport] = useState<SavedMeetingReport | null>(null);
  const [saved, setSaved] = useState(false);
  const [reports, setReports] = useState<SavedMeetingReport[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch(`/api/leads/notes?leadId=${encodeURIComponent(leadId)}&meetingId=${encodeURIComponent(meetingId)}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload.notes)) throw new Error();
        if (!controller.signal.aborted) setReports(savedMeetingReports(payload.notes));
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    })();
    return () => controller.abort();
  }, [leadId, meetingId, attempt, revision]);

  return <section className="mt-6 space-y-3 border-t border-slate-100 pt-5">
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-sm font-semibold text-slate-800">Comptes rendus de ce rendez-vous</h3>
      <button type="button" className="text-xs font-medium text-indigo-600 hover:underline" onClick={() => { setReports(null); setError(false); setAttempt((value) => value + 1); }}>Actualiser</button>
    </div>
    <p className="text-xs text-slate-500">Les anciens comptes rendus non rattachés restent accessibles dans les notes du prospect.</p>
    {saved && <p role="status" className="text-sm text-emerald-700">Compte rendu modifié. Préparez un nouveau brouillon pour utiliser cette version.</p>}
    {editingReport && <EditMeetingReport key={editingReport.id} report={editingReport} onEditStateChange={onEditStateChange} onCancel={() => setEditingReport(null)} onSaved={(content) => {
      setReports((current) => current?.map((item) => item.id === editingReport.id ? { ...item, content } : item) ?? null);
      setEditingReport(null); setSaved(true); setAttempt((value) => value + 1);
    }} />}
    {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Impossible de charger les comptes rendus. Cliquez sur Actualiser pour réessayer.</p>
      : reports === null ? <p role="status" className="text-sm text-slate-500">Chargement des comptes rendus…</p>
      : reports.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">Aucun compte rendu rattaché à ce rendez-vous.</p>
      : <div className="space-y-2">{reports.map((report) => {
        const [title, ...body] = report.content.split("\n");
        return <details key={report.id} className="rounded-xl border border-slate-200 bg-white">
          <summary className="cursor-pointer rounded-xl p-3 text-sm focus-visible:outline-indigo-500">
            <span className="break-words font-medium text-slate-800">{title}</span>
            <span className="mt-1 block text-xs text-slate-500">Enregistré le {new Date(report.createdAt).toLocaleString("fr-FR")} · {report.authorName}</span>
          </summary>
          <p className="whitespace-pre-wrap break-words border-t border-slate-100 p-3 text-sm leading-6 text-slate-600">{body.join("\n").trim()}</p>
          <div className="flex flex-wrap gap-2 px-3 pb-3">
            <button type="button" disabled={Boolean(editingReport)} onClick={() => { setEditingReport(report); setSaved(false); }} className="rounded-lg border px-3 py-2 text-xs disabled:opacity-50">Modifier</button>
            {onPrepareEmail && <button type="button" disabled={Boolean(editingReport)} onClick={() => onPrepareEmail(report.content)} className="rounded-lg border border-indigo-100 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50">Préparer l’e-mail avec ce compte rendu</button>}
          </div>
        </details>;
      })}</div>}
  </section>;
}
