"use client";
import { useEffect, useState } from "react";

type Event = { id: string; action: string; created_at: string; changes: Record<string, { before: unknown; after: unknown }> };
const labels: Record<string, string> = { title: "Titre", owner: "Responsable", scheduled_date: "Date", scheduled_time: "Heure", duration: "Durée", status: "Statut", archived_at: "Archivage", lead_id: "Prospect associé" };
const statuses: Record<string, string> = { pending: "En attente", confirmed: "Confirmé", completed: "Terminé", cancelled: "Annulé", no_show: "Absent" };
function describe(key: string, value: unknown) {
  if (key === "archived_at") return value ? "Archivé" : "Non archivé";
  if (key === "lead_id") return value ? "Prospect lié" : "Sans prospect";
  return statuses[String(value)] ?? String(value ?? "Non renseigné");
}
export function MeetingActivity({ meetingId }: { meetingId: string }) {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/meetings/activity?meetingId=${encodeURIComponent(meetingId)}`, { signal: controller.signal, cache: "no-store" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok || !Array.isArray(payload.events)) throw new Error();
      if (!controller.signal.aborted) setEvents(payload.events);
    }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [meetingId, attempt]);
  return <section className="mt-6 border-t pt-4">
    <div className="flex justify-between gap-2"><h3 className="text-sm font-semibold">Historique des modifications</h3><button type="button" className="text-xs text-indigo-600" onClick={() => { setEvents(null); setError(false); setAttempt((value) => value + 1); }}>Actualiser</button></div>
    {error ? <p role="alert" className="mt-2 text-sm text-red-600">Historique indisponible. Réessayez après vérification de la migration.</p> : !events ? <p className="mt-2 text-sm text-slate-500">Chargement…</p> : !events.length ? <p className="mt-2 text-sm text-slate-500">Aucune modification enregistrée depuis l’activation de l’historique.</p> : <ul className="mt-3 space-y-3">{events.map((event) => <li key={event.id} className="rounded-lg border p-3 text-xs">
      <time dateTime={event.created_at} className="text-slate-500">{new Date(event.created_at).toLocaleString("fr-FR")}</time>
      {event.action === "created" ? <p>Rendez-vous créé</p> : Object.entries(event.changes).map(([key, change]) => <p key={key} className="mt-1 break-words">{labels[key] ?? key} : {describe(key, change.before)} → {describe(key, change.after)}</p>)}
    </li>)}</ul>}
    <p className="mt-2 text-xs text-slate-400">50 derniers événements. L’auteur n’est pas identifié tant que la connexion utilisateur n’est pas en place.</p>
  </section>;
}
