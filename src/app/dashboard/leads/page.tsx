import Link from "next/link";
import { loadLeadsResult } from "./load-leads-result";
import { LeadsLoadError } from "./leads-load-error";
import { SavedLeadViews } from "./saved-lead-views";
import { LeadSelection } from "@/components/leadia/lead-selection";
import { paginateLeads } from "./leads-pagination";
import { normalizeLeadSort, sortLeads } from "./leads-sort";
import { UsersRound } from "lucide-react";
import { Suspense } from "react";

import { LeadsToolbar } from "@/components/leadia/leads-actions";
import { DemoLeads } from "./demo-leads";
import { getLeadStatus, getLeads, normalizeParam } from "./leads-data";
import { LeadsFiltersPanel, LeadsTablePanel } from "./leads-panels";
import type { LeadsFilters, LeadsPageProps } from "./leads-types";
import { StatCard } from "./leads-ui";

export default async function LeadsDashboardPage({
  searchParams,
}: LeadsPageProps) {
  const params = await searchParams;
  const filters: LeadsFilters = {
    followUp: params?.followUp === "none" || params?.followUp === "overdue" ? params.followUp : "",
    from: normalizeParam(params?.from),
    query: normalizeParam(params?.q),
    source: normalizeParam(params?.source).toLowerCase(),
    status: normalizeParam(params?.status).toLowerCase(),
    to: normalizeParam(params?.to),
    temperature: normalizeParam(params?.temperature).toLowerCase(),
    country: normalizeParam(params?.country),
    sector: normalizeParam(params?.sector),
    urgency: normalizeParam(params?.urgency).toLowerCase(),
    crm: normalizeParam(params?.crm).toLowerCase(),
  };
  const sort = normalizeLeadSort(params?.sort);
  const result = await loadLeadsResult(() => getLeads({ ...filters, status: "" }));
  if (!result.ok) return <LeadsLoadError />;
  const availableLeads = result.leads;
  const leads = sortLeads(availableLeads.filter((lead) => !filters.status || getLeadStatus(lead).value === filters.status), sort);
  const pagination = paginateLeads(leads, params?.page, params?.pageSize);
  const statusHref = (status: string) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value && key !== "status") query.set(key === "query" ? "q" : key, value);
    }
    query.set("sort", sort);
    query.set("pageSize", String(pagination.size));
    if (status) query.set("status", status);
    return `/dashboard/leads?${query.toString()}`;
  };
  const totalCount = availableLeads.length;
  const newCount = availableLeads.filter(
    (lead) => getLeadStatus(lead).value === "new",
  ).length;
  const qualifiedCount = availableLeads.filter(
    (lead) => getLeadStatus(lead).value === "qualified",
  ).length;
  const wonCount = availableLeads.filter(
    (lead) => getLeadStatus(lead).value === "won",
  ).length;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-white min-w-0 px-4 py-6 text-[#171717] sm:px-6 xl:px-8">
      <div className="soft-page-enter mx-auto flex min-w-0 max-w-[1240px] flex-col gap-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 border-l-[3px] border-[#7770e8] pl-4">
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-950">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff]"><UsersRound className="size-5 text-[#5964d6]" /></span> Leads
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Prioritize qualified opportunities and move every prospect toward
            the right next action.
          </p>
          </div>
          <div className="shrink-0"><LeadsToolbar /></div>
        </header>
        <Suspense fallback={null}>
          <DemoLeads />
        </Suspense>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link href={statusHref("")} aria-current={filters.status === "" ? "true" : undefined} className={`rounded-2xl transition hover:ring-2 hover:ring-indigo-200 focus-visible:outline-2 focus-visible:outline-indigo-500 ${filters.status === "" ? "ring-2 ring-indigo-400" : ""}`}><StatCard label="Total" value={totalCount} tone="neutral" /></Link>
          <Link href={statusHref("new")} aria-current={filters.status === "new" ? "true" : undefined} className={`rounded-2xl transition hover:ring-2 hover:ring-indigo-200 focus-visible:outline-2 focus-visible:outline-indigo-500 ${filters.status === "new" ? "ring-2 ring-indigo-400" : ""}`}><StatCard label="New" value={newCount} tone="indigo" /></Link>
          <Link href={statusHref("qualified")} aria-current={filters.status === "qualified" ? "true" : undefined} className={`rounded-2xl transition hover:ring-2 hover:ring-indigo-200 focus-visible:outline-2 focus-visible:outline-indigo-500 ${filters.status === "qualified" ? "ring-2 ring-indigo-400" : ""}`}><StatCard label="Qualified" value={qualifiedCount} tone="green" /></Link>
          <Link href={statusHref("won")} aria-current={filters.status === "won" ? "true" : undefined} className={`rounded-2xl transition hover:ring-2 hover:ring-indigo-200 focus-visible:outline-2 focus-visible:outline-indigo-500 ${filters.status === "won" ? "ring-2 ring-indigo-400" : ""}`}><StatCard label="Won" value={wonCount} tone="green" /></Link>
        </section>

        <SavedLeadViews query={statusHref(filters.status).split("?")[1]} />
        <LeadsFiltersPanel key={JSON.stringify({ filters, sort, size: pagination.size })} filters={filters} sort={sort} pageSize={pagination.size} />
        <LeadSelection key={JSON.stringify({ ids: pagination.rows.map(lead => lead.id), filters, sort, page: pagination.page })} ids={pagination.rows.map(lead => lead.id)}>
          <LeadsTablePanel leads={pagination.rows} pagination={pagination} baseHref={statusHref(filters.status)} />
        </LeadSelection>
      </div>
    </div>
  );
}
