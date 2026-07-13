import { Bot, Building2, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { WorkspaceTab } from "./types";

export function WorkspaceSwitcher({
  tab,
  onTabChange,
  onCreateAgent,
}: {
  tab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onCreateAgent: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#e5e5e8] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.03)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-4">
          <SwitchButton
            active={tab === "workspaces"}
            icon={Building2}
            label="Workspaces"
            onClick={() => onTabChange("workspaces")}
          />
          <SwitchButton
            active={tab === "sales-agents"}
            icon={Bot}
            label="Sales agents"
            onClick={() => onTabChange("sales-agents")}
          />
        </div>

        <Button
          onClick={tab === "sales-agents" ? onCreateAgent : undefined}
          className="h-10 gap-2 rounded-md bg-[#151518] px-5 text-sm font-semibold text-white hover:bg-[#28282d]"
        >
          <Plus className="size-4" />
          {tab === "sales-agents" ? "New sales agent" : "New workspace"}
        </Button>
      </div>
    </div>
  );
}

function SwitchButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-[52px] min-w-[174px] items-center justify-center gap-3 rounded-md px-6 text-sm font-semibold",
        active ? "bg-[#161619] text-white shadow-sm" : "text-[#64646d] hover:bg-[#f7f7f8]",
      )}
    >
      <Icon className={cn("size-5", active ? "text-[#c9c9cd]" : "text-[#96969f]")} />
      {label}
    </button>
  );
}
