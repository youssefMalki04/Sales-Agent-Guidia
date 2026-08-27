import { CheckCircle2, Sparkles } from "lucide-react";

import { CredentialsDialog } from "./credentials-dialog";
import {
  IntegrationCard,
  ToolMetric,
  ToolsPlaceholder,
  ToolsSubTabs,
} from "./tools-panels";
import { useTools } from "./use-tools";

export function ToolsView() {
  const {
    activeCount,
    changePolicy,
    closeCredentials,
    connectedCount,
    credentials,
    integrations,
    openCredentials,
    saveCredentials,
    selectedIntegration,
    setCredentialValue,
    setSubTab,
    subTab,
    testIntegration,
    testingId,
    toast,
    toggleIntegration,
  } = useTools();

  return (
    <>
      <section className="soft-panel-enter mt-6 overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
              <Sparkles className="size-3.5" /> Connected workspace
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Agent tools
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Connect the services your agents need to complete customer tasks.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <ToolMetric value={connectedCount} label="Connected" />
            <ToolMetric value={activeCount} label="Active" />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
        <ToolsSubTabs activeTab={subTab} onChange={setSubTab} />
      </section>

      {subTab === "integrations" ? (
        <section className="soft-stagger mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              isTesting={testingId === integration.id}
              onToggleActive={() => toggleIntegration(integration.id)}
              onPolicyChange={(policy) => changePolicy(integration.id, policy)}
              onCredentials={() => openCredentials(integration)}
              onTest={() => testIntegration(integration.id)}
            />
          ))}
        </section>
      ) : (
        <ToolsPlaceholder tab={subTab} />
      )}

      <CredentialsDialog
        integration={selectedIntegration}
        values={credentials}
        onValueChange={setCredentialValue}
        onClose={closeCredentials}
        onSave={saveCredentials}
      />

      {toast ? (
        <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          <CheckCircle2 className="size-5" />
          {toast}
        </div>
      ) : null}
    </>
  );
}
