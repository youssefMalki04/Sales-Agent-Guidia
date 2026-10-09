"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Flame,
  RefreshCw,
  Plus,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LeadEmailAction } from "@/components/leadia/lead-email-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTaskDialog } from "../tasks/create-task-dialog";
import { CreateMeeting } from "../meetings/create-meeting";
import { UnplannedLeadsPanel, type UnplannedLead } from "./unplanned-leads-panel";

type DayTask = {
  assignedTo: string | null;
  dueAt: string;
  id: string;
  lead: { company: string | null; email: string | null; name: string | null } | null;
  leadId: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
};

type HotLead = {
  company: string | null;
  email: string | null;
  id: string;
  name: string | null;
  nextAction: string | null;
  score: number;
};

type DayMeeting = {
  videoUrl?: string | null;
  company: string | null;
  date: string;
  duration: number;
  id: string;
  prospect: string;
  status: string;
  time: string;
  title: string;
};

type MyDayData = {
  generatedAt: string;
  hotLeads: HotLead[];
  meetings: DayMeeting[];
  tasks: DayTask[];
  unplannedLeads: UnplannedLead[];
  unplannedLeadCount: number;
};

export function MyDayWorkspace() {
  const [data, setData] = useState<MyDayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [selectingTasks, setSelectingTasks] = useState(false);
  const [meetingLead, setMeetingLead] = useState<HotLead | null>(null);

  async function loadDay() {
    setLoading(true);
    try {
      const response = await fetch("/api/my-day", { cache: "no-store" });
      const payload = (await response.json()) as MyDayData & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load your day");
      setData(payload);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load your day");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/my-day", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as MyDayData & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load your day");
        return payload;
      })
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load your day");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const taskGroups = useMemo(() => {
    const tasks = data?.tasks ?? [];
    const now = new Date();
    return {
      overdue: tasks.filter((task) => new Date(task.dueAt).getTime() < now.getTime()),
      today: tasks.filter((task) => {
        const due = new Date(task.dueAt);
        return due.getTime() >= now.getTime() && due.toDateString() === now.toDateString();
      }),
    };
  }, [data]);

  async function completeTask(id: string) {
    setUpdating(id);
    try {
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({ id, status: "completed" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Unable to complete this task");
      await loadDay();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update task");
    } finally {
      setUpdating(null);
    }
  }

  async function completeSelected() {
    if (!selectedTasks.size) return;
    setUpdating("bulk");
    setError("");
    try {
      const responses = await Promise.all(
        [...selectedTasks].map((id) =>
          fetch("/api/follow-ups", {
            body: JSON.stringify({ id, status: "completed" }),
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
          }),
        ),
      );
      if (responses.some((response) => !response.ok))
        throw new Error("Some tasks could not be completed");
      setSelectedTasks(new Set());
      await loadDay();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : "Unable to complete tasks");
    } finally {
      setUpdating(null);
    }
  }

  async function snoozeTask(id: string, days: number) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + days);
    dueAt.setHours(9, 0, 0, 0);
    setUpdating(id);
    try {
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({ dueAt: dueAt.toISOString(), id, status: "upcoming" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Unable to snooze this task");
      await loadDay();
    } catch (snoozeError) {
      setError(snoozeError instanceof Error ? snoozeError.message : "Unable to snooze task");
    } finally {
      setUpdating(null);
    }
  }

  async function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/meetings", {
      body: JSON.stringify({
        company: String(form.get("company") || ""),
        leadId: String(form.get("leadId") || "") || undefined,
        videoUrl: String(form.get("videoUrl") || ""),
        date: String(form.get("date") || ""),
        duration: Number(form.get("duration") || 30),
        email: String(form.get("email") || ""),
        notes: String(form.get("notes") || ""),
        owner: String(form.get("owner") || "Yosra"),
        prospect: String(form.get("prospect") || ""),
        source: "My Day",
        time: String(form.get("time") || "10:00"),
        title: String(form.get("title") || "Product discovery"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      setError("Unable to create meeting");
      const payload = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(payload.error ?? "Impossible de créer le rendez-vous.");
    }
    setMeetingLead(null);
    await loadDay();
  }

  if (loading && !data) {
    return <div className="rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">Preparing your priorities…</div>;
  }

  return (
    <>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <section className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#5964d6]">Today’s focus</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">
            {taskGroups.overdue.length
              ? `Start with ${taskGroups.overdue.length} overdue task${taskGroups.overdue.length > 1 ? "s" : ""}.`
              : taskGroups.today.length
                ? `You have ${taskGroups.today.length} priority task${taskGroups.today.length > 1 ? "s" : ""} today.`
                : "Your urgent task list is clear."}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {data?.hotLeads.length ?? 0} hot leads · {data?.meetings.length ?? 0} upcoming meetings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateTaskDialog onCreated={loadDay} />
          <Button variant="outline" onClick={() => setMeetingLead({ company: null, email: null, id: "", name: null, nextAction: null, score: 0 })} className="rounded-lg border-slate-200 bg-white text-slate-600 shadow-none">
            <Plus className="size-4" /> Schedule meeting
          </Button>
          <Button onClick={loadDay} disabled={loading} size="icon" variant="ghost" aria-label="Refresh My Day" title="Refresh" className="shrink-0 rounded-xl text-[#5964d6]">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </section>

      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
        {data && !error ? <UnplannedLeadsPanel
          leads={data.unplannedLeads ?? []}
          total={data.unplannedLeadCount ?? 0}
          loading={loading}
          onCreated={loadDay}
        /> : null}
        <DayPanel icon={Clock3} title="Priority tasks" count={taskGroups.overdue.length + taskGroups.today.length} action={
          <Button size="sm" variant="ghost" aria-pressed={selectingTasks} className="h-7 px-2 text-xs text-slate-500" onClick={() => {
            setSelectingTasks((current) => !current);
            setSelectedTasks(new Set());
          }}>{selectingTasks ? "Cancel selection" : "Select"}</Button>
        }>
          {selectedTasks.size ? (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f1f2ff] px-3 py-2">
              <span className="text-xs font-medium text-[#5964d6]">{selectedTasks.size} selected</span>
              <Button size="sm" onClick={completeSelected} disabled={updating === "bulk"} className="h-8 rounded-lg bg-[#5964d6]">
                <Check className="size-3.5" /> Complete selected
              </Button>
            </div>
          ) : null}
          {[...taskGroups.overdue, ...taskGroups.today].slice(0, 5).map((task) => (
            <div key={task.id} className="group -mx-2 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50">
              <div className="flex min-w-0 items-start gap-3">
                {selectingTasks ? <input
                  type="checkbox"
                  aria-label={`Select ${task.title}`}
                  checked={selectedTasks.has(task.id)}
                  onChange={(event) => setSelectedTasks((current) => {
                    const next = new Set(current);
                    if (event.target.checked) next.add(task.id); else next.delete(task.id);
                    return next;
                  })}
                  className="mt-1 size-5 shrink-0 accent-[#5964d6]"
                /> : <button
                  type="button"
                  disabled={updating !== null}
                  onClick={() => completeTask(task.id)}
                  aria-label={`Complete task: ${task.title}`}
                  title="Mark as done"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-40"
                >{updating === task.id ? <RefreshCw className="size-3 animate-spin" /> : <Check className="size-3" />}</button>}
                <div className="min-w-0 flex-1">
                    <p className="break-words text-[13px] font-medium leading-5 text-slate-800">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] leading-5 text-slate-500">
                    <Link href={`/dashboard/leads/${task.leadId}`} className="max-w-full truncate hover:text-indigo-600 hover:underline">{task.lead?.name || task.lead?.email || "Unknown lead"}</Link>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <time dateTime={task.dueAt}>{formatDateTime(task.dueAt)}</time>
                    <span className={`inline-flex items-center gap-1 font-medium ${new Date(task.dueAt) < new Date() ? "text-rose-600" : "text-indigo-600"}`}>
                      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
                      {new Date(task.dueAt) < new Date() ? "Overdue" : "Today"}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={updating !== null} size="icon-sm" variant="ghost" className="shrink-0 text-slate-400" aria-label={`Actions for ${task.title}`}><MoreHorizontal className="size-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => completeTask(task.id)}><Check className="size-4" /> Mark as done</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => snoozeTask(task.id, 1)}>Tomorrow at 09:00</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => snoozeTask(task.id, 7)}>Next week</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {!taskGroups.overdue.length && !taskGroups.today.length ? <Empty text="No urgent tasks today." /> : null}
          <PanelLink href="/dashboard/tasks" label="View all tasks" />
        </DayPanel>

        </div>
        <div className="min-w-0 space-y-4">
        <DayPanel icon={Flame} title="Hot leads" count={data?.hotLeads.length ?? 0}>
          {(data?.hotLeads ?? []).slice(0, 4).map((lead) => (
            <div key={lead.id} className="border-b border-slate-100 py-3 last:border-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1 basis-32">
                  <p className="truncate text-sm font-medium text-slate-900">{lead.name || lead.email || "Unnamed lead"}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{lead.company || "Company not provided"} · Score {lead.score}/100</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <LeadEmailAction compact company={lead.company ?? undefined} email={lead.email ?? undefined} leadId={lead.id} name={lead.name ?? undefined} need={lead.nextAction ?? undefined} />
                  <Button size="icon-sm" variant="ghost" onClick={() => setMeetingLead(lead)} aria-label="Schedule meeting"><CalendarDays className="size-4" /></Button>
                  <Button asChild size="icon-sm" variant="ghost"><Link href={`/dashboard/leads/${lead.id}`} aria-label="Open lead"><ArrowRight className="size-4" /></Link></Button>
                </div>
              </div>
            </div>
          ))}
          {!data?.hotLeads.length ? <Empty text="No hot leads waiting." /> : null}
          <PanelLink href="/dashboard/leads" label="View all leads" />
        </DayPanel>

        <DayPanel icon={CalendarDays} title="Next meetings" count={data?.meetings.length ?? 0}>
          {(data?.meetings ?? []).slice(0, 4).map((meeting) => (
            <div key={meeting.id} className="border-b border-slate-100 py-3 last:border-0">
              <p className="break-words text-sm font-semibold text-slate-900">{meeting.title}</p>
              <p className="mt-1 break-words text-xs text-slate-500">{meeting.prospect}{meeting.company ? ` · ${meeting.company}` : ""}</p>
              <p className="mt-2 text-xs font-medium text-[#5964d6]">{formatMeeting(meeting)} · {meeting.duration} min</p>
              {meeting.videoUrl ? <a href={meeting.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-medium text-indigo-600 underline">Rejoindre la visioconférence</a> : null}
            </div>
          ))}
          {!data?.meetings.length ? <Empty text="No upcoming meetings." /> : null}
          <PanelLink href="/dashboard/meetings" label="Open calendar" />
        </DayPanel>
        </div>
      </div>
      {meetingLead ? (
        <CreateMeeting
          initialLead={meetingLead}
          onClose={() => setMeetingLead(null)}
          onSubmit={createMeeting}
        />
      ) : null}
    </>
  );
}

function DayPanel({ children, count, icon: Icon, title, action }: { children: React.ReactNode; count: number; icon: typeof Clock3; title: string; action?: React.ReactNode }) {
  return <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3"><div className="flex min-w-0 items-center gap-2"><Icon className="size-4 shrink-0 text-[#5964d6]" /><h2 className="text-sm font-semibold text-slate-900">{title}</h2><span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{count}</span></div>{action}</div><div className="mt-1 min-w-0">{children}</div></section>;
}

function PanelLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#5964d6] hover:underline">{label} <ArrowRight className="size-3" /></Link>;
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-slate-400">{text}</p>;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatMeeting(meeting: DayMeeting) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(`${meeting.date}T12:00:00`)) + ` at ${meeting.time}`;
}
