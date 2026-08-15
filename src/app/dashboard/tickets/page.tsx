import { AlertCircle, Clock3, LifeBuoy, Sparkles, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tickets = [
  {
    id: "TCK-001",
    subject: "Demande de reprise humaine",
    requester: "Lead chaud",
    status: "Open",
    priority: "High",
    createdAt: "Jul 20, 2026",
  },
];

export default function TicketsPage() {
  const openCount = tickets.filter((ticket) => ticket.status === "Open").length;
  const highPriorityCount = tickets.filter(
    (ticket) => ticket.priority === "High",
  ).length;

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px] space-y-7">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Support workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Tickets
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Track customer requests that require human support and keep every
              handoff moving.
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <TicketStat
            icon={Ticket}
            label="Total tickets"
            value={tickets.length}
          />
          <TicketStat icon={LifeBuoy} label="Open" value={openCount} />
          <TicketStat
            icon={AlertCircle}
            label="High priority"
            value={highPriorityCount}
            warning
          />
        </section>

        <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-950">Support queue</h2>
              <p className="mt-1 text-xs text-slate-500">
                Requests escalated by your AI agents.
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-[#e1e4f8] bg-[#f1f2ff] px-3 text-[#5964d6]"
            >
              {tickets.length} ticket
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafd] hover:bg-[#fafafd]">
                  <TableHead className="px-5 text-xs uppercase text-slate-500">
                    Ticket
                  </TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">
                    Subject
                  </TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">
                    Requester
                  </TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">
                    Priority
                  </TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="transition hover:bg-[#fafaff]"
                  >
                    <TableCell className="px-5 font-mono text-xs font-semibold text-[#5964d6]">
                      {ticket.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {ticket.subject}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {ticket.requester}
                    </TableCell>
                    <TableCell>
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <AlertCircle className="size-3.5" /> {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-3.5" /> {ticket.createdAt}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}

function TicketStat({
  icon: Icon,
  label,
  value,
  warning = false,
}: {
  icon: typeof Ticket;
  label: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <article className="soft-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
      <span
        className={`flex size-10 items-center justify-center rounded-xl ${warning ? "bg-amber-50 text-amber-700" : "bg-[#f1f2ff] text-[#5964d6]"}`}
      >
        <Icon className="size-[18px]" />
      </span>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
      </div>
    </article>
  );
}
