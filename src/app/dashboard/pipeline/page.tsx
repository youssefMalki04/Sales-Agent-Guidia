"use client";

import { Plus, Sparkles } from "lucide-react";
import { PipelineCreateDialog } from "./pipeline-create-dialog";
import {
  PipelineBoard,
  PipelineStats,
  PipelineToolbar,
} from "./pipeline-panels";
import { usePipeline } from "./use-pipeline";

export default function PipelinePage() {
  const {
    leads,
    filteredLeads,
    error,
    setError,
    query,
    setQuery,
    temperature,
    setTemperature,
    draggingId,
    setDraggingId,
    overStage,
    setOverStage,
    createOpen,
    setCreateOpen,
    addLead,
    moveLead,
  } = usePipeline();

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
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" /> New opportunity
          </button>
        </header>

        {createOpen ? (
          <PipelineCreateDialog
            onClose={() => setCreateOpen(false)}
            onCreated={addLead}
            onError={setError}
          />
        ) : null}

        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        ) : null}

        <PipelineStats leads={leads} />
        <PipelineToolbar
          query={query}
          temperature={temperature}
          onQueryChange={setQuery}
          onTemperatureChange={setTemperature}
        />
        <PipelineBoard
          leads={filteredLeads}
          draggingId={draggingId}
          overStage={overStage}
          onDraggingChange={setDraggingId}
          onOverStageChange={setOverStage}
          onMoveLead={moveLead}
        />
      </div>
    </main>
  );
}
