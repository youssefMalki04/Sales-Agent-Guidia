"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { cleanViewQuery, readLeadViews, type SavedLeadView } from "./saved-view-data";

const storageKey = "leadia:leads:saved-views:v1";
export function SavedLeadViews({ query }: { query: string }) {
  const [views, setViews] = useState<SavedLeadView[]>([]);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    function load() {
      try { setViews(readLeadViews(localStorage.getItem(storageKey))); setReady(true); }
      catch { setError("Impossible de lire les vues enregistrées dans ce navigateur."); }
    }
    const timer = window.setTimeout(load, 0);
    const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) load(); };
    window.addEventListener("storage", sync);
    return () => { window.clearTimeout(timer); window.removeEventListener("storage", sync); };
  }, []);
  function save() {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const current = readLeadViews(localStorage.getItem(storageKey));
      if (current.length >= 20) throw new Error("Maximum 20 vues. Supprime une vue avant d’en ajouter une.");
      if (current.some(view => view.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase())) throw new Error("Ce nom existe déjà. Choisis un autre nom.");
      const next = [...current, { id: crypto.randomUUID(), name: trimmed, query: cleanViewQuery(query) }];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setViews(next); setName(""); setEditing(false); setError(""); setMessage("Vue enregistrée dans ce navigateur.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Enregistrement impossible."); }
  }
  function remove(id: string) {
    try {
      const next = readLeadViews(localStorage.getItem(storageKey)).filter(view => view.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(next));
      setViews(next); setError(""); setMessage("Vue supprimée. Les prospects ne sont pas modifiés.");
    } catch { setError("Impossible de supprimer cette vue."); }
  }
  return <section aria-label="Vues enregistrées" className="space-y-2">
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 text-slate-500"><Bookmark className="size-3.5" />Mes vues</span>
      {views.map(view => <div key={view.id} className="flex max-w-full items-center rounded-lg border border-indigo-100 bg-indigo-50/40">
        <Link href={"/dashboard/leads?" + view.query} title={view.name} className="truncate rounded-lg px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-50">{view.name}</Link>
        <button type="button" aria-label={`Supprimer la vue ${view.name}`} onClick={() => remove(view.id)} className="shrink-0 rounded p-2 text-slate-400 hover:text-red-600"><X className="size-3" /></button>
      </div>)}
      <button type="button" disabled={!ready} onClick={() => { setEditing(!editing); setError(""); setMessage(""); }} className="rounded-lg px-2 py-2 font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50">+ Enregistrer cette vue</button>
    </div>
    {editing ? <form onSubmit={event => { event.preventDefault(); save(); }} className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-100 p-3">
      <label className="min-w-0 text-xs text-slate-500">Nom de la vue
        <input autoFocus required maxLength={60} value={name} onChange={event => setName(event.target.value)} placeholder="Prospects prioritaires" className="mt-1 block h-9 max-w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900" />
      </label>
      <button className="h-9 rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white" type="submit">Enregistrer</button>
      <button className="h-9 px-2 text-xs text-slate-500" type="button" onClick={() => setEditing(false)}>Annuler</button>
      <p className="w-full text-xs text-slate-500">Enregistre les filtres déjà appliqués et le tri, pas la page actuelle. Disponible uniquement dans ce navigateur.</p>
    </form> : null}
    {error ? <p role="alert" className="text-xs text-red-600">{error}</p> : null}
    {message ? <p role="status" className="text-xs text-slate-500">{message}</p> : null}
  </section>;
}
