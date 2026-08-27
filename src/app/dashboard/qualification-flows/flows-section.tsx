import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconButton } from "./flow-drawers";
import type { QualificationFlow as Flow } from "./flow-types";

type FlowStatusFilter = "all" | "active" | "inactive";

type FlowsSectionProps = {
  flows: Flow[];
  totalFlows: number;
  search: string;
  statusFilter: FlowStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: FlowStatusFilter) => void;
  onCreate: () => void;
  onView: (flow: Flow) => void;
  onEdit: (flow: Flow) => void;
  onDelete: (flowId: string) => void;
};

export function FlowsSection({
  flows,
  totalFlows,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: FlowsSectionProps) {
  return (
    <section className="soft-panel-enter mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <h1 className="min-w-[64px] text-lg font-semibold text-[#202026]">
          Flows
        </h1>
        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fafafd] p-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search flows..."
            className="h-10 rounded-xl border-slate-200 bg-white sm:max-w-[220px]"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as FlowStatusFilter)
            }
            className="h-10 min-w-[200px] rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-xl border border-[#e1e4f8] bg-[#f1f2ff] px-3 text-sm font-semibold text-[#5964d6]">
            {flows.length}/{totalFlows}
          </span>
          <Button
            type="button"
            onClick={onCreate}
            className="h-10 gap-2 rounded-xl bg-[#5964d6] px-5 text-white hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" />
            Add flow
          </Button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="bg-[#fafafd] text-left">
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" aria-label="Select all flows" />
                </th>
                {["Title", "Key", "Steps", "Active"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]"
                  >
                    {label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {flows.map((flow) => (
                <tr
                  key={flow.id}
                  className="border-t border-slate-100 transition hover:bg-[#fafaff]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${flow.title}`}
                    />
                  </td>
                  <td className="max-w-[290px] px-4 py-4">
                    <p className="truncate text-sm font-semibold text-[#303038]">
                      {flow.title}
                    </p>
                  </td>
                  <td className="max-w-[300px] px-4 py-4">
                    <p className="truncate font-mono text-xs text-[#777780]">
                      {flow.key}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#50505a]">
                    {flow.steps.length}
                  </td>
                  <td className="px-4 py-4">
                    {flow.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <Check className="size-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-sm text-[#a1a1aa]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        label="View flow"
                        onClick={() => onView(flow)}
                      >
                        <Eye className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Edit flow"
                        onClick={() => onEdit(flow)}
                      >
                        <Pencil className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Delete flow"
                        danger
                        onClick={() => onDelete(flow.id)}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {flows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-[#303038]">
                      No flows found
                    </p>
                    <p className="mt-2 text-sm text-[#85858e]">
                      Change the filters or create a new flow.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-[#e8e8eb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#777780]">
            Showing 1–{flows.length} of {flows.length}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#777780]">Per page</span>
            <select className="h-9 rounded-full border border-[#dedee3] bg-white px-3 text-sm">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="inline-flex h-9 items-center rounded-full border border-[#dedee3] px-4 text-sm font-semibold">
              1 / 1
            </span>
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-9 rounded-full"
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-9 rounded-full"
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
