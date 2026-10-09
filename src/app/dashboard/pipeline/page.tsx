"use client";

import { Plus, Columns3 } from "lucide-react";
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
    movingIds,
    filteredLeads,
    followUps,
    withoutFollowUp,
    setWithoutFollowUp,
    overdueOnly,
    setOverdueOnly,
    owner,
    owners,
    setOwner,
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
    updateLead,
    moveLead,
  } = usePipeline();

  return (
    <main className="min-h-[calc(100vh-76px)] min-w-0 bg-white px-4 py-6 text-[#171717] sm:px-6 xl:px-8">
      <div className="soft-page-enter mx-auto min-w-0 max-w-[1500px] space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-950">
              <Columns3 className="size-6 text-[#5964d6]" /> Sales pipeline
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              Move each opportunity through your commercial process.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#5964d6] px-4 text-sm font-medium text-white hover:bg-[#4f5acb]"
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
          <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        ) : null}

        <PipelineStats leads={leads} />
        <PipelineToolbar
          withoutFollowUp={withoutFollowUp}
          onWithoutFollowUpChange={setWithoutFollowUp}
          followUpsReady={followUps.loaded && !followUps.error}
          overdueOnly={overdueOnly}
          onOverdueChange={setOverdueOnly}
          resultCount={filteredLeads.length}
          totalCount={leads.length}
          onReset={() => { setQuery(""); setOwner(""); setTemperature("all"); setOverdueOnly(false); setWithoutFollowUp(false); }}
          owner={owner}
          owners={owners}
          onOwnerChange={setOwner}
          query={query}
          temperature={temperature}
          onQueryChange={setQuery}
          onTemperatureChange={setTemperature}
        />
        <PipelineBoard
          movingIds={movingIds}
          followUps={followUps}
          onUpdated={updateLead}
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
