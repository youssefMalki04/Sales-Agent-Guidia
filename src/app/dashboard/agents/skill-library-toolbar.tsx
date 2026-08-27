import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { SkillSource } from "./skill-types";

export function SkillMetric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

export function SkillsToolbar({
  platformCount,
  customCount,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onCreate,
}: {
  platformCount: number;
  customCount: number;
  query: string;
  filter: "all" | SkillSource;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: "all" | SkillSource) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#fafafd] px-4 py-4 ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-[#303038]">Skills</span>
          <span className="text-[#6f6f78]">◈ Platform {platformCount}</span>
          <span className="text-[#6f6f78]">•</span>
          <span className="text-[#6f6f78]">⬡ Custom {customCount}</span>
        </div>

        <div className="relative w-full lg:w-[230px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter..."
            className="h-10 rounded-xl border-slate-200 bg-white pl-9"
          />
        </div>

        <div className="flex items-center gap-1">
          {(["all", "platform", "custom"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={cn(
                "h-9 rounded-xl px-3 text-xs font-semibold capitalize transition-all",
                filter === value
                  ? "border border-[#cfd3ed] bg-white text-[#5964d6] shadow-sm"
                  : "text-slate-500 hover:bg-white",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={onCreate}
        className="h-10 gap-2 rounded-xl bg-[#5964d6] px-4 text-white shadow-[0_9px_22px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
      >
        <Plus className="size-4" />
        Create
      </Button>
    </div>
  );
}
