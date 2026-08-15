"use client";

import { useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  RefreshCcw,
  Save,
  Search,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MemoryTab = "traces" | "configuration";
type TraceStatus = "active" | "rejected" | "promoted";
type TraceType = "pitfall" | "summary" | "selector" | "strategy";

type LearningTrace = {
  id: string;
  type: TraceType;
  status: TraceStatus;
  content: string;
  confidence: number;
  decay: number;
  usage: number;
  source: string;
};

type MemoryConfig = {
  enabled: boolean;
  autoInject: Record<TraceType, boolean>;
  reviewRequired: Record<TraceType, boolean>;
  retentionDays: number;
  activeTraceLimit: number;
  minConfidence: number;
};

const initialTraces: LearningTrace[] = [
  {
    id: "1",
    type: "pitfall",
    status: "active",
    content:
      "L'envoi de multiples messages de relance fragmentés par l'agent peut paraître intrusif lorsque le visiteur ne fournit que des réponses monosyllabiques.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "2",
    type: "pitfall",
    status: "active",
    content:
      "Éviter de basculer vers une autre langue sans confirmation, ce qui peut rompre la fluidité si le visiteur utilise des termes isolés.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "3",
    type: "summary",
    status: "active",
    content:
      "L'échange a échoué car l'agent n'a pas su interpréter certains termes isolés malgré une tentative de scan de page.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "4",
    type: "summary",
    status: "active",
    content:
      "Le visiteur a sollicité une aide en tunisien pour créer une facture, mais l'agent a rencontré une difficulté technique par manque de guide pré-configuré.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "5",
    type: "pitfall",
    status: "active",
    content:
      "Annoncer la recherche d'un guide automatisé pour finalement échouer crée une rupture dans le flux.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "6",
    type: "selector",
    status: "active",
    content:
      "Pour les demandes de facturation, le chemin d'accès standard est l'onglet Organisation situé dans le menu latéral gauche.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "7",
    type: "strategy",
    status: "active",
    content:
      "Commencer par reformuler la demande avant de proposer une action ou une navigation.",
    confidence: 0.82,
    decay: 0.96,
    usage: 4,
    source: "maintenance",
  },
];

const initialConfig: MemoryConfig = {
  enabled: true,
  autoInject: { selector: true, pitfall: true, summary: true, strategy: false },
  reviewRequired: {
    selector: false,
    pitfall: false,
    summary: false,
    strategy: true,
  },
  retentionDays: 30,
  activeTraceLimit: 150,
  minConfidence: 0.4,
};

export function MemoryView() {
  const [activeTab, setActiveTab] = useState<MemoryTab>("traces");
  const [traces, setTraces] = useState(initialTraces);
  const [statusFilter, setStatusFilter] = useState<"all" | TraceStatus>(
    "active",
  );
  const [typeFilter, setTypeFilter] = useState<"all" | TraceType>("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return traces.filter(
      (trace) =>
        (statusFilter === "all" || trace.status === statusFilter) &&
        (typeFilter === "all" || trace.type === typeFilter) &&
        (!q ||
          trace.content.toLowerCase().includes(q) ||
          trace.source.toLowerCase().includes(q)),
    );
  }, [query, statusFilter, traces, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeTraceCount = traces.filter(
    (trace) => trace.status === "active",
  ).length;
  const promotedTraceCount = traces.filter(
    (trace) => trace.status === "promoted",
  ).length;

  function flash(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2500);
  }

  function saveConfiguration() {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      flash("Configuration saved.");
    }, 900);
  }

  function runMaintenance() {
    setMaintenance(true);
    window.setTimeout(() => {
      setTraces((current) =>
        current.filter((trace) => trace.status !== "rejected"),
      );
      setMaintenance(false);
      flash("Maintenance completed.");
    }, 1200);
  }

  return (
    <>
      <section className="mt-7">
        <div className="soft-panel-enter overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 p-6 sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
                <Sparkles className="size-3.5" /> Continuous learning
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Agent memory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review what your agents learn and control how knowledge is
                reused.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MemoryMetric
                value={traces.length}
                label="Total"
                icon={Database}
              />
              <MemoryMetric
                value={activeTraceCount}
                label="Active"
                icon={BrainCircuit}
              />
              <MemoryMetric
                value={promotedTraceCount}
                label="Promoted"
                icon={Check}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 inline-flex rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
          {(["traces", "configuration"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition-all",
                activeTab === tab
                  ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,0.10)]"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "traces" ? (
          <section className="soft-panel-enter mt-5 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
            <header className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
                <h2 className="shrink-0 text-lg font-semibold">
                  Learning traces
                </h2>
                <p className="truncate text-sm text-[#7b7b85]">
                  Lessons extracted at the end of conversations and runs.
                  Approve, reject, or promote to a Knowledge document.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search traces..."
                    className="h-10 w-[210px] rounded-xl border-slate-200 pl-9"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as "all" | TraceStatus);
                    setPage(1);
                  }}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="all">All status</option>
                  <option value="active">active</option>
                  <option value="promoted">promoted</option>
                  <option value="rejected">rejected</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value as "all" | TraceType);
                    setPage(1);
                  }}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="all">All types</option>
                  <option value="pitfall">pitfall</option>
                  <option value="summary">summary</option>
                  <option value="selector">selector</option>
                  <option value="strategy">strategy</option>
                </select>
                <span className="text-sm text-[#8a8a93]">
                  {filtered.length} results
                </span>
              </div>
            </header>

            {visible.length === 0 ? (
              <div className="p-6">
                <div className="flex min-h-16 items-center rounded-md bg-[#f4f4f5] px-4 text-sm text-[#8a8a93]">
                  No results
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse">
                  <thead>
                    <tr className="bg-[#fafafd] text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Content</th>
                      <th className="px-4 py-3">Conf.</th>
                      <th className="px-4 py-3">Decay</th>
                      <th className="px-4 py-3">Usage</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((trace) => (
                      <tr
                        key={trace.id}
                        className="border-b border-[#ececef] align-top text-sm"
                      >
                        <td className="px-4 py-3">
                          <TypeBadge type={trace.type} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={trace.status} />
                        </td>
                        <td className="max-w-[520px] px-4 py-3 leading-6">
                          {trace.content}
                        </td>
                        <td className="px-4 py-3">
                          {trace.confidence.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">{trace.decay.toFixed(2)}</td>
                        <td className="px-4 py-3">{trace.usage}</td>
                        <td className="px-4 py-3 text-[#7b7b85]">
                          {trace.source}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setTraces((current) =>
                                  current.map((item) =>
                                    item.id === trace.id
                                      ? { ...item, status: "rejected" }
                                      : item,
                                  ),
                                )
                              }
                              disabled={trace.status === "rejected"}
                              className="rounded-lg border-rose-200 bg-rose-50 text-rose-600"
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setTraces((current) =>
                                  current.map((item) =>
                                    item.id === trace.id
                                      ? { ...item, status: "promoted" }
                                      : item,
                                  ),
                                )
                              }
                              disabled={trace.status === "promoted"}
                              className="rounded-lg border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]"
                            >
                              Promote
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageSizeChange={(value) => {
                setPageSize(value);
                setPage(1);
              }}
              onPageChange={setPage}
            />
          </section>
        ) : (
          <section className="soft-panel-enter mt-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Continuous learning configuration
                </h2>
                <p className="mt-2 text-sm text-[#7b7b85]">
                  Define what the agent can learn on its own and what requires
                  your approval.
                </p>
              </div>
              <Button
                disabled={maintenance}
                onClick={runMaintenance}
                className="gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                {maintenance ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCcw className="size-4" />
                )}
                Run maintenance
              </Button>
            </div>

            <div className="mt-6 space-y-6">
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) =>
                    setConfig({ ...config, enabled: e.target.checked })
                  }
                />
                Continuous learning enabled
              </label>
              <ConfigGroup
                title="Auto-inject (immediately available to the agent):"
                values={config.autoInject}
                onChange={(type, checked) =>
                  setConfig({
                    ...config,
                    autoInject: { ...config.autoInject, [type]: checked },
                  })
                }
              />
              <ConfigGroup
                title="Requires review before use:"
                values={config.reviewRequired}
                onChange={(type, checked) =>
                  setConfig({
                    ...config,
                    reviewRequired: {
                      ...config.reviewRequired,
                      [type]: checked,
                    },
                  })
                }
              />
              <div className="grid gap-5 md:grid-cols-2">
                <NumberField
                  label="Trace retention (days)"
                  value={config.retentionDays}
                  step={1}
                  helper="Automatically archived after this period."
                  onChange={(value) =>
                    setConfig({ ...config, retentionDays: value })
                  }
                />
                <NumberField
                  label="Active trace limit"
                  value={config.activeTraceLimit}
                  step={1}
                  helper="Oldest traces are archived beyond this limit."
                  onChange={(value) =>
                    setConfig({ ...config, activeTraceLimit: value })
                  }
                />
                <NumberField
                  label="Minimum confidence threshold (retrieval)"
                  value={config.minConfidence}
                  step={0.1}
                  onChange={(value) =>
                    setConfig({ ...config, minConfidence: value })
                  }
                />
              </div>
              <Button
                disabled={saving}
                onClick={saveConfiguration}
                className="gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save configuration
              </Button>
            </div>

            <div className="mt-7 border-t border-[#ececef] pt-5">
              <h3 className="font-semibold">Maintenance history</h3>
              <p className="mt-2 text-xs text-[#8a8a93]">
                08/06/2026 11:55:28 · by manual · decay 0 · purge 19
              </p>
              <div className="mt-4">
                <Pagination
                  page={1}
                  totalPages={1}
                  pageSize={10}
                  onPageSizeChange={() => undefined}
                  onPageChange={() => undefined}
                />
              </div>
            </div>
          </section>
        )}
      </section>

      {message ? (
        <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          <Check className="size-4" />
          {message}
        </div>
      ) : null}
    </>
  );
}

function MemoryMetric({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: typeof Database;
}) {
  return (
    <div className="min-w-20 rounded-2xl border border-white bg-white/80 px-3 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-[#5964d6]" />
        <p className="text-lg font-semibold text-slate-950">{value}</p>
      </div>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function ConfigGroup({
  title,
  values,
  onChange,
}: {
  title: string;
  values: Record<TraceType, boolean>;
  onChange: (type: TraceType, checked: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafafd] p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {(Object.keys(values) as TraceType[]).map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm capitalize"
          >
            <input
              type="checkbox"
              checked={values[type]}
              onChange={(e) => onChange(type, e.target.checked)}
              className="accent-[#5964d6]"
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  step,
  helper,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  helper?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl border border-slate-100 bg-[#fafafd] p-5">
      <span className="text-sm font-semibold">{label}</span>
      <Input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 rounded-xl border-slate-200 bg-white"
      />
      {helper ? <p className="mt-2 text-xs text-[#8a8a93]">{helper}</p> : null}
    </label>
  );
}

function Pagination({
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  onPageChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#ececef] bg-[#fafafa] px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex items-center gap-2 text-sm text-[#777780]">
        <span>Per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 rounded-md border border-[#dedee3] bg-white px-3"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <Badge variant="outline" className="h-9 bg-white px-4">
        {page} / {totalPages}
      </Badge>
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function TypeBadge({ type }: { type: TraceType }) {
  const styles: Record<TraceType, string> = {
    pitfall: "border-amber-200 bg-amber-50 text-amber-700",
    summary: "border-[#dedee3] bg-[#f4f4f5] text-[#55555f]",
    selector: "border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]",
    strategy: "border-cyan-200 bg-cyan-50 text-cyan-700",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full", styles[type])}>
      {type}
    </Badge>
  );
}

function StatusBadge({ status }: { status: TraceStatus }) {
  const styles: Record<TraceStatus, string> = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    promoted: "border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full", styles[status])}>
      {status}
    </Badge>
  );
}
