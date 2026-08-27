import { Sparkles } from "lucide-react";
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
  const leads = await getLeads(filters);
  const totalCount = leads.length;
  const newCount = leads.filter(
    (lead) => getLeadStatus(lead).value === "new",
  ).length;
  const qualifiedCount = leads.filter(
    (lead) => getLeadStatus(lead).value === "qualified",
  ).length;
  const wonCount = leads.filter(
    (lead) => getLeadStatus(lead).value === "won",
  ).length;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto flex max-w-[1240px] flex-col gap-7">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
            <Sparkles className="size-3.5" /> Revenue pipeline
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
            Leads
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Prioritize qualified opportunities and move every prospect toward
            the right next action.
          </p>
        </header>
        <Suspense fallback={null}>
          <DemoLeads />
        </Suspense>
        <section className="rounded-2xl border border-slate-100 bg-[#fafafd] p-3">
          <LeadsToolbar />
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          <StatCard label="Total" value={totalCount} tone="neutral" />
          <StatCard label="New" value={newCount} tone="indigo" />
          <StatCard label="Qualified" value={qualifiedCount} tone="green" />
          <StatCard label="Won" value={wonCount} tone="green" />
        </section>

        <LeadsFiltersPanel filters={filters} />
        <LeadsTablePanel leads={leads} />
      </div>
    </div>
  );
}
