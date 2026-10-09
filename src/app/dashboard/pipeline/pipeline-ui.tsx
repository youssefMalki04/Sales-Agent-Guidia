import {
  CalendarDays,
  CalendarClock,
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  UserRound,
  Pencil,
  ArrowUpRight,
  ArrowRightLeft,
} from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import { useState } from "react";
import { PipelineEditDialog } from "./pipeline-edit-dialog";
import { LeadFollowUpAction } from "@/components/leadia/lead-follow-up-action";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";

import { stages } from "./pipeline-data";
import type { PipelineLead, Stage } from "./pipeline-types";
import { formatMoney, isOverdue } from "./pipeline-utils";
import type { PipelineFollowUp } from "./use-pipeline-follow-ups";

export function LeadCard({
  moving,
  nextFollowUp,
  onFollowUpCreated,
  onUpdated,
  lead,
  dragging,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  moving: boolean;
  nextFollowUp?: PipelineFollowUp;
  onFollowUpCreated: () => void;
  onUpdated: (lead: PipelineLead) => void;
  lead: PipelineLead;
  dragging: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onMove: (stage: Stage) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpCreated, setFollowUpCreated] = useState(false);
  const tone =
    lead.temperature === "hot"
      ? "border-red-200 bg-red-50 text-red-700"
      : lead.temperature === "warm"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-sky-200 bg-sky-50 text-sky-700";
  return (
    <>
    {followUpOpen ? <LeadFollowUpAction leadId={lead.id} leadName={lead.name} open={followUpOpen} onOpenChange={setFollowUpOpen} onCreated={() => { setFollowUpCreated(true); onFollowUpCreated(); }} /> : null}
    {editing ? <PipelineEditDialog lead={lead} onClose={() => setEditing(false)} onUpdated={onUpdated} /> : null}
    <article
      draggable={!moving}
      aria-busy={moving}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`min-w-0 cursor-grab rounded-xl border border-slate-200/80 bg-white p-3 transition-colors hover:border-[#cfd3ed] active:cursor-grabbing ${dragging ? "opacity-45" : "opacity-100"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 gap-2.5">
          <GripVertical className="mt-0.5 size-4 shrink-0 text-[#b0b0b8]" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{lead.name}</h3>
            <p className="mt-1 truncate text-xs text-[#81818a]">
              {lead.company}
            </p>
          </div>
        </div>
        <DropdownMenu>
        <DropdownMenuTrigger asChild><button
          type="button"
          aria-label={`Options for ${lead.name}`}
          disabled={moving}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-[#5964d6] focus-visible:outline-2 focus-visible:outline-indigo-500 data-[state=open]:bg-indigo-50 data-[state=open]:text-[#5964d6]"
        >
          <MoreHorizontal className="size-4" />
        </button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} collisionPadding={12} className="w-56 max-w-[calc(100vw-24px)] rounded-xl p-1.5 shadow-lg ring-slate-200">
          <DropdownMenuItem className="min-h-10 gap-3 whitespace-nowrap rounded-lg px-3 text-sm text-slate-700 focus:bg-indigo-50 focus:text-indigo-700" onSelect={() => { setFollowUpCreated(false); setFollowUpOpen(true); }}><CalendarClock className="size-4 text-slate-400" />Create follow-up</DropdownMenuItem>
          <DropdownMenuItem className="min-h-10 gap-3 whitespace-nowrap rounded-lg px-3 text-sm text-slate-700 focus:bg-indigo-50 focus:text-indigo-700" onSelect={() => setEditing(true)}><Pencil className="size-4 text-slate-400" />Edit opportunity</DropdownMenuItem>
          <DropdownMenuItem className="min-h-10 gap-3 whitespace-nowrap rounded-lg px-3 text-sm text-slate-700 focus:bg-indigo-50 focus:text-indigo-700" asChild><Link href={`/dashboard/leads/${lead.id}`}><ArrowUpRight className="size-4 text-slate-400" />Open lead</Link></DropdownMenuItem>
          <DropdownMenuSeparator className="mx-1 my-1.5 bg-slate-100" />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="min-h-10 gap-3 rounded-lg px-3 text-sm text-slate-700 focus:bg-indigo-50 data-[state=open]:bg-indigo-50"><ArrowRightLeft className="size-4 text-slate-400" />Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent collisionPadding={12} className="w-44 rounded-xl p-1.5 shadow-lg ring-slate-200">
              {stages.filter((stage) => stage.id !== lead.stage).map((stage) => (
                <DropdownMenuItem className="min-h-10 gap-3 whitespace-nowrap rounded-lg px-3 text-sm text-slate-700 focus:bg-indigo-50 focus:text-indigo-700" key={stage.id} onSelect={() => onMove(stage.id)}><span className={`size-2 shrink-0 rounded-full ${stage.color}`} />{stage.label}</DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {followUpCreated ? <p role="status" className="mt-3 rounded-lg bg-emerald-50 px-2 py-2 text-xs text-emerald-700">Follow-up created · <Link className="font-semibold underline" href="/dashboard/tasks">View tasks</Link></p> : null}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize ${tone}`}
        >
          {lead.temperature}
        </span>
        <span className="text-xs font-medium tabular-nums text-slate-500">{lead.score}/100</span>
      </div>
      {isOverdue(lead) ? <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"><CalendarDays className="size-3" />Overdue</span> : null}
      <div className="mt-3 border-t border-slate-100 pt-2.5">
        <p className="text-sm font-semibold tabular-nums">{formatMoney(lead.value)}</p>
        <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <UserRound className="size-3" />
            {lead.owner}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {lead.dueDate}
          </span>
        </div>
      </div>
      {nextFollowUp ? <Link href="/dashboard/tasks" className="mt-3 block rounded-lg bg-slate-50 px-2.5 py-2 text-xs text-slate-600 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500">
        <span className="flex items-center gap-1.5 font-semibold text-[#5964d6]"><CalendarClock className="size-3.5" />Next follow-up</span>
        <span className="mt-1 block break-words font-medium text-slate-700">{nextFollowUp.title}</span>
        <time dateTime={nextFollowUp.dueAt} className="mt-1 block">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(nextFollowUp.dueAt))}</time>
      </Link> : null}
      {moving ? <p role="status" className="mt-3 text-xs font-medium text-indigo-600">Enregistrement…</p> : null}
      <label className="relative mt-2 block border-t border-slate-100 pt-2">
        <span className="sr-only">Move {lead.name}</span>
        <select
          value={lead.stage}
          disabled={moving}
          onChange={(event) => onMove(event.target.value as Stage)}
          className="h-8 w-full appearance-none rounded-lg border border-slate-200 bg-white px-2 pr-7 text-xs font-medium text-slate-600 outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100 disabled:opacity-50"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              Move to {stage.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute bottom-2 right-2 size-3.5 text-[#777780]" />
      </label>
    </article>
    </>
  );
}

export function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f2ff] text-[#5964d6]">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-[#85858e]">{label}</p>
        <p className="mt-1 break-words text-lg font-semibold tabular-nums">{value}</p>
      </div>
    </article>
  );
}
