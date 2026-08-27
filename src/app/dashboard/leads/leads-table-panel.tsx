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

export function LeadsTablePanel({ leads }: { leads: LeadRow[] }) {
  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        {leads.length ? <LeadsTable leads={leads} /> : <EmptyLeads />}
      </div>
      <LeadsPagination count={leads.length} />
    </section>
  );
}

function LeadsTable({ leads }: { leads: LeadRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#fafafd] hover:bg-[#fafafd]">
          {tableHeaders.map((header) => (
            <TableHead
              key={header}
              className={cn(
                "text-xs uppercase tracking-normal text-[#8a8a94]",
                header === "Name" && "px-5",
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

function LeadsPagination({ count }: { count: number }) {
  return (
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
          1-{count} of {count}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[#aaaab2]">‹</span>
        <span>Page 1 / 1</span>
        <span className="text-[#aaaab2]">›</span>
      </div>
    </div>
  );
}

const tableHeaders = [
  "Name",
  "Email",
  "Company",
  "Source",
  "Status",
  "Created",
  "Actions",
];
