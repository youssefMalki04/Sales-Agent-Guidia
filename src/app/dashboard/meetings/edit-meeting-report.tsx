"use client";

import { useEffect, useRef, useState } from "react";
import type { SavedMeetingReport } from "@/lib/meetings/report-history";
import type { ReportEditState } from "@/lib/meetings/report-exit";

export function EditMeetingReport({ report, onSaved, onCancel, onEditStateChange }: {
  report: SavedMeetingReport; onSaved: (content: string) => void; onCancel: () => void;
  onEditStateChange?: (state: ReportEditState) => void;
}) {
  const boundary = report.content.indexOf("\n\n");
  const prefix = boundary >= 0 ? report.content.slice(0, boundary + 2) : `${report.content.split("\n")[0]}\n\n`;
  const original = boundary >= 0 ? report.content.slice(boundary + 2) : report.content.split("\n").slice(1).join("\n");
  const [text, setText] = useState(original);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const dirty = text !== original;
  useEffect(() => {
    if (!dirty && !saving) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, saving]);

  return <form className="space-y-3 rounded-xl border border-indigo-200 bg-white p-3" onSubmit={async (event) => {
    event.preventDefault();
    if (lock.current || !dirty || !text.trim()) return;
    lock.current = true; setSaving(true); setError("");
    onEditStateChange?.({ dirty: true, saving: true });
    try {
      const content = prefix + text.trim();
      const response = await fetch("/api/leads/notes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: report.id, content, expectedContent: report.content }) });
      const payload = await response.json();
      if (!response.ok || payload.note?.id !== report.id) throw new Error(payload.error || "Enregistrement non confirmé. Vérifiez la note avant de réessayer.");
      onEditStateChange?.({ dirty: false, saving: false });
      onSaved(content);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Enregistrement non confirmé.");
      onEditStateChange?.({ dirty: true, saving: false });
    } finally { lock.current = false; setSaving(false); }
  }}>
    <p className="text-sm font-semibold">Modifier le compte rendu</p>
    <p className="whitespace-pre-wrap text-xs text-slate-500">{prefix.trim()}</p>
    <label className="block text-sm">Résumé et prochaines étapes
      <textarea value={text} disabled={saving} maxLength={Math.max(0, 5000 - prefix.length)} rows={6} className="mt-2 w-full rounded-lg border p-2" onChange={(event) => { setText(event.target.value); setError(""); onEditStateChange?.({ dirty: event.target.value !== original, saving: false }); }} />
    </label>
    {error && <p role="alert" className="text-sm text-red-600">{error} Votre texte est conservé.</p>}
    <div className="flex justify-end gap-2">
      <button type="button" disabled={saving} className="rounded-lg border px-3 py-2 text-sm" onClick={() => { if (dirty && !window.confirm("Abandonner les modifications de ce compte rendu ?")) return; onEditStateChange?.({ dirty: false, saving: false }); onCancel(); }}>Annuler</button>
      <button disabled={saving || !dirty || !text.trim()} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer"}</button>
    </div>
  </form>;
}
