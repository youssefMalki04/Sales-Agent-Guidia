"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

type PreviewNote = { id: string; content: string; authorName: string; createdAt: string };

export function LeadPreviewNote({ leadId }: { leadId: string }) {
  const id = useId();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const lock = useRef(false);
  const [notes, setNotes] = useState<PreviewNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const request = useRef<AbortController | null>(null);
  const loadNotes = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`/api/leads/notes?leadId=${encodeURIComponent(leadId)}`, { cache: "no-store", signal: controller.signal });
      const payload = await response.json() as { notes?: PreviewNote[] };
      if (!response.ok || !Array.isArray(payload.notes)) throw new Error("Notes unavailable");
      if (!controller.signal.aborted) setNotes([...payload.notes].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id.localeCompare(b.id)).slice(0, 3));
    } catch {
      if (!controller.signal.aborted) setLoadError(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [leadId]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadNotes(); }, 0);
    return () => { window.clearTimeout(timer); request.current?.abort(); };
  }, [loadNotes]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || !content.trim() || content.length > 5000) return;
    lock.current = true;
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch("/api/leads/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, content: content.trim() }),
      });
      const payload = await response.json() as { note?: { id?: string } };
      if (!response.ok || !payload.note?.id) throw new Error("Unconfirmed save");
      setContent("");
      setNotice({ ok: true, text: "Note enregistrée dans la fiche du prospect." });
      await loadNotes();
    } catch {
      setNotice({ ok: false, text: "L’enregistrement n’a pas pu être confirmé. Votre texte est conservé. Vérifiez les notes de la fiche avant de réessayer." });
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }

  return <section>
    <form onSubmit={save} className="space-y-3">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-slate-900"><FileText className="size-4 text-indigo-500" aria-hidden="true" />Ajouter une note</label>
      <textarea id={id} value={content} disabled={saving} maxLength={5000} rows={3}
        onChange={(event) => { setContent(event.target.value); setNotice(null); }}
        placeholder="Ex. : Client intéressé, à rappeler vendredi."
        aria-describedby={`${id}-count`}
        className="block w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60" />
      <div className="flex items-center justify-between gap-2">
        <span id={`${id}-count`} className="text-xs text-slate-400">{content.length}/5000</span>
        <button type="submit" disabled={saving || !content.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-[#5964d6] px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50">
          <Plus className="size-3.5" aria-hidden="true" />{saving ? "Enregistrement…" : "Ajouter la note"}
        </button>
      </div>
      {notice ? <p role={notice.ok ? "status" : "alert"} className={`text-xs ${notice.ok ? "text-emerald-700" : "text-red-600"}`}>{notice.text}</p> : null}
    </form>
    <div className="mt-5 border-t border-slate-100 pt-4">
      <h3 className="text-sm font-semibold text-slate-900">Dernières notes</h3>
      {loading ? <p role="status" className="mt-3 text-xs text-slate-500">Chargement des notes…</p> : loadError ? <div role="alert" className="mt-3 text-xs text-amber-700">
        Impossible de charger les notes.
        <button type="button" onClick={() => void loadNotes()} className="ml-2 rounded p-1 underline">Réessayer</button>
      </div> : notes.length ? <ul className="mt-3 space-y-3">
        {notes.map((note) => <li key={note.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div className="flex flex-wrap justify-between gap-1 text-xs">
            <span className="break-words font-medium text-slate-700">{note.authorName}</span>
            <time dateTime={note.createdAt} className="text-slate-500">{Number.isFinite(Date.parse(note.createdAt)) ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(note.createdAt)) : "Date inconnue"}</time>
          </div>
          <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm text-slate-600">{note.content}</p>
        </li>)}
      </ul> : <p className="mt-3 text-xs text-slate-500">Aucune note pour ce prospect.</p>}
      <Link href={`/dashboard/leads/${encodeURIComponent(leadId)}#commercial-notes`} className="mt-3 inline-block rounded py-1 text-xs font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-500">Voir toutes les notes →</Link>
    </div>
  </section>;
}
