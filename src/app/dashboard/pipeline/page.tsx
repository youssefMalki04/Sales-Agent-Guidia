"use client";

import {
  Building2,
  CircleDollarSign,
  Flame,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { DragEvent, useEffect, useMemo, useState } from "react";
import { initialLeads, stages, STORAGE_KEY } from "./pipeline-data";
import type { PipelineLead, Stage, Temperature } from "./pipeline-types";
import { formatMoney } from "./pipeline-utils";
import { LeadCard, Stat } from "./pipeline-ui";

export default function PipelinePage() {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [temperature, setTemperature] = useState<"all" | Temperature>("all");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setLeads(JSON.parse(stored) as PipelineLead[]);
      } catch {
        // Keep demo data if browser storage is unavailable or malformed.
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads, ready]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesText =
        !normalized ||
        [lead.name, lead.company, lead.email, lead.owner].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      return (
        matchesText &&
        (temperature === "all" || lead.temperature === temperature)
      );
    });
  }, [leads, query, temperature]);

  const pipelineValue = leads
    .filter((lead) => lead.stage !== "lost")
    .reduce((total, lead) => total + lead.value, 0);
  const wonValue = leads
    .filter((lead) => lead.stage === "won")
    .reduce((total, lead) => total + lead.value, 0);
  const hotCount = leads.filter(
    (lead) =>
      lead.temperature === "hot" && !["won", "lost"].includes(lead.stage),
  ).length;

  function moveLead(id: string, stage: Stage) {
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)),
    );
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, stage: Stage) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/lead-id") || draggingId;
    if (id) moveLead(id, stage);
    setDraggingId(null);
    setOverStage(null);
  }

  function addLead() {
    const id = `lead-${Date.now()}`;
    setLeads((current) => [
      {
        id,
        name: "New prospect",
        company: "Company",
        email: "prospect@example.com",
        value: 2500,
        score: 50,
        temperature: "warm",
        stage: "new",
        owner: "Yosra",
        dueDate: "Today",
      },
      ...current,
    ]);
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-10">
      <div className="soft-page-enter mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Sales workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Sales pipeline
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Move each opportunity through your commercial process.
            </p>
          </div>
          <button
            type="button"
            onClick={addLead}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" /> New opportunity
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Open pipeline"
            value={formatMoney(pipelineValue)}
            icon={<CircleDollarSign className="size-5" />}
          />
          <Stat
            label="Opportunities"
            value={String(
              leads.filter((lead) => !["won", "lost"].includes(lead.stage))
                .length,
            )}
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

        <section className="soft-panel-enter flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fafafd] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a lead, company or owner…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-[#898992]" />
            <select
              value={temperature}
              onChange={(event) =>
                setTemperature(event.target.value as "all" | Temperature)
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

        <section className="overflow-x-auto pb-4">
          <div className="grid min-w-[1380px] grid-cols-6 gap-4">
            {stages.map((stage) => {
              const stageLeads = filtered.filter(
                (lead) => lead.stage === stage.id,
              );
              const value = stageLeads.reduce(
                (sum, lead) => sum + lead.value,
                0,
              );
              return (
                <div
                  key={stage.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setOverStage(stage.id);
                  }}
                  onDragLeave={() => setOverStage(null)}
                  onDrop={(event) => handleDrop(event, stage.id)}
                  className={`min-h-[520px] rounded-3xl border p-3 transition ${overStage === stage.id ? "border-[#939ae2] bg-[#eef0ff]" : "border-slate-200 bg-[#fafafd]"}`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2.5 rounded-full ${stage.color}`}
                      />
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
                          setDraggingId(lead.id);
                        }}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setOverStage(null);
                        }}
                        onMove={(next) => moveLead(lead.id, next)}
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
      </div>
    </main>
  );
}
