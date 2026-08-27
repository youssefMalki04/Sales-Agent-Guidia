"use client";

import { Plus, RefreshCcw, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ProfileCard,
  ProfileDetails,
  QuickView,
} from "./advanced-agent-sections";
import { AgentWizard } from "./agent-wizard";
import { AgentPlayground } from "./agent-playground";
import { useAgentStudio } from "./use-agent-studio";

export function AdvancedAgentsView() {
  const {
    profiles,
    wizardOpen,
    setWizardOpen,
    step,
    setStep,
    blueprintTab,
    setBlueprintTab,
    form,
    setForm,
    selected,
    setSelected,
    detailTab,
    setDetailTab,
    quickView,
    setQuickView,
    notice,
    testProfile,
    setTestProfile,
    openWizard,
    editProfile,
    saveAgent,
    resetDemo,
    cloneProfile,
    makeDefault,
    deleteProfile,
    changeStatus,
    closeDetails,
    openQuickViewProfile,
  } = useAgentStudio();

  if (selected) {
    return (
      <ProfileDetails
        profile={selected}
        tab={detailTab}
        onTabChange={setDetailTab}
        onBack={closeDetails}
      />
    );
  }

  return (
    <>
      <section className="soft-panel-enter mt-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 px-6 py-7 sm:px-8">
          <div className="absolute -right-10 -top-16 size-52 rounded-full bg-[#dfe2ff]/40 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
                <Sparkles className="size-3.5" /> Your AI team
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Sales agents
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create specialized agents, then test and publish them when they
                are ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profiles.length > 0 && (
                <Button
                  variant="outline"
                  className="rounded-xl border-white bg-white/80 text-slate-600 shadow-sm hover:bg-white"
                  onClick={resetDemo}
                >
                  <RefreshCcw className="size-4" /> Reset demo
                </Button>
              )}
              <Button
                onClick={() => openWizard()}
                className="rounded-xl bg-[#5964d6] px-5 text-white shadow-[0_9px_22px_rgba(89,100,214,.22)] hover:bg-[#4f5acb]"
              >
                <Plus className="size-4" /> Create agent
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">
              Your agents
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Manage their status, setup and website integration.
            </p>
          </div>
          {profiles.length > 0 && (
            <Badge
              variant="outline"
              className="rounded-full border-[#e1e4f8] bg-[#f1f2ff] px-3 text-[#626cd1]"
            >
              {profiles.length} {profiles.length === 1 ? "agent" : "agents"}
            </Badge>
          )}
        </div>

        {profiles.length === 0 ? (
          <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd] px-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#5964d6] shadow-sm">
              <Users className="size-6" />
            </span>
            <p className="mt-4 font-semibold text-slate-900">
              Create your first sales agent
            </p>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Choose a template, add your business context and test the
              conversation before publishing.
            </p>
            <Button
              onClick={() => openWizard()}
              className="mt-5 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            >
              <Plus className="size-4" /> Create agent
            </Button>
          </div>
        ) : (
          <div className="soft-stagger mt-5 grid gap-5 lg:grid-cols-2">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onView={() => setSelected(profile)}
                onQuickView={() => setQuickView(profile)}
                onEdit={() => editProfile(profile)}
                onClone={() => cloneProfile(profile)}
                onDefault={() => makeDefault(profile)}
                onDelete={() => deleteProfile(profile)}
                onStatusChange={() => changeStatus(profile)}
                onTest={() => setTestProfile(profile)}
              />
            ))}
          </div>
        )}

        {notice && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {notice}
          </div>
        )}
      </section>

      <AgentWizard
        open={wizardOpen}
        step={step}
        form={form}
        blueprintTab={blueprintTab}
        onOpenChange={setWizardOpen}
        onStepChange={setStep}
        onBlueprintTabChange={setBlueprintTab}
        onFormChange={setForm}
        onCreate={saveAgent}
      />

      <QuickView
        profile={quickView}
        onClose={() => setQuickView(null)}
        onOpen={openQuickViewProfile}
      />
      <AgentPlayground
        key={testProfile?.id}
        profile={testProfile}
        onClose={() => setTestProfile(null)}
      />
    </>
  );
}
