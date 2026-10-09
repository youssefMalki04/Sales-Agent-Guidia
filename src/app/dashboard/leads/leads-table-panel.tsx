import Link from "next/link";
import { LeadPreview, LeadPreviewList } from "@/components/leadia/lead-preview";
import { LeadsNextAction, LeadsNextActionProvider } from "@/components/leadia/leads-next-action";
import { LeadSelectionCheckbox } from "@/components/leadia/lead-selection";
import { LeadRowActions } from "@/components/leadia/leads-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  formatDate,
  getLeadInitial,
  getLeadName,
  getLeadSource,
  getLeadStatus,
  STATUS_STYLES,
} from "./leads-data";
import type { LeadRow } from "./leads-types";

type Pagination = { page: number; pages: number; size: number; total: number; from: number; to: number };

export function LeadsTablePanel({ leads, pagination, baseHref }: { leads: LeadRow[]; pagination: Pagination; baseHref: string }) {
  return (
    <section className="soft-panel-enter min-w-0 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-[0_4px_20px_rgba(89,100,214,.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-indigo-50 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Your leads</h2>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-[#5964d6]">{pagination.total} prospects</span>
      </div>
      <div className="overflow-hidden">
        {leads.length ? <LeadsTable leads={leads} /> : <EmptyLeads />}
      </div>
      <LeadsPagination pagination={pagination} baseHref={baseHref} />
    </section>
  );
}

function LeadsTable({ leads }: { leads: LeadRow[] }) {
  return (
    <LeadsNextActionProvider><LeadPreviewList items={leads.map((lead) => ({ lead, name: getLeadName(lead), status: getLeadStatus(lead).label }))}><Table>
      <TableHeader>
        <TableRow className="bg-[#f8f8ff] hover:bg-[#f8f8ff]">
          <TableHead className="w-10 pl-4"><LeadSelectionCheckbox label="Select all leads on this page" /></TableHead>
          {tableHeaders.map((header) => (
            <TableHead
              key={header}
              className={cn(
                "text-xs font-medium tracking-normal text-[#8a8a94]",
                header === "Lead" && "px-5",
                header === "Actions" && "text-right",
              )}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => {
          const status = getLeadStatus(lead);
          const rawScore = lead.conversion_score;
          const score = typeof rawScore === "number" && Number.isFinite(rawScore) ? Math.min(100, Math.max(0, rawScore)) : null;

          return (
            <TableRow key={lead.id} className="transition-colors hover:bg-[#f8f8ff]">
              <TableCell className="w-10 pl-4"><LeadSelectionCheckbox id={lead.id} label={`Select ${getLeadName(lead)}`} /></TableCell>
              <TableCell className="max-w-[280px] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold", status.value === "won" ? "bg-emerald-50 text-emerald-700" : status.value === "qualified" ? "bg-sky-50 text-sky-700" : "bg-indigo-50 text-[#5964d6]")}>
                    {getLeadInitial(lead)}
                  </span>
                  <div className="min-w-0">
                    <LeadPreview lead={lead} name={getLeadName(lead)} status={status.label} />
                    <p title={lead.email ?? undefined} className="mt-1 truncate text-xs text-slate-500">
                      {lead.email || "No email"}
                    </p>
                  </div>
                </div>
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
                <div className="w-20 space-y-1.5">
                  <span className="text-xs font-medium tabular-nums text-slate-600">{score === null ? "Not scored" : `${score}/100`}</span>
                  {score !== null ? <div role="meter" aria-label={`Conversion score for ${getLeadName(lead)}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div style={{ width: `${score}%` }} className={cn("h-full rounded-full", score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-indigo-400" : "bg-slate-400")} />
                  </div> : null}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-[#686872]">
                {formatDate(lead.created_at)}
              </TableCell>
              <TableCell>
                <LeadsNextAction leadId={lead.id} name={getLeadName(lead)} />
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
    </Table></LeadPreviewList></LeadsNextActionProvider>
  );
}

function EmptyLeads() {
  return (
    <div className="px-5 py-14 text-center">
      <p className="text-sm font-semibold text-[#202026]">Aucun lead trouve</p>
      <p className="mt-2 text-sm text-[#777780]">
        Les prochains leads qualifies seront affiches ici.
      </p>
    </div>
  );
}

function LeadsPagination({ pagination: p, baseHref }: { pagination: Pagination; baseHref: string }) {
  const params = new URLSearchParams(baseHref.split("?")[1]);
  return (
    <nav aria-label="Leads pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
      <form action="/dashboard/leads" className="flex flex-wrap items-center gap-2">
        {[...params.entries()].filter(([key]) => key !== "pageSize" && key !== "page").map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
        <label className="flex items-center gap-2">Per page
          <select key={p.size} name="pageSize" defaultValue={String(p.size)} className="h-9 rounded-lg border border-slate-200 bg-white px-2">
            <option value="25">25</option><option value="50">50</option>
          </select>
        </label>
        <button type="submit" className="rounded-lg px-2 py-2 font-medium text-indigo-600 hover:bg-indigo-50">Apply</button>
        <span>{p.from}–{p.to} of {p.total}</span>
      </form>
      <div className="flex items-center gap-3">
        {p.page > 1 ? <Link className="rounded-lg px-2 py-2 font-medium text-indigo-600 hover:bg-indigo-50" href={baseHref + "&page=" + (p.page - 1)}>Previous</Link> : <span aria-disabled="true" className="px-2 py-2 text-slate-300">Previous</span>}
        <span aria-live="polite">Page {p.page} / {p.pages}</span>
        {p.page < p.pages ? <Link className="rounded-lg px-2 py-2 font-medium text-indigo-600 hover:bg-indigo-50" href={baseHref + "&page=" + (p.page + 1)}>Next</Link> : <span aria-disabled="true" className="px-2 py-2 text-slate-300">Next</span>}
      </div>
    </nav>
  );
}

const tableHeaders = [
  "Lead",
  "Company",
  "Source",
  "Status",
  "Score",
  "Created",
  "Next action",
  "Actions",
];
