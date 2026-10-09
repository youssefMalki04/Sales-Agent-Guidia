import {
  Building2,
  CircleDollarSign,
  Flame,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import type { DragEvent } from "react";
import { useId, useState } from "react";

import { stages } from "./pipeline-data";
import type { PipelineLead, Stage, Temperature } from "./pipeline-types";
import { LeadCard, Stat } from "./pipeline-ui";
import { formatMoney } from "./pipeline-utils";
import type { usePipelineFollowUps } from "./use-pipeline-follow-ups";

export function PipelineStats({ leads }: { leads: PipelineLead[] }) {
  const openLeads = leads.filter(
    (lead) => !["won", "lost"].includes(lead.stage),
  );
  const pipelineValue = openLeads
    .reduce((total, lead) => total + lead.value, 0);
  const wonValue = leads
    .filter((lead) => lead.stage === "won")
    .reduce((total, lead) => total + lead.value, 0);
  const hotCount = openLeads.filter(
    (lead) => lead.temperature === "hot",
  ).length;

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Stat
        label="Open pipeline"
        value={formatMoney(pipelineValue)}
        icon={<CircleDollarSign className="size-5" />}
      />
      <Stat
        label="Opportunities"
        value={String(openLeads.length)}
        icon={<Building2 className="size-5" />}
      />
      <Stat
        label="Hot leads"
        value={String(hotCount)}
        icon={<Flame className="size-5" />}
      />
      <Stat
        label="Revenue won"
        value={formatMoney(wonValue)}
        icon={<UserRound className="size-5" />}
      />
    </section>
  );
}

export function PipelineToolbar({
  withoutFollowUp,
  onWithoutFollowUpChange,
  followUpsReady,
  overdueOnly,
  onOverdueChange,
  resultCount,
  totalCount,
  onReset,
  owner,
  owners,
  onOwnerChange,
  query,
  temperature,
  onQueryChange,
  onTemperatureChange,
}: {
  withoutFollowUp: boolean;
  onWithoutFollowUpChange: (value: boolean) => void;
  followUpsReady: boolean;
  overdueOnly: boolean;
  onOverdueChange: (value: boolean) => void;
  resultCount: number;
  totalCount: number;
  onReset: () => void;
  owner: string;
  owners: string[];
  onOwnerChange: (owner: string) => void;
  query: string;
  temperature: "all" | Temperature;
  onQueryChange: (query: string) => void;
  onTemperatureChange: (temperature: "all" | Temperature) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersId = useId();
  const activeCount = Number(Boolean(owner)) + Number(temperature !== "all") + Number(overdueOnly) + Number(withoutFollowUp);
  return (
    <section className="soft-panel-enter min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
        <input
          aria-label="Search opportunities"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search a lead, company or owner…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
        />
      </div>
      <button type="button" aria-expanded={filtersOpen} aria-controls={filtersId} onClick={() => setFiltersOpen((value) => !value)} className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-indigo-500 ${filtersOpen || activeCount ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600"}`}>
        <SlidersHorizontal className="size-4" />Filters
        {activeCount ? <span className="flex size-5 items-center justify-center rounded-full bg-[#5964d6] text-[11px] text-white">{activeCount}<span className="sr-only"> active filters</span></span> : null}
      </button>
      </div>
      <div id={filtersId} hidden={!filtersOpen}>
      <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-slate-100 pt-3">
        <button type="button" aria-pressed={withoutFollowUp} disabled={!followUpsReady} onClick={() => onWithoutFollowUpChange(!withoutFollowUp)} className={`h-10 rounded-xl border px-3 text-sm font-medium disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-indigo-500 ${withoutFollowUp ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600"}`}>Without follow-up</button>
        <button type="button" aria-pressed={overdueOnly} onClick={() => onOverdueChange(!overdueOnly)} className={`h-10 rounded-xl border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-indigo-500 ${overdueOnly ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-600"}`}>Overdue only</button>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">Owner
        <select
          aria-label="Filter by owner"
          value={owner}
          onChange={(event) => onOwnerChange(event.target.value)}
          className="h-10 max-w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-indigo-500 sm:max-w-48"
        >
          <option value="">All owners</option>
          {owner && !owners.includes(owner) ? <option value={owner}>{owner}</option> : null}
          {owners.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">Temperature
        <select
          aria-label="Filter by temperature"
          value={temperature}
          onChange={(event) =>
            onTemperatureChange(event.target.value as "all" | Temperature)
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none"
        >
          <option value="all">All temperatures</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
        </label>
      </div>
      </div>
      <div className="mt-2 flex min-h-7 items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-xs text-slate-500"><span className="font-semibold text-slate-700">{resultCount}</span> / {totalCount} opportunities</p>
        {query || owner || temperature !== "all" || overdueOnly || withoutFollowUp ? (
          <button type="button" onClick={onReset} className="rounded-md px-2 py-1 text-xs font-semibold text-[#5964d6] hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500">Reset filters</button>
        ) : null}
      </div>
    </section>
  );
}

export function PipelineBoard({
  movingIds,
  followUps,
  onUpdated,
  leads,
  draggingId,
  overStage,
  onDraggingChange,
  onOverStageChange,
  onMoveLead,
}: {
  movingIds: string[];
  followUps: ReturnType<typeof usePipelineFollowUps>;
  onUpdated: (lead: PipelineLead) => void;
  leads: PipelineLead[];
  draggingId: string | null;
  overStage: Stage | null;
  onDraggingChange: (id: string | null) => void;
  onOverStageChange: (stage: Stage | null) => void;
  onMoveLead: (id: string, stage: Stage) => void;
}) {
  function handleDrop(event: DragEvent<HTMLDivElement>, stage: Stage) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/lead-id") || draggingId;
    if (id) onMoveLead(id, stage);
    onDraggingChange(null);
    onOverStageChange(null);
  }

  return (
    <section aria-label="Opportunity stages" tabIndex={0} className="min-w-0 overflow-x-auto pb-4 focus-visible:outline-2 focus-visible:outline-indigo-500">
      {followUps.error ? <p role="alert" className="mb-3 text-sm text-amber-700">{followUps.error} <button type="button" onClick={() => void followUps.refresh()} className="font-semibold underline">Retry</button></p> : null}
      <div className="grid min-w-[1440px] grid-cols-6 gap-3">
        {stages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage.id);
          const value = stageLeads.reduce(
            (total, lead) => total + lead.value,
            0,
          );

          return (
            <div
              key={stage.id}
              onDragOver={(event) => {
                event.preventDefault();
                onOverStageChange(stage.id);
              }}
              onDragLeave={() => onOverStageChange(null)}
              onDrop={(event) => handleDrop(event, stage.id)}
              className={`min-h-[400px] min-w-0 rounded-2xl border p-2.5 transition ${overStage === stage.id ? "border-[#939ae2] bg-[#eef0ff]" : "border-slate-200 bg-[#fafafd]"}`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${stage.color}`} />
                  <h2 className="text-sm font-semibold">{stage.label}</h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#777780]">
                    {stageLeads.length}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#85858e]">
                  {formatMoney(value)}
                </span>
              </div>
              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <LeadCard
                    moving={movingIds.includes(lead.id)}
                    nextFollowUp={followUps.tasks[lead.id]}
                    onFollowUpCreated={() => void followUps.refresh()}
                    onUpdated={onUpdated}
                    key={lead.id}
                    lead={lead}
                    dragging={draggingId === lead.id}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/lead-id", lead.id);
                      event.dataTransfer.effectAllowed = "move";
                      onDraggingChange(lead.id);
                    }}
                    onDragEnd={() => {
                      onDraggingChange(null);
                      onOverStageChange(null);
                    }}
                    onMove={(nextStage) => onMoveLead(lead.id, nextStage)}
                  />
                ))}
                {!stageLeads.length ? (
                  <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-[#dfe2eb] bg-white/60 text-xs font-medium text-[#9999a2]">
                    Drop opportunity here
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
