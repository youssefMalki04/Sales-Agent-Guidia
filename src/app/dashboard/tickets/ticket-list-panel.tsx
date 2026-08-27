import {
  AlertCircle,
  Clock3,
  Eye,
  LifeBuoy,
  Loader2,
  Search,
  Ticket as TicketIcon,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ticketStatusLabels,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from "./ticket-types";

export function TicketOverview({
  tickets,
  filteredTickets,
  query,
  status,
  loading,
  busy,
  onQueryChange,
  onStatusChange,
  onTicketStatusChange,
  onOpen,
  onDelete,
}: {
  tickets: Ticket[];
  filteredTickets: Ticket[];
  query: string;
  status: "all" | TicketStatus;
  loading: boolean;
  busy: boolean;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: "all" | TicketStatus) => void;
  onTicketStatusChange: (ticket: Ticket, status: TicketStatus) => void;
  onOpen: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}) {
  const openCount = tickets.filter((ticket) =>
    ["open", "in_progress"].includes(ticket.status),
  ).length;
  const highCount = tickets.filter((ticket) =>
    ["high", "urgent"].includes(ticket.priority),
  ).length;

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        <TicketStat
          icon={TicketIcon}
          label="Total tickets"
          value={tickets.length}
        />
        <TicketStat icon={LifeBuoy} label="Open" value={openCount} />
        <TicketStat
          icon={AlertCircle}
          label="High priority"
          value={highCount}
          warning
        />
      </section>

      <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
        <div className="grid gap-3 border-b border-slate-100 p-5 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search subject or requester..."
              className="pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as "all" | TicketStatus)
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            {Object.entries(ticketStatusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#fafafd]">
                <TableHead className="px-5">Ticket</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16">
                    <Loader2 className="mx-auto size-6 animate-spin text-[#5964d6]" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-[#fafaff]">
                    <TableCell className="px-5 font-mono text-xs font-semibold text-[#5964d6]">
                      TCK-{ticket.id.slice(0, 6).toUpperCase()}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate font-semibold">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{ticket.requester_name}</p>
                      <p className="text-xs text-slate-400">
                        {ticket.requester_email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <select
                        value={ticket.status}
                        onChange={(event) =>
                          onTicketStatusChange(
                            ticket,
                            event.target.value as TicketStatus,
                          )
                        }
                        className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                      >
                        {Object.entries(ticketStatusLabels).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {ticket.assigned_to ?? "Unassigned"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      <Clock3 className="mr-1 inline size-3.5" />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Open ticket"
                          onClick={() => onOpen(ticket)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete ticket"
                          disabled={busy}
                          onClick={() => onDelete(ticket)}
                          className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-16 text-center text-slate-500"
                  >
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        priority === "urgent"
          ? "bg-rose-50 text-rose-700"
          : priority === "high"
            ? "bg-amber-50 text-amber-700"
            : "bg-slate-100 text-slate-600",
      )}
    >
      {priority}
    </span>
  );
}

function TicketStat({
  icon: Icon,
  label,
  value,
  warning = false,
}: {
  icon: typeof TicketIcon;
  label: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <article className="soft-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-xl",
          warning
            ? "bg-amber-50 text-amber-700"
            : "bg-[#f1f2ff] text-[#5964d6]",
        )}
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
