import { CalendarDays, ClipboardList, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ToolsSubTab } from "./tool-types";

export function ToolMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

export function ToolsSubTabs({
  activeTab,
  onChange,
}: {
  activeTab: ToolsSubTab;
  onChange: (tab: ToolsSubTab) => void;
}) {
  const items = [
    {
      value: "integrations" as const,
      label: "Integrations",
      icon: Wrench,
    },
    {
      value: "audit-log" as const,
      label: "Audit log",
      icon: ClipboardList,
    },
    {
      value: "meetings" as const,
      label: "Meetings",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all sm:px-6",
              active
                ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,0.10)]"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
            )}
          >
            <Icon className="size-[18px]" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function ToolsPlaceholder({
  tab,
}: {
  tab: Exclude<ToolsSubTab, "integrations">;
}) {
  return (
    <section className="soft-panel-enter mt-6 flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd]">
      <div className="text-center">
        <h2 className="text-xl font-semibold capitalize">
          {tab.replace("-", " ")}
        </h2>
        <p className="mt-2 text-sm text-[#7b7b85]">
          This module will be connected to the same tools configuration.
        </p>
      </div>
    </section>
  );
}
