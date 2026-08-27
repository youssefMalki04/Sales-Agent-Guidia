import { Download, FileText, GitBranch, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { FlowMainTab } from "./flow-types";

export function FlowMetrics({
  flowsCount,
  activeFlowsCount,
  pagesCount,
}: {
  flowsCount: number;
  activeFlowsCount: number;
  pagesCount: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <FlowMetric value={flowsCount} label="Flows" />
      <FlowMetric value={activeFlowsCount} label="Active" />
      <FlowMetric value={pagesCount} label="Pages" />
    </div>
  );
}

export function FlowNavigation({
  activeTab,
  flowsCount,
  pagesCount,
  onChange,
  onImport,
  onExport,
}: {
  activeTab: FlowMainTab;
  flowsCount: number;
  pagesCount: number;
  onChange: (tab: FlowMainTab) => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}) {
  const tabs: Array<{
    value: FlowMainTab;
    label: string;
    count?: number;
    icon: typeof Sparkles;
  }> = [
    { value: "generate", label: "Generate with AI", icon: Sparkles },
    { value: "pages", label: "Pages", count: pagesCount, icon: FileText },
    { value: "actions", label: "Actions", count: 1, icon: Sparkles },
    { value: "flows", label: "Flows", count: flowsCount, icon: GitBranch },
  ];

  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-1 sm:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChange(tab.value)}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all",
                  active
                    ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,0.10)]"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
                )}
              >
                <Icon className="size-[18px]" />
                {tab.label}
                {typeof tab.count === "number" ? (
                  <span
                    className={cn(
                      "text-sm",
                      active ? "text-[#5964d6]" : "text-slate-400",
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]">
            <Upload className="size-4" />
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={onImport}
              className="hidden"
            />
          </label>

          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="h-10 gap-2 rounded-xl border-slate-200 px-4 text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
          >
            <Download className="size-4" />
            Export JSON
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FlowPlaceholder({ tab }: { tab: FlowMainTab }) {
  return (
    <section className="soft-panel-enter mt-6 flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd]">
      <p className="text-sm text-[#777780]">
        Interface « {tab} » à connecter ici.
      </p>
    </section>
  );
}

function FlowMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-20 rounded-2xl border border-slate-100 bg-[#fafafd] px-3 py-3">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}
