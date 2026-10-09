"use client";

import { useEffect, useRef, useState } from "react";
import { availableMeetingSlots } from "@/lib/meetings/available-slots";
import type { MeetingSlot } from "@/lib/meetings/conflicts";

export function AvailableSlots({ date, owner, duration, excludeId, selectedTime, disabled, onSelect }: {
  date: string; owner: string; duration: number; excludeId?: string; selectedTime: string; disabled: boolean; onSelect: (time: string) => void;
}) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function load() {
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError(""); setSlots(null);
    try {
      const query = new URLSearchParams({ date, owner });
      const response = await fetch(`/api/meetings/availability?${query}`, { cache: "no-store", signal: controller.signal });
      const payload = await response.json() as { meetings?: MeetingSlot[]; error?: string };
      if (!response.ok || !Array.isArray(payload.meetings)) throw new Error(payload.error || "Disponibilités indisponibles.");
      if (!controller.signal.aborted) setSlots(availableMeetingSlots(date, owner, duration, payload.meetings, excludeId));
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Impossible de vérifier les disponibilités.");
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }
  return <div className="rounded-xl border border-indigo-100 bg-white p-3 sm:col-span-2">
    <button type="button" disabled={disabled || loading || !date || !owner} onClick={() => void load()} className="rounded-md text-sm font-medium text-indigo-600 focus-visible:outline-2 disabled:opacity-50">{loading ? "Recherche…" : slots ? "Actualiser les créneaux disponibles" : "Voir les créneaux disponibles"}</button>
    <p className="mt-1 text-xs text-slate-500">Suggestions de 9 h à 18 h, toutes les 15 minutes, selon les rendez-vous Leadia. Pas de synchronisation avec les calendriers externes.</p>
    {error ? <p role="alert" className="mt-2 text-xs text-red-600">{error}</p> : null}
    {slots ? <>
      <p role="status" className="mt-2 text-xs text-slate-600">{slots.length ? `${slots.length} créneaux proposés pour ${owner}. Cliquez pour choisir l’heure.` : "Aucun créneau disponible sur cette plage. Essayez une autre date ou un autre responsable."}</p>
      <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
        {slots.map((time) => <button type="button" key={time} disabled={disabled} aria-pressed={selectedTime === time} onClick={() => onSelect(time)} className={`rounded-lg border px-3 py-2 text-xs disabled:opacity-50 ${selectedTime === time ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-700 hover:bg-indigo-50"}`}>{time}</button>)}
      </div>
      <p className="mt-2 text-xs text-slate-500">Le créneau n’est réservé qu’après l’enregistrement du rendez-vous.</p>
    </> : null}
  </div>;
}
