"use client";

import { Blocks, CheckCircle2, Zap } from "lucide-react";
import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";
import {
  IntegrationCatalog,
  SynchronizationActivity,
} from "./integration-center-panels";
import { ConfigPanel } from "./integration-ui";
import { useIntegrations } from "./use-integrations";

export default function IntegrationsPage() {
  const {
    integrations,
    events,
    query,
    setQuery,
    category,
    setCategory,
    selectedIntegration,
    setSelectedId,
    testing,
    testResult,
    loading,
    filteredIntegrations,
    connectedCount,
    totalEvents,
    testConnection,
    openIntegration,
  } = useIntegrations();

  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-slate-950 sm:px-8 xl:px-12">
      <div className="mx-auto max-w-[1400px] space-y-7">
        <PageIntro
          eyebrow="Connected ecosystem"
          title="Integration center"
          description="Connect your sales stack and automate actions after every qualified conversation."
          action={
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              {connectedCount} services connected
            </div>
          }
        />

        <section className="soft-stagger grid gap-4 sm:grid-cols-3">
          <DashboardMetric
            icon={<Blocks className="size-5" />}
            label="Available integrations"
            value={integrations.length}
          />
          <DashboardMetric
            icon={<CheckCircle2 className="size-5" />}
            label="Active connections"
            value={connectedCount}
            tone="success"
          />
          <DashboardMetric
            icon={<Zap className="size-5" />}
            label="Synced events"
            value={totalEvents}
          />
        </section>

        <IntegrationCatalog
          integrations={filteredIntegrations}
          query={query}
          category={category}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
          onOpen={openIntegration}
        />

        <SynchronizationActivity events={events} loading={loading} />
      </div>

      {selectedIntegration ? (
        <ConfigPanel
          integration={selectedIntegration}
          testing={testing}
          testResult={testResult}
          onClose={() => setSelectedId(null)}
          onTest={testConnection}
        />
      ) : null}
    </main>
  );
}
