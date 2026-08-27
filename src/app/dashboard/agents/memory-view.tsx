import { BrainCircuit, Check, Database, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { MemoryConfigurationPanel } from "./memory-configuration-panel";
import { MemoryMetric } from "./memory-components";
import { MemoryTracesPanel } from "./memory-traces-panel";
import { useMemory } from "./use-memory";

export function MemoryView() {
  const {
    activeTab,
    activeTraceCount,
    changePageSize,
    changeQuery,
    changeStatusFilter,
    changeTraceStatus,
    changeTypeFilter,
    config,
    filteredTraceCount,
    maintenance,
    message,
    page,
    pageSize,
    promotedTraceCount,
    query,
    runMaintenance,
    saveConfiguration,
    saving,
    setActiveTab,
    setConfig,
    setPage,
    statusFilter,
    totalPages,
    totalTraceCount,
    typeFilter,
    visibleTraces,
  } = useMemory();

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
                value={totalTraceCount}
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
          <MemoryTracesPanel
            changePageSize={changePageSize}
            changeQuery={changeQuery}
            changeStatusFilter={changeStatusFilter}
            changeTraceStatus={changeTraceStatus}
            changeTypeFilter={changeTypeFilter}
            filteredTraceCount={filteredTraceCount}
            page={page}
            pageSize={pageSize}
            query={query}
            setPage={setPage}
            statusFilter={statusFilter}
            totalPages={totalPages}
            typeFilter={typeFilter}
            visibleTraces={visibleTraces}
          />
        ) : (
          <MemoryConfigurationPanel
            config={config}
            maintenance={maintenance}
            runMaintenance={runMaintenance}
            saveConfiguration={saveConfiguration}
            saving={saving}
            setConfig={setConfig}
          />
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
