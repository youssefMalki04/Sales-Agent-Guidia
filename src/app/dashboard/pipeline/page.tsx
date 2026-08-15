"use client";

import {
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Flame,
  GripVertical,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { DragEvent, useEffect, useMemo, useState } from "react";

type Stage = "new" | "qualified" | "meeting" | "proposal" | "won" | "lost";
type Temperature = "hot" | "warm" | "cold";

type PipelineLead = {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  score: number;
  temperature: Temperature;
  stage: Stage;
  owner: string;
  dueDate: string;
};

const STORAGE_KEY = "leadia-sales-pipeline-v1";

const stages: Array<{ id: Stage; label: string; color: string }> = [
  { id: "new", label: "New", color: "bg-indigo-500" },
  { id: "qualified", label: "Qualified", color: "bg-cyan-500" },
  { id: "meeting", label: "Meeting", color: "bg-violet-500" },
  { id: "proposal", label: "Proposal", color: "bg-amber-500" },
  { id: "won", label: "Won", color: "bg-emerald-500" },
  { id: "lost", label: "Lost", color: "bg-rose-400" },
];

const initialLeads: PipelineLead[] = [
  {
    id: "lead-1",
    name: "Amira Ben Salah",
    company: "Nexa Retail",
    email: "amira@nexa.tn",
    value: 4800,
    score: 82,
    temperature: "hot",
    stage: "new",
    owner: "Yosra",
    dueDate: "12 Aug",
  },
  {
    id: "lead-2",
    name: "Thomas Martin",
    company: "Flowdesk",
    email: "thomas@flowdesk.fr",
    value: 7200,
    score: 74,
    temperature: "warm",
    stage: "new",
    owner: "Yosra",
    dueDate: "14 Aug",
  },
  {
    id: "lead-3",
    name: "Lina Mansour",
    company: "Atlas Cloud",
    email: "lina@atlas.io",
    value: 9600,
    score: 91,
    temperature: "hot",
    stage: "qualified",
    owner: "Sami",
    dueDate: "11 Aug",
  },
  {
    id: "lead-4",
    name: "Paul Bernard",
    company: "BrightOps",
    email: "paul@brightops.co",
    value: 5500,
    score: 68,
    temperature: "warm",
    stage: "qualified",
    owner: "Yosra",
    dueDate: "15 Aug",
  },
  {
    id: "lead-5",
    name: "Sara Trabelsi",
    company: "Kite Finance",
    email: "sara@kite.tn",
    value: 12000,
    score: 88,
    temperature: "hot",
    stage: "meeting",
    owner: "Sami",
    dueDate: "13 Aug",
  },
  {
    id: "lead-6",
    name: "Hugo Leroy",
    company: "Maison Data",
    email: "hugo@maisondata.fr",
    value: 8400,
    score: 79,
    temperature: "warm",
    stage: "proposal",
    owner: "Yosra",
    dueDate: "16 Aug",
  },
  {
    id: "lead-7",
    name: "Nour Gharbi",
    company: "Tunis Labs",
    email: "nour@tunislabs.tn",
    value: 15000,
    score: 95,
    temperature: "hot",
    stage: "won",
    owner: "Sami",
    dueDate: "9 Aug",
  },
  {
    id: "lead-8",
    name: "Emma Dubois",
    company: "Studio Nine",
    email: "emma@studionine.fr",
    value: 3200,
    score: 42,
    temperature: "cold",
    stage: "lost",
    owner: "Yosra",
    dueDate: "7 Aug",
  },
];

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

function LeadCard({
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

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
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

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
