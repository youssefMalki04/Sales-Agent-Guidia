"use client";

import { useEffect, useState } from "react";
import { LeadEmailAction } from "@/components/leadia/lead-email-action";
import type { Meeting } from "./meeting-data";
import { MeetingEmailHistory } from "./meeting-email-history";

type Contact = { name: string | null; email: string | null; company: string | null };

export function MeetingEmail({ meeting, selectedReport }: { meeting: Meeting; selectedReport?: { content: string; revision: number } }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [historyRevision, setHistoryRevision] = useState(0);
  useEffect(() => {
    if (!meeting.leadId) return;
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch(`/api/leads/contact?leadId=${encodeURIComponent(meeting.leadId!)}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload.lead) throw new Error(payload.error || "Coordonnées indisponibles.");
        if (!controller.signal.aborted) setContact(payload.lead);
      } catch {
        if (!controller.signal.aborted) setError("Impossible de vérifier le destinataire.");
      }
    })();
    return () => controller.abort();
  }, [meeting.leadId, attempt]);

  return <section className="space-y-3 border-t border-slate-100 pt-5">
    <h3 className="font-semibold">E-mail après le rendez-vous</h3>
    <p className="text-sm text-slate-500">Un brouillon à personnaliser avec la prochaine étape. Aucun envoi automatique.</p>
    {!meeting.leadId ? <p className="text-sm">Associez un prospect via Modifier pour préparer son e-mail.</p>
      : error ? <p role="alert" className="text-sm text-red-600">{error} <button onClick={() => { setError(""); setContact(null); setAttempt(attempt + 1); }} className="underline">Réessayer</button></p>
      : !contact ? <p className="text-sm text-slate-500">Vérification du destinataire…</p>
      : !contact.email ? <p className="text-sm">Ajoutez une adresse e-mail dans la fiche du prospect.</p>
      : <LeadEmailAction
        key={`${meeting.id}-${contact.email}-${selectedReport?.revision ?? 0}`}
        initialReport={selectedReport?.content}
        initiallyOpen={Boolean(selectedReport)}
        leadId={meeting.leadId}
        meetingId={meeting.id}
        onDeliveryAttempt={() => setHistoryRevision((value) => value + 1)}
        email={contact.email}
        name={contact.name || undefined}
        company={contact.company || undefined}
        meetingContext={{ title: meeting.title, date: meeting.date }}
        triggerLabel="Préparer l’e-mail de suivi"
      />}
    <MeetingEmailHistory meetingId={meeting.id} revision={historyRevision} />
  </section>;
}
