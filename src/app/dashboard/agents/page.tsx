"use client";

import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";

import { AdvancedAgentsView } from "./advanced-agents-view";
import { SkillsView } from "./agents-skills-page";
import { MemoryView } from "./memory-view";
import { StudioTabs, type StudioTab } from "./studio-tabs";
import { ToolsView } from "./tools-view";

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>("agents");

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-7 sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px]">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> AI workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Build your sales agents
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Give every customer conversation the right knowledge, tools and
              personality.
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 sm:flex">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#5964d6] shadow-sm">
              <Bot className="size-[18px]" />
            </span>
            <span>
              <strong className="block text-slate-900">Agent Studio</strong>
              Configure, test and launch
            </span>
          </div>
        </header>
        <StudioTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "skills" && <SkillsView />}
        {activeTab === "agents" && <AdvancedAgentsView />}
        {activeTab === "tools" && <ToolsView />}
        {activeTab === "memory" && <MemoryView />}
      </div>
    </main>
  );
}
