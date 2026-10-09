"use client";

import { useState } from "react";
import Link from "next/link";
import { ListTodo } from "lucide-react";
import { LeadFollowUpAction } from "@/components/leadia/lead-follow-up-action";
import { MeetingTasks } from "./meeting-tasks";
import type { Meeting } from "./meeting-data";

export function MeetingFollowUp({ meeting }: { meeting: Meeting }) {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState(false);
  const [revision, setRevision] = useState(0);
  return <section className="mt-5 rounded-xl border border-indigo-100 bg-white p-4">
    <h3 className="text-sm font-semibold text-slate-800">Après le rendez-vous</h3>
    {meeting.leadId ? <>
      <button type="button" onClick={() => { setCreated(false); setOpen(true); }} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-indigo-100 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"><ListTodo className="size-4" aria-hidden="true" />Créer une tâche de suivi</button>
      {created ? <p role="status" className="mt-2 text-xs text-emerald-700">Tâche créée pour ce prospect. <Link href="/dashboard/tasks" className="underline">Voir Tasks</Link></p> : null}
      {open ? <LeadFollowUpAction leadId={meeting.leadId} meetingId={meeting.id} leadName={meeting.prospect} open onOpenChange={setOpen} onCreated={() => { setCreated(true); setRevision((value) => value + 1); }} withAssignee initialTitle="Suivi après rendez-vous" initialNotes={`Suite au rendez-vous « ${meeting.title} » du ${meeting.date} à ${meeting.time}.`} /> : null}
      <MeetingTasks key={`${meeting.id}-${revision}`} meetingId={meeting.id} leadId={meeting.leadId} />
    </> : <p className="mt-2 text-xs text-slate-500">Associez d’abord ce rendez-vous à un prospect via Modifier.</p>}
  </section>;
}
