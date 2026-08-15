import { Bot, BrainCircuit, Layers3, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export type StudioTab = "skills" | "tools" | "agents" | "memory";

const tabs = [
  { value: "skills", label: "Skills", icon: Layers3 },
  { value: "tools", label: "Tools", icon: Wrench },
  { value: "agents", label: "Agents", icon: Bot },
  { value: "memory", label: "Memory", icon: BrainCircuit },
] as const satisfies ReadonlyArray<{
  value: StudioTab;
  label: string;
  icon: typeof Layers3;
}>;

type StudioTabsProps = {
  activeTab: StudioTab;
  onChange: (tab: StudioTab) => void;
};

export function StudioTabs({ activeTab, onChange }: StudioTabsProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
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
                "inline-flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,0.10)]"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
              )}
            >
              <Icon className="size-[18px]" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
