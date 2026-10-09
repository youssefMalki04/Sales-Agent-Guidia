"use client";
import { useState } from "react";
import { dueDateState } from "@/lib/follow-ups/due-date";

export function usePastDateConfirmation(dueAt: string) {
  const [warnedDate, setWarnedDate] = useState<string | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  function reset() {
    setWarnedDate(null); setConfirmedDate(null); setInvalid(false);
  }
  function check() {
    const state = dueDateState(dueAt);
    if (state === "invalid") { setInvalid(true); return false; }
    setInvalid(false);
    if (state === "past" && confirmedDate !== dueAt) {
      setWarnedDate(dueAt); return false;
    }
    reset();
    return true;
  }
  const warning = invalid ? <p role="alert" className="mx-5 mb-3 text-sm text-red-700">Choisis une date et une heure valides.</p> :
    warnedDate === dueAt ? <div role="alert" className="mx-5 mb-3 shrink-0 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
      <p className="font-semibold">Cette date est dans le passé.</p>
      <p>La tâche apparaîtra en retard. Corrige la date ou confirme ton choix ci-dessous, puis enregistre.</p>
      <label className="mt-2 flex items-start gap-2">
        <input type="checkbox" checked={confirmedDate === dueAt} onChange={event => setConfirmedDate(event.target.checked ? dueAt : null)} className="mt-1 size-4 shrink-0 accent-indigo-600" />
        Je souhaite conserver cette date passée.
      </label>
    </div> : null;
  return { check, reset, warning };
}
