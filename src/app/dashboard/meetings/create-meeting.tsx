import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { localMeetingDate } from "@/lib/meetings/dates";
import type { Meeting } from "./meeting-data";
import { safeMeetingUrl } from "@/lib/meetings/video-url";
import { AvailableSlots } from "./available-slots";
import { useMeetingOwners } from "./use-meeting-owners";
import { useUnsavedChanges } from "@/components/leadia/use-unsaved-changes";

type LeadChoice = { id: string; name: string | null; email: string | null; company: string | null };

export function CreateMeeting({
  initialLead,
  lockLead = false,
  initialMeeting,
  externalError,
  onClose,
  onSubmit,
}: {
  initialLead?: { id?: string; company?: string | null; email?: string | null; name?: string | null };
  lockLead?: boolean;
  initialMeeting?: Meeting;
  externalError?: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
}) {
  const [leads, setLeads] = useState<LeadChoice[]>([]);
  const [leadId, setLeadId] = useState(initialMeeting?.leadId ?? initialLead?.id ?? "");
  const [prospect, setProspect] = useState(initialMeeting?.prospect ?? initialLead?.name ?? "");
  const [company, setCompany] = useState(initialMeeting?.company ?? initialLead?.company ?? "");
  const [email, setEmail] = useState(initialMeeting?.email ?? initialLead?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const canClose = useUnsavedChanges(dirty, saving);
  function requestClose() { if (canClose()) onClose(); }
  const owners = useMeetingOwners();
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const lock = useRef(false);
  const [date, setDate] = useState(initialMeeting?.date ?? localMeetingDate());
  const [time, setTime] = useState(initialMeeting?.time ?? "10:00");
  const [duration, setDuration] = useState(initialMeeting?.duration ?? 30);
  const [owner, setOwner] = useState(initialMeeting?.owner ?? "");
  useEffect(() => {
    if (lockLead) return;
    const controller = new AbortController();
    fetch("/api/leads", { cache: "no-store", signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Leads unavailable");
      const payload = await response.json() as { leads: LeadChoice[] };
      if (!controller.signal.aborted) setLeads(payload.leads);
    }).catch(() => { if (!controller.signal.aborted) setLoadError(true); });
    return () => controller.abort();
  }, [lockLead]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const data = new FormData(event.currentTarget);
    const video = String(data.get("videoUrl") || "").trim();
    if (video && !safeMeetingUrl(video)) { setError("Utilisez un lien http:// ou https:// valide."); return; }
    const when = new Date(`${data.get("date")}T${data.get("time")}`);
    const scheduleChanged = !initialMeeting || data.get("date") !== initialMeeting.date || data.get("time") !== initialMeeting.time;
    if (!Number.isFinite(when.getTime()) || (scheduleChanged && when.getTime() <= Date.now())) { setError("Choisissez une date et une heure futures."); return; }
    lock.current = true; setSaving(true); setError("");
    try { await onSubmit(event); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Impossible d’enregistrer le rendez-vous."); }
    finally { lock.current = false; setSaving(false); }
  }
  const input =
    "h-10 w-full rounded-md border border-[#dcdce2] px-3 text-sm outline-none";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) requestClose();
      }}
    >
      <form
        onSubmit={submit}
        onChangeCapture={() => setDirty(true)}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{initialMeeting ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</h2>
            <p className="mt-1 text-sm text-[#7d7d86]">
              Planifiez un échange commercial.
            </p>
          </div>
          <button type="button" disabled={saving} onClick={requestClose} aria-label="Fermer le formulaire">
            <X className="size-5" />
          </button>
        </div>
        <fieldset disabled={saving} className="mt-6 grid gap-4 sm:grid-cols-2">
          {lockLead ? <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 sm:col-span-2">
            <input type="hidden" name="leadId" value={initialLead?.id ?? ""} />
            Rendez-vous associé à {initialLead?.name || initialLead?.email || "ce prospect"}.
          </div> : <div className="sm:col-span-2">
            <Field label="Prospect existant">
              <select name="leadId" value={leadId} disabled={saving} className={input} onChange={(event) => {
                setLeadId(event.target.value);
                const selected = leads.find((lead) => lead.id === event.target.value);
                setProspect(selected?.name ?? ""); setCompany(selected?.company ?? ""); setEmail(selected?.email ?? "");
              }}>
                <option value="">Saisie manuelle</option>
                {leadId && !leads.some((lead) => lead.id === leadId) ? <option value={leadId}>{initialLead?.name || "Prospect sélectionné"}</option> : null}
                {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name || lead.company || "Sans nom"}{lead.email ? ` — ${lead.email}` : ""}</option>)}
              </select>
            </Field>
            {loadError ? <p role="alert" className="mt-2 text-xs text-amber-700">Liste des prospects indisponible. Vous pouvez saisir les coordonnées manuellement ou rouvrir le formulaire.</p> : null}
          </div>}
          <Field label="Titre">
            <input
              required
              name="title"
              defaultValue={initialMeeting?.title ?? "Découverte du produit"}
              maxLength={500}
              className={input}
            />
          </Field>
          <Field label="Prospect">
            <input required name="prospect" value={prospect} onChange={(event) => setProspect(event.target.value)} maxLength={500} className={input} />
          </Field>
          <Field label="Entreprise">
            <input name="company" value={company} onChange={(event) => setCompany(event.target.value)} maxLength={500} className={input} />
          </Field>
          <Field label="Email">
            <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} className={input} />
          </Field>
          <Field label="Date">
            <input
              required
              type="date"
              name="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={input}
            />
          </Field>
          <Field label="Heure">
            <input
              required
              type="time"
              name="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={input}
            />
          </Field>
          <Field label="Durée">
            <select name="duration" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className={input}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </Field>
          <Field label="Responsable">
            <select required name="owner" value={owner} onChange={(event) => setOwner(event.target.value)} className={input}>
              <option value="">Choisir un responsable</option>
              {owner && !owners.includes(owner) ? <option>{owner}</option> : null}
              {owners.map((name) => <option key={name}>{name}</option>)}
            </select>
          </Field>
          <p className="text-xs text-slate-500 sm:col-span-2">Fuseau de cet appareil : {Intl.DateTimeFormat().resolvedOptions().timeZone}. Responsables issus de la page Équipe de ce navigateur.</p>
          <AvailableSlots key={`${date}-${owner}-${duration}`} date={date} owner={owner} duration={duration} excludeId={initialMeeting?.id} selectedTime={time} disabled={saving || !owner} onSelect={(value) => { setTime(value); setDirty(true); }} />
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">Lien de visioconférence (facultatif)</span>
            <input name="videoUrl" type="url" defaultValue={initialMeeting?.videoUrl ?? ""} maxLength={2000} placeholder="https://meet.google.com/…" className={input} />
            <p className="mt-1 text-xs text-slate-500">Collez un lien existant. Aucun lien ni invitation n’est créé automatiquement.</p>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
              Notes
            </span>
            <textarea
              name="notes"
              defaultValue={initialMeeting?.notes ?? ""}
              maxLength={2000}
              rows={3}
              className="w-full rounded-md border border-[#dcdce2] p-3 text-sm"
            />
          </label>
        </fieldset>
        {externalError || error ? <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{externalError || error}</p> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={requestClose}
            className="h-10 rounded-md border px-4 text-sm font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-10 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            {saving ? "Enregistrement…" : initialMeeting ? "Enregistrer les modifications" : "Créer le rendez-vous"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
        {label}
      </span>
      {children}
    </label>
  );
}
