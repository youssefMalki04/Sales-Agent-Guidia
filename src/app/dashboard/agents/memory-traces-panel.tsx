import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Pagination, StatusBadge, TypeBadge } from "./memory-components";
import type { TraceStatus, TraceType } from "./memory-data";
import type { useMemory } from "./use-memory";

type MemoryTracesPanelProps = Pick<
  ReturnType<typeof useMemory>,
  | "changePageSize"
  | "changeQuery"
  | "changeStatusFilter"
  | "changeTraceStatus"
  | "changeTypeFilter"
  | "filteredTraceCount"
  | "page"
  | "pageSize"
  | "query"
  | "setPage"
  | "statusFilter"
  | "totalPages"
  | "typeFilter"
  | "visibleTraces"
>;

export function MemoryTracesPanel({
  changePageSize,
  changeQuery,
  changeStatusFilter,
  changeTraceStatus,
  changeTypeFilter,
  filteredTraceCount,
  page,
  pageSize,
  query,
  setPage,
  statusFilter,
  totalPages,
  typeFilter,
  visibleTraces,
}: MemoryTracesPanelProps) {
  return (
    <section className="soft-panel-enter mt-5 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <header className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
          <h2 className="shrink-0 text-lg font-semibold">Learning traces</h2>
          <p className="truncate text-sm text-[#7b7b85]">
            Lessons extracted at the end of conversations and runs. Approve,
            reject, or promote to a Knowledge document.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Search traces..."
              className="h-10 w-[210px] rounded-xl border-slate-200 pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              changeStatusFilter(event.target.value as "all" | TraceStatus)
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="all">All status</option>
            <option value="active">active</option>
            <option value="promoted">promoted</option>
            <option value="rejected">rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(event) =>
              changeTypeFilter(event.target.value as "all" | TraceType)
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="all">All types</option>
            <option value="pitfall">pitfall</option>
            <option value="summary">summary</option>
            <option value="selector">selector</option>
            <option value="strategy">strategy</option>
          </select>
          <span className="text-sm text-[#8a8a93]">
            {filteredTraceCount} results
          </span>
        </div>
      </header>

      {visibleTraces.length === 0 ? (
        <div className="p-6">
          <div className="flex min-h-16 items-center rounded-md bg-[#f4f4f5] px-4 text-sm text-[#8a8a93]">
            No results
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="bg-[#fafafd] text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Conf.</th>
                <th className="px-4 py-3">Decay</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleTraces.map((trace) => (
                <tr
                  key={trace.id}
                  className="border-b border-[#ececef] align-top text-sm"
                >
                  <td className="px-4 py-3">
                    <TypeBadge type={trace.type} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trace.status} />
                  </td>
                  <td className="max-w-[520px] px-4 py-3 leading-6">
                    {trace.content}
                  </td>
                  <td className="px-4 py-3">{trace.confidence.toFixed(2)}</td>
                  <td className="px-4 py-3">{trace.decay.toFixed(2)}</td>
                  <td className="px-4 py-3">{trace.usage}</td>
                  <td className="px-4 py-3 text-[#7b7b85]">{trace.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeTraceStatus(trace.id, "rejected")}
                        disabled={trace.status === "rejected"}
                        className="rounded-lg border-rose-200 bg-rose-50 text-rose-600"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeTraceStatus(trace.id, "promoted")}
                        disabled={trace.status === "promoted"}
                        className="rounded-lg border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]"
                      >
                        Promote
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageSizeChange={changePageSize}
        onPageChange={setPage}
      />
    </section>
  );
}
