import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  UserRound,
  Video,
  X,
} from "lucide-react";

import type { Meeting, MeetingStatus } from "./meeting-data";
import { addMeetingDays } from "@/lib/meetings/dates";
import { safeMeetingUrl } from "@/lib/meetings/video-url";
import { CreateMeeting } from "./create-meeting";
import { ExportMeeting } from "./export-meeting";
import { MeetingReport } from "./meeting-report";
import { MeetingFollowUp } from "./meeting-follow-up";
import { MeetingEmail } from "./meeting-email";
import { MeetingActivity } from "./meeting-activity";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { canLeaveMeetingReport, type ReportEditState } from "@/lib/meetings/report-exit";

export function MeetingDetails({
  meeting,
  onClose,
  onUpdate,
  error,
}: {
  meeting: Meeting;
  onClose: () => void;
  onUpdate: (patch: Partial<Meeting>) => Promise<boolean>;
  error?: string;
}) {
  const [editingDetails, setEditingDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updateLock = useRef(false);
  async function applyUpdate(patch: Partial<Meeting>) {
    if (updateLock.current) return false;
    updateLock.current = true; setUpdating(true);
    try { return await onUpdate(patch); }
    finally { updateLock.current = false; setUpdating(false); }
  }
  const [tab, setTab] = useState("information");
  const [emailReport, setEmailReport] = useState<{ content: string; revision: number; leadId: string | null | undefined }>();
  function prepareReportEmail(content: string) {
    if (!window.confirm("Préparer un e-mail avec ce compte rendu remplacera un éventuel brouillon d’e-mail en cours. Continuer ?")) return;
    setEmailReport((current) => ({ content, revision: (current?.revision ?? 0) + 1, leadId: meeting.leadId }));
    setTab("follow-up");
  }
  const [editing, setEditing] = useState(false);
  const reportEditState = useRef<ReportEditState>({ dirty: false, saving: false });
  function allowReportExit() {
    if (reportEditState.current.saving) {
      window.alert("Le compte rendu est en cours d’enregistrement. Patientez avant de quitter.");
      return false;
    }
    return canLeaveMeetingReport(reportEditState.current, (message) => window.confirm(message));
  }
  function requestClose() {
    if (updateLock.current) return;
    if (editing && (schedule.date !== meeting.date || schedule.time !== meeting.time || schedule.duration !== meeting.duration) && !window.confirm("Abandonner les modifications de l’horaire ?")) return;
    if (allowReportExit()) onClose();
  }
  const [schedule, setSchedule] = useState({
    date: meeting.date,
    time: meeting.time,
    duration: meeting.duration,
  });

  async function saveSchedule() {
    if (await applyUpdate(schedule)) setEditing(false);
  }

  if (editingDetails) return <CreateMeeting initialMeeting={meeting} externalError={error} onClose={() => setEditingDetails(false)} onSubmit={async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await applyUpdate({
      title: String(form.get("title") || ""), prospect: String(form.get("prospect") || ""),
      company: String(form.get("company") || ""), email: String(form.get("email") || ""),
      owner: String(form.get("owner") || ""), notes: String(form.get("notes") || ""),
      date: String(form.get("date") || ""), time: String(form.get("time") || ""), duration: Number(form.get("duration")),
      leadId: String(form.get("leadId") || "") || null, videoUrl: String(form.get("videoUrl") || ""),
    });
    if (!ok) throw new Error("L’enregistrement a échoué. Vos modifications sont conservées, vous pouvez réessayer.");
    setSchedule({ date: String(form.get("date")), time: String(form.get("time")), duration: Number(form.get("duration")) });
    setEditingDetails(false);
  }} />;

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end bg-slate-950/45 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) requestClose();
      }}
    >
      <aside className="flex h-full w-full max-w-[520px] flex-col overflow-hidden bg-white shadow-2xl">
        <header className="shrink-0 border-b border-indigo-100/60 bg-gradient-to-r from-indigo-50/70 to-white px-5 pt-5 pb-4 sm:px-6">
        {error ? <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <div className="flex items-start justify-between">
          <div>
            <StatusBadge status={meeting.status} />
            <h2 className="mt-3 break-words text-xl font-semibold tracking-tight text-slate-900">{meeting.title}</h2>
            <p className="mt-2 text-sm text-[#777780]">
              {meeting.prospect} · {meeting.company}
            </p>
          </div>
          <button
            aria-label="Fermer le rendez-vous"
            disabled={updating}
            onClick={requestClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-md border"
          >
            <X className="size-4" />
          </button>
        </div>
        </header>
        <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
          <TabsList aria-label="Détail du rendez-vous" className="mx-5 mt-3 mb-2 grid h-auto w-auto shrink-0 grid-cols-3 rounded-xl bg-slate-50 p-1 sm:mx-6">
            <TabsTrigger value="information" className="min-h-10 text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Informations</TabsTrigger>
            <TabsTrigger value="report" className="min-h-10 text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Compte rendu</TabsTrigger>
            <TabsTrigger value="follow-up" className="min-h-10 text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Suivi</TabsTrigger>
          </TabsList>
          {/* Keep panels mounted so changing tabs preserves unsaved forms and drafts. */}
          <TabsContent value="information" forceMount className="min-h-0 overflow-y-auto px-5 pb-8 data-[state=inactive]:hidden sm:px-6">
        <div className="mt-3 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-slate-700">
          <p className="flex gap-3">
            <CalendarDays className="size-4" />
            {new Date(`${meeting.date}T12:00:00`).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </p>
          <p className="flex gap-3">
            <Clock3 className="size-4" />
            {meeting.time} · {meeting.duration} minutes
          </p>
          <p className="flex gap-3">
            <UserRound className="size-4" />
            Responsable : {meeting.owner}
          </p>
          <p className="flex gap-3">
            <Video className="size-4" />
            {safeMeetingUrl(meeting.videoUrl) ? <a href={safeMeetingUrl(meeting.videoUrl)!} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 underline">Rejoindre la visioconférence</a> : "Aucun lien de visioconférence"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
        <button type="button" disabled={updating} onClick={() => {
          if (editing && (schedule.date !== meeting.date || schedule.time !== meeting.time || schedule.duration !== meeting.duration) && !window.confirm("Abandonner les modifications de l’horaire ?")) return;
          if (!allowReportExit()) return;
          reportEditState.current = { dirty: false, saving: false };
          setEditingDetails(true);
        }} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-100 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"><Pencil className="size-4" />Modifier</button>
        <button type="button" disabled={updating} className="mt-4 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50" onClick={async () => {
          if (!allowReportExit() || !window.confirm(meeting.archivedAt ? "Restaurer ce rendez-vous ?" : "Archiver ce rendez-vous ? Il ne sera plus affiché parmi les rendez-vous actifs.")) return;
          if (await applyUpdate({ archivedAt: meeting.archivedAt ? null : new Date().toISOString() })) onClose();
        }}>{meeting.archivedAt ? "Restaurer" : "Archiver"}</button>
        </div>
        <section className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#92929b]">
            Notes
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#5f5f68]">
            {meeting.notes || "Aucune note ajoutée."}
          </p>
        </section>
        <fieldset disabled={updating} className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">Horaire</h3>
            <button
              type="button"
              onClick={() => {
                if (editing && (schedule.date !== meeting.date || schedule.time !== meeting.time || schedule.duration !== meeting.duration) && !window.confirm("Abandonner les modifications de l’horaire ?")) return;
                setSchedule({ date: meeting.date, time: meeting.time, duration: meeting.duration });
                setEditing((current) => !current);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5964d6]"
            >
              <Pencil className="size-3.5" />{" "}
              {editing ? "Annuler" : "Modifier"}
            </button>
          </div>
          {editing ? (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Date">
                  <input
                    required
                    type="date"
                    value={schedule.date}
                    onChange={(event) =>
                      setSchedule((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                </Field>
                <Field label="Heure">
                  <input
                    required
                    type="time"
                    value={schedule.time}
                    onChange={(event) =>
                      setSchedule((current) => ({
                        ...current,
                        time: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                </Field>
              </div>
              <Field label="Durée">
                <select
                  value={schedule.duration}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      duration: Number(event.target.value),
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </Field>
              <button
                type="button"
                onClick={saveSchedule}
                disabled={!schedule.date || !schedule.time}
                className="h-10 w-full rounded-xl bg-[#5964d6] text-sm font-semibold text-white hover:bg-[#4f5acb] disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          ) : null}
        </fieldset>
        <ExportMeeting meeting={meeting} />
        <details className="mt-5 rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-medium text-slate-700">Gérer le statut et les reports</summary>
        <fieldset disabled={updating || Boolean(meeting.archivedAt)} className="mt-7 grid grid-cols-2 gap-2 disabled:opacity-50">
          <button
            type="button"
            onClick={() => void applyUpdate({ status: "confirmed" })}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            <Check className="size-4" />
            Confirmer
          </button>
          <button
            type="button"
            onClick={() => void applyUpdate({ status: "completed" })}
            className="h-10 rounded-md border text-sm font-semibold"
          >
            Terminer
          </button>
          <button
            type="button"
            onClick={() =>
              applyUpdate({
                date: addMeetingDays(meeting.date, 7),
                status: "pending",
              })
            }
            className="h-10 rounded-md border text-sm font-semibold"
          >
            Reporter de 7 jours
          </button>
          <button
            type="button"
            onClick={() => { if (window.confirm("Annuler ce rendez-vous ?")) void applyUpdate({ status: "cancelled" }); }}
            className="h-10 rounded-md border border-red-200 text-sm font-semibold text-red-700"
          >
            Annuler le rendez-vous
          </button>
          <button type="button" onClick={() => { if (window.confirm("Marquer le prospect absent à ce rendez-vous ?")) void applyUpdate({ status: "no_show" }); }} className="col-span-2 h-10 rounded-md border text-sm font-semibold">Prospect absent</button>
        </fieldset>
        </details>
        <MeetingActivity key={`${meeting.id}-${meeting.date}-${meeting.time}-${meeting.status}-${meeting.owner}-${meeting.archivedAt}`} meetingId={meeting.id} />
          </TabsContent>
          <TabsContent value="report" forceMount className="min-h-0 overflow-y-auto px-5 pb-8 data-[state=inactive]:hidden sm:px-6">
            <MeetingReport key={`${meeting.id}-${meeting.leadId ?? "unlinked"}`} meeting={meeting} onEditStateChange={(state) => { reportEditState.current = state; }} onPrepareEmail={prepareReportEmail} />
          </TabsContent>
          <TabsContent value="follow-up" forceMount className="min-h-0 space-y-6 overflow-y-auto px-5 pt-4 pb-8 data-[state=inactive]:hidden sm:px-6">
            <MeetingFollowUp key={`follow-up-${meeting.id}-${meeting.leadId ?? "unlinked"}`} meeting={meeting} />
            <MeetingEmail key={`email-${meeting.id}-${meeting.leadId ?? "unlinked"}`} meeting={meeting} selectedReport={emailReport?.leadId === meeting.leadId ? emailReport : undefined} />
          </TabsContent>
        </Tabs>
      </aside>
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

export function StatusBadge({ status }: { status: MeetingStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle(status)}`}
    >
      {{ pending: "En attente", confirmed: "Confirmé", completed: "Terminé", cancelled: "Annulé", no_show: "Absent" }[status]}
    </span>
  );
}

export function statusStyle(status: MeetingStatus) {
  return {
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
    no_show: "border-orange-200 bg-orange-50 text-orange-700",
  }[status];
}
