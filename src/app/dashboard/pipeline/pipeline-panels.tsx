import {
  Building2,
  CircleDollarSign,
  Flame,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import type { DragEvent } from "react";

import { stages } from "./pipeline-data";
import type { PipelineLead, Stage, Temperature } from "./pipeline-types";
import { LeadCard, Stat } from "./pipeline-ui";
import { formatMoney } from "./pipeline-utils";

export function PipelineStats({ leads }: { leads: PipelineLead[] }) {
  const openLeads = leads.filter(
    (lead) => !["won", "lost"].includes(lead.stage),
  );
  const pipelineValue = leads
    .filter((lead) => lead.stage !== "lost")
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
  query,
  temperature,
  onQueryChange,
  onTemperatureChange,
}: {
  query: string;
  temperature: "all" | Temperature;
  onQueryChange: (query: string) => void;
  onTemperatureChange: (temperature: "all" | Temperature) => void;
}) {
  return (
    <section className="soft-panel-enter flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fafafd] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search a lead, company or owner…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-[#898992]" />
        <select
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
      </div>
    </section>
  );
}

export function PipelineBoard({
  leads,
  draggingId,
  overStage,
  onDraggingChange,
  onOverStageChange,
  onMoveLead,
}: {
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
    <section className="overflow-x-auto pb-4">
      <div className="grid min-w-[1380px] grid-cols-6 gap-4">
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
              className={`min-h-[520px] rounded-3xl border p-3 transition ${overStage === stage.id ? "border-[#939ae2] bg-[#eef0ff]" : "border-slate-200 bg-[#fafafd]"}`}
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
                  <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-[#dfe2eb] bg-white/60 text-xs font-medium text-[#9999a2]">
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
