"use client";

import { Sparkles } from "lucide-react";
import { FlowDetailsDrawer, FlowEditorDrawer } from "./flow-drawers";
import {
  FlowMetrics,
  FlowNavigation,
  FlowPlaceholder,
} from "./flow-page-panels";
import { FlowsSection } from "./flows-section";
import { useQualificationFlows } from "./use-qualification-flows";

export default function ToursPage() {
  const {
    activeTab,
    setActiveTab,
    flows,
    filteredFlows,
    activeFlowsCount,
    loadError,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    drawerMode,
    selectedFlow,
    form,
    setForm,
    pages,
    openCreateDrawer,
    openViewDrawer,
    openEditDrawer,
    closeDrawer,
    saveFlow,
    deleteFlow,
    toggleEntryPage,
    addStep,
    updateStep,
    removeStep,
    exportFlows,
    importFlows,
  } = useQualificationFlows();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-7 sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px]">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Conversion workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Qualification flows
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Design clear journeys that help agents qualify intent and guide
              every lead to the right next step.
            </p>
          </div>
          <FlowMetrics
            flowsCount={flows.length}
            activeFlowsCount={activeFlowsCount}
            pagesCount={pages.length}
          />
        </header>
        <FlowNavigation
          activeTab={activeTab}
          flowsCount={flows.length}
          pagesCount={pages.length}
          onChange={setActiveTab}
          onExport={exportFlows}
          onImport={importFlows}
        />

        {loadError ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            {loadError}
          </div>
        ) : null}

        {activeTab === "flows" ? (
          <FlowsSection
            flows={filteredFlows}
            totalFlows={flows.length}
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onCreate={openCreateDrawer}
            onView={openViewDrawer}
            onEdit={openEditDrawer}
            onDelete={deleteFlow}
          />
        ) : (
          <FlowPlaceholder tab={activeTab} />
        )}
      </div>

      {drawerMode && (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={closeDrawer}
            className="fixed inset-0 z-40 cursor-default bg-slate-950/45 backdrop-blur-[2px]"
          />

          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[690px] flex-col border-l border-slate-200 bg-white shadow-2xl">
            {drawerMode === "view" && selectedFlow ? (
              <FlowDetailsDrawer
                flow={selectedFlow}
                pages={pages}
                onClose={closeDrawer}
                onEdit={() => openEditDrawer(selectedFlow)}
              />
            ) : (
              <FlowEditorDrawer
                mode={drawerMode}
                form={form}
                pages={pages}
                onFormChange={setForm}
                onToggleEntryPage={toggleEntryPage}
                onAddStep={addStep}
                onUpdateStep={updateStep}
                onRemoveStep={removeStep}
                onClose={closeDrawer}
                onSave={saveFlow}
                onDelete={
                  drawerMode === "edit" && selectedFlow
                    ? () => deleteFlow(selectedFlow.id)
                    : undefined
                }
              />
            )}
          </aside>
        </>
      )}
    </main>
  );
}
