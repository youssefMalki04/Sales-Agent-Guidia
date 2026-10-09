"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; createdAt: string; subject: string; recipient: string; status: "sent" | "failed" };

export function MeetingEmailHistory({ meetingId, revision }: { meetingId: string; revision: number }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch(`/api/meetings/email-history?meetingId=${encodeURIComponent(meetingId)}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload.emails)) throw new Error();
        if (!controller.signal.aborted) { setEntries(payload.emails); setError(false); }
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    })();
    return () => controller.abort();
  }, [meetingId, revision, attempt]);

  return <div className="space-y-3 pt-3">
    <div className="flex items-center justify-between gap-2">
      <h4 className="text-sm font-semibold">Historique des e-mails</h4>
      <button className="text-xs text-indigo-600 underline" onClick={() => { setError(false); setEntries(null); setAttempt(attempt + 1); }}>Actualiser</button>
    </div>
    {error ? <p role="alert" className="text-sm text-red-600">Historique indisponible. Cliquez sur Actualiser pour réessayer.</p>
      : entries === null ? <p className="text-sm text-slate-500">Chargement…</p>
      : entries.length === 0 ? <p className="text-sm text-slate-500">Aucun envoi enregistré pour ce rendez-vous. Les anciens e-mails non rattachés ne figurent pas ici.</p>
      : <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
        {entries.map((entry) => <li key={entry.id} className="space-y-1 py-3 text-sm">
          <div className="flex items-start justify-between gap-2">
            <span className="break-words font-medium">{entry.subject}</span>
            <span className={`shrink-0 text-xs ${entry.status === "sent" ? "text-emerald-700" : "text-red-600"}`}>{entry.status === "sent" ? "Envoyé" : "Non envoyé"}</span>
          </div>
          <p className="break-all text-slate-600">À : {entry.recipient}</p>
          <time className="text-xs text-slate-500" dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString("fr-FR")}</time>
        </li>)}
      </ul>}
    <p className="text-xs text-slate-500">50 derniers envois maximum. « Envoyé » signifie accepté par le service d’envoi, pas nécessairement reçu ou lu.</p>
  </div>;
}
