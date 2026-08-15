import { CalendarDays, Search, Sparkles } from "lucide-react";
import { Suspense } from "react";

import {
  LeadRowActions,
  LeadsToolbar,
} from "@/components/leadia/leads-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { cn } from "@/lib/utils";
import { DemoLeads } from "./demo-leads";

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  sector: string | null;
  need: string | null;
  suggested_next_action: string | null;
  summary: string | null;
  urgency: string | null;
  lead_temperature: string | null;
  conversion_score: number | null;
  crm_status: string | null;
  created_at: string;
};

type LeadsPageProps = {
  searchParams?: Promise<{
    from?: string;
    q?: string;
    source?: string;
    status?: string;
    temperature?: string;
    country?: string;
    sector?: string;
    urgency?: string;
    crm?: string;
    to?: string;
  }>;
};

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Won", value: "won" },
  { label: "Failed", value: "failed" },
];

const SOURCE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Agent", value: "agent" },
  { label: "Manual", value: "manual" },
  { label: "Website", value: "website" },
];

const STATUS_STYLES: Record<string, string> = {
  failed: "border-red-200 bg-red-50 text-red-700",
  new: "border-indigo-200 bg-indigo-50 text-indigo-700",
  qualified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  won: "border-green-200 bg-green-50 text-green-700",
};

function normalizeParam(value: string | undefined) {
  return value?.trim() ?? "";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getLeadName(lead: LeadRow) {
  return lead.name || lead.email || "Visiteur";
}

function getLeadSource(lead: LeadRow) {
  if (lead.sector) {
    return lead.sector;
  }

  return lead.email ? "Agent" : "Manual";
}

function getLeadStatus(lead: LeadRow) {
  const crmStatus = lead.crm_status?.toLowerCase();
  const score = lead.conversion_score ?? 0;
  const temperature = lead.lead_temperature?.toLowerCase();

  if (crmStatus === "failed") {
    return { label: "Failed", value: "failed" };
  }

  if (crmStatus === "sent") {
    return { label: "Won", value: "won" };
  }

  if (score >= 70 || temperature === "hot") {
    return { label: "Qualified", value: "qualified" };
  }

  return { label: "New", value: "new" };
}

function getLeadInitial(lead: LeadRow) {
  return getLeadName(lead).slice(0, 1).toUpperCase();
}

function matchesSource(lead: LeadRow, source: string) {
  if (!source) {
    return true;
  }

  return getLeadSource(lead).toLowerCase() === source;
}

async function getLeads(filters: {
  from: string;
  query: string;
  source: string;
  status: string;
  temperature: string;
  country: string;
  sector: string;
  urgency: string;
  crm: string;
  to: string;
}) {
  if (process.env.ENABLE_SUPABASE_DASHBOARD !== "true") return [];
  let request = supabaseAdmin
    .from("leads")
    .select(
      "id,name,email,company,country,sector,need,urgency,lead_temperature,conversion_score,crm_status,created_at,summary,suggested_next_action",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.from) {
    request = request.gte("created_at", `${filters.from}T00:00:00.000Z`);
  }

  if (filters.to) {
    request = request.lte("created_at", `${filters.to}T23:59:59.999Z`);
  }

  if (filters.query) {
    const escapedQuery = filters.query
      .replaceAll("%", "\\%")
      .replaceAll(",", "\\,");
    request = request.or(
      [
        `name.ilike.%${escapedQuery}%`,
        `email.ilike.%${escapedQuery}%`,
        `company.ilike.%${escapedQuery}%`,
        `country.ilike.%${escapedQuery}%`,
        `sector.ilike.%${escapedQuery}%`,
        `need.ilike.%${escapedQuery}%`,
      ].join(","),
    );
  }
  if (filters.temperature)
    request = request.eq("lead_temperature", filters.temperature);
  if (filters.country)
    request = request.ilike("country", `%${filters.country}%`);
  if (filters.sector) request = request.ilike("sector", `%${filters.sector}%`);
  if (filters.urgency) request = request.eq("urgency", filters.urgency);
  if (filters.crm) request = request.eq("crm_status", filters.crm);

  const result = await request;

  if (result.error) {
    throw new Error(result.error.message);
  }

  return ((result.data ?? []) as LeadRow[])
    .filter((lead) => {
      const status = getLeadStatus(lead);

      return (
        (!filters.status || status.value === filters.status) &&
        matchesSource(lead, filters.source)
      );
    })
    .sort((first, second) => {
      const scoreDiff =
        (second.conversion_score ?? 0) - (first.conversion_score ?? 0);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return (
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime()
      );
    });
}

export default async function LeadsDashboardPage({
  searchParams,
}: LeadsPageProps) {
  const params = await searchParams;
  const filters = {
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

        <form className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <FieldLabel label="Status">
              <select
                name="status"
                defaultValue={filters.status}
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium text-[#4f4f59] outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldLabel>

            <FieldLabel label="Temperature">
              <select
                name="temperature"
                defaultValue={filters.temperature}
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium text-[#4f4f59]"
              >
                <option value="">All</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </FieldLabel>

            <FieldLabel label="Country">
              <input
                name="country"
                defaultValue={filters.country}
                placeholder="France, Tunisia..."
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none"
              />
            </FieldLabel>

            <FieldLabel label="Sector">
              <input
                name="sector"
                defaultValue={filters.sector}
                placeholder="SaaS, e-commerce..."
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none"
              />
            </FieldLabel>

            <FieldLabel label="Urgency">
              <select
                name="urgency"
                defaultValue={filters.urgency}
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium text-[#4f4f59]"
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </FieldLabel>

            <FieldLabel label="CRM status">
              <select
                name="crm"
                defaultValue={filters.crm}
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium text-[#4f4f59]"
              >
                <option value="">All</option>
                <option value="not_sent">Not sent</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </FieldLabel>

            <FieldLabel label="Source">
              <select
                name="source"
                defaultValue={filters.source}
                className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium text-[#4f4f59] outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
              >
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldLabel>

            <FieldLabel label="From">
              <DateInput name="from" value={filters.from} />
            </FieldLabel>

            <FieldLabel label="To">
              <DateInput name="to" value={filters.to} />
            </FieldLabel>

            <FieldLabel label="Search name, email, company...">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa3]" />
                <input
                  name="q"
                  defaultValue={filters.query}
                  placeholder="Search name, email, company..."
                  className="h-11 w-full rounded-md border border-[#dedee4] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
                />
              </div>
            </FieldLabel>
            <div className="flex items-end">
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
              >
                Apply filters
              </button>
            </div>
          </div>
        </form>

        <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            {leads.length ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fafafd] hover:bg-[#fafafd]">
                    <TableHead className="px-5 text-xs uppercase tracking-normal text-[#8a8a94]">
                      Name
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-normal text-[#8a8a94]">
                      Email
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-normal text-[#8a8a94]">
                      Company
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-normal text-[#8a8a94]">
                      Source
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-normal text-[#8a8a94]">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-normal text-[#8a8a94]">
                      Created
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-normal text-[#8a8a94]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const status = getLeadStatus(lead);

                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="max-w-[220px] px-5">
                          <div className="flex items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-xs font-bold text-[#5964d6]">
                              {getLeadInitial(lead)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#2b2b31]">
                                {getLeadName(lead)}
                              </p>
                              <p className="mt-1 truncate text-xs text-[#8a8a94]">
                                Score {lead.conversion_score ?? 0}/100
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[240px]">
                          <p className="truncate text-sm text-[#686872]">
                            {lead.email ?? "-"}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-[220px]">
                          <p className="truncate text-sm font-medium text-[#555560]">
                            {lead.company ?? "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-md border-[#dedee4] bg-[#f7f7f8] text-[#5f5f68]"
                          >
                            {getLeadSource(lead)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              STATUS_STYLES[status.value] ?? STATUS_STYLES.new,
                            )}
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-[#686872]">
                          {formatDate(lead.created_at)}
                        </TableCell>
                        <TableCell>
                          <LeadRowActions
                            lead={lead}
                            source={getLeadSource(lead)}
                            status={status.label}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="px-5 py-14 text-center">
                <p className="text-sm font-semibold text-[#202026]">
                  Aucun lead trouve
                </p>
                <p className="mt-2 text-sm text-[#777780]">
                  Les prochains leads qualifies seront affiches ici.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#eeeef1] px-2 py-4 text-sm text-[#6b6b75] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span>Per page</span>
              <select
                aria-label="Per page"
                defaultValue="25"
                className="h-9 rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium"
              >
                <option>25</option>
                <option>50</option>
              </select>
              <span>
                1-{leads.length} of {leads.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#aaaab2]">‹</span>
              <span>Page 1 / 1</span>
              <span className="text-[#aaaab2]">›</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "green" | "indigo" | "neutral";
  value: number;
}) {
  return (
    <div
      className={cn(
        "soft-lift rounded-2xl border p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]",
        tone === "green"
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-200/80 bg-white",
        tone === "neutral" ? "bg-[#fafafd]" : "",
      )}
    >
      <p
        className={cn(
          "text-3xl font-semibold",
          tone === "indigo" ? "text-[#5964d6]" : "text-[#171717]",
          tone === "green" ? "text-[#0f766e]" : "",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-[#686872]">{label}</p>
    </div>
  );
}

function FieldLabel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#4c4c56]">
        {label}
      </span>
      {children}
    </label>
  );
}

function DateInput({ name, value }: { name: string; value: string }) {
  return (
    <div className="relative">
      <input
        name={name}
        type="date"
        defaultValue={value}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-[#4f4f59] outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
      />
      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa3]" />
    </div>
  );
}
