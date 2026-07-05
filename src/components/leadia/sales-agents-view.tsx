import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { SalesAgentApp } from "./types";

export function SalesAgentsView({
  agents,
  onCreateAgent,
  onViewDetails,
  onOpenRecord,
  onToggleActive,
  onDelete,
}: {
  agents: SalesAgentApp[];
  onCreateAgent: () => void;
  onViewDetails: (agent: SalesAgentApp) => void;
  onOpenRecord: (agent: SalesAgentApp) => void;
  onToggleActive: (agent: SalesAgentApp) => void;
  onDelete: (agent: SalesAgentApp) => void;
}) {
  return (
    <section className="mt-7">
      <p className="text-sm font-semibold text-[#8b8b94]">
        {agents.length} / 5 sales agents
      </p>

      {agents.length === 0 ? (
        <div className="mt-7 flex h-32 items-center justify-center rounded-lg border border-[#e5e5e8] bg-white text-sm font-semibold text-[#8b8b94]">
          No sales agent for this workspace.
        </div>
      ) : (
        <div className="mt-7 overflow-hidden rounded-lg border border-[#e5e5e8] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e5e5e8] text-xs font-semibold uppercase text-[#8b8b94]">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Public URL</th>
                <th className="px-5 py-3">Allowed domains</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-[#eeeeef] last:border-0"
                >
                  <td className="px-5 py-4 font-semibold">{agent.name}</td>
                  <td className="px-5 py-4 text-[#777780]">{agent.slug}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        agent.active
                          ? "bg-[#e8f7ee] text-[#267a46]"
                          : "bg-[#f3f3f5] text-[#777780]",
                      )}
                    >
                      {agent.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#777780]">{agent.created}</td>
                  <td className="px-5 py-4 text-[#777780]">{agent.baseUrl}</td>
                  <td className="px-5 py-4 text-[#777780]">
                    {agent.allowedDomains}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 rounded-md">
                          Actions
                          <ChevronDown className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onViewDetails(agent)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenRecord(agent)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive(agent)}>
                          {agent.active ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(agent)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={onCreateAgent} className="sr-only">
        New sales agent
      </button>
    </section>
  );
}
