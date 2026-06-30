"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

import { AgentDetail } from "@/components/leadia/agent-detail";
import { AgentDetailsDialog } from "@/components/leadia/agent-details-dialog";
import { CreateAgentSheet } from "@/components/leadia/create-agent-sheet";
import { defaultAgent, emptyAgentForm } from "@/components/leadia/data";
import { SalesAgentsView } from "@/components/leadia/sales-agents-view";
import { Sidebar } from "@/components/leadia/sidebar";
import { Topbar } from "@/components/leadia/topbar";
import type {
  SalesAgentApp,
  SalesAgentForm,
  WorkspaceTab,
  WorkspaceView,
} from "@/components/leadia/types";
import { WorkspaceCard } from "@/components/leadia/workspace-card";
import { WorkspaceSwitcher } from "@/components/leadia/workspace-switcher";

export function SalesAgentWorkspace() {
  const [tab, setTab] = useState<WorkspaceTab>("workspaces");
  const [view, setView] = useState<WorkspaceView>("workspace");
  const [agents, setAgents] = useState<SalesAgentApp[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsAgent, setDetailsAgent] = useState<SalesAgentApp | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<SalesAgentApp | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState<SalesAgentForm>(emptyAgentForm);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function createAgent() {
    const agent: SalesAgentApp = {
      ...defaultAgent,
      ...form,
      id: `agent_${Math.random().toString(16).slice(2, 10)}`,
      created: "6/30/2026",
      active: true,
    };

    setAgents((current) => [agent, ...current].slice(0, 5));
    setSelectedAgent(agent);
    setCreateOpen(false);
    showToast("Sales agent created.");
  }

  function updateAgent(nextAgent: SalesAgentApp) {
    setAgents((current) =>
      current.map((agent) => (agent.id === nextAgent.id ? nextAgent : agent)),
    );
    setSelectedAgent(nextAgent);
  }

  function deleteAgent(agentToDelete: SalesAgentApp) {
    setAgents((current) =>
      current.filter((agent) => agent.id !== agentToDelete.id),
    );
    setSelectedAgent(null);
    setDetailsAgent(null);
    setView("workspace");
    setTab("sales-agents");
    showToast("Sales agent deleted.");
  }

  return (
    <main className="min-h-screen bg-[#fbfbfc] text-[#171717]">
      <div className="grid min-h-screen lg:grid-cols-[296px_1fr]">
        <Sidebar />

        <section className="min-w-0">
          <Topbar
            title={view === "agent-detail" ? "Admin console" : "Workspace"}
            agentName={selectedAgent?.name}
          />

          {view === "workspace" ? (
            <div className="px-5 py-9 sm:px-8 xl:px-14">
              <div className="mx-auto max-w-[1308px]">
                <WorkspaceSwitcher
                  tab={tab}
                  onTabChange={setTab}
                  onCreateAgent={() => {
                    setTab("sales-agents");
                    setCreateOpen(true);
                  }}
                />
                {tab === "workspaces" ? (
                  <WorkspaceCard />
                ) : (
                  <SalesAgentsView
                    agents={agents}
                    onCreateAgent={() => setCreateOpen(true)}
                    onViewDetails={setDetailsAgent}
                    onOpenRecord={(agent) => {
                      setSelectedAgent(agent);
                      setView("agent-detail");
                    }}
                    onToggleActive={(agent) => {
                      const nextAgent = { ...agent, active: !agent.active };
                      updateAgent(nextAgent);
                      showToast(
                        nextAgent.active
                          ? "Sales agent enabled."
                          : "Sales agent disabled.",
                      );
                    }}
                    onDelete={deleteAgent}
                  />
                )}
              </div>
            </div>
          ) : selectedAgent ? (
            <AgentDetail
              agent={selectedAgent}
              onBack={() => setView("workspace")}
              onSave={(nextAgent) => {
                updateAgent(nextAgent);
                showToast("Sales agent saved.");
              }}
              onDelete={deleteAgent}
            />
          ) : null}
        </section>
      </div>

      <CreateAgentSheet
        open={createOpen}
        form={form}
        onOpenChange={setCreateOpen}
        onFormChange={setForm}
        onCreate={createAgent}
      />

      <AgentDetailsDialog
        agent={detailsAgent}
        onOpenChange={(open) => {
          if (!open) setDetailsAgent(null);
        }}
        onOpenRecord={(agent) => {
          setDetailsAgent(null);
          setSelectedAgent(agent);
          setView("agent-detail");
        }}
      />

      {toast ? (
        <div className="fixed left-1/2 top-8 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-md border border-[#cdeed4] bg-[#ecfff0] px-5 py-3 text-sm font-semibold text-[#267a3f] shadow-lg">
          <CheckCircle2 className="size-5" />
          {toast}
        </div>
      ) : null}

      <button
        aria-label="Assistant"
        className="fixed right-5 top-1/2 hidden size-[76px] -translate-y-1/2 items-center justify-center rounded-l-[28px] rounded-r-none border border-[#c8c0ec] bg-white text-[#6654d9] shadow-[0_14px_40px_rgba(27,20,85,0.12)] lg:flex"
      >
        <Sparkles className="size-6" />
      </button>
    </main>
  );
}
