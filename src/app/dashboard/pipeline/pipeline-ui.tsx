import {
  CalendarDays,
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  UserRound,
} from "lucide-react";
import type { DragEvent, ReactNode } from "react";

import { stages } from "./pipeline-data";
import type { PipelineLead, Stage } from "./pipeline-types";
import { formatMoney } from "./pipeline-utils";

export function LeadCard({
  lead,
  dragging,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  lead: PipelineLead;
  dragging: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onMove: (stage: Stage) => void;
}) {
  const tone =
    lead.temperature === "hot"
      ? "border-red-200 bg-red-50 text-red-700"
      : lead.temperature === "warm"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-sky-200 bg-sky-50 text-sky-700";
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_5px_18px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-[#cfd3ed] hover:shadow-md active:cursor-grabbing ${dragging ? "opacity-45" : "opacity-100"}`}
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
        <button
          type="button"
          aria-label={`Options for ${lead.name}`}
          className="text-[#9a9aa2]"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${tone}`}
        >
          {lead.temperature}
        </span>
        <span className="text-xs font-bold">{lead.score}/100</span>
      </div>
      <div className="mt-4 border-t border-[#eeeeF1] pt-3">
        <p className="text-sm font-semibold">{formatMoney(lead.value)}</p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#85858e]">
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
      <label className="relative mt-3 block border-t border-[#eeeeF1] pt-3">
        <span className="sr-only">Move {lead.name}</span>
        <select
          value={lead.stage}
          onChange={(event) => onMove(event.target.value as Stage)}
          className="h-8 w-full appearance-none rounded-lg bg-[#f1f2ff] px-2 pr-7 text-xs font-semibold text-[#5964d6] outline-none"
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
    <article className="soft-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-[#85858e]">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </article>
  );
}
