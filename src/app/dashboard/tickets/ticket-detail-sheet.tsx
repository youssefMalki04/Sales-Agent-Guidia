import { Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import {
  ticketStatusLabels,
  type Ticket,
  type TicketNote,
  type TicketPriority,
  type TicketStatus,
} from "./ticket-types";

export function TicketDetailSheet({
  open,
  ticket,
  notes,
  note,
  busy,
  onOpenChange,
  onTicketChange,
  onUpdate,
  onDelete,
  onNoteChange,
  onAddNote,
}: {
  open: boolean;
  ticket: Ticket | null;
  notes: TicketNote[];
  note: string;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketChange: (ticket: Ticket) => void;
  onUpdate: (id: string, update: Partial<Ticket>) => void;
  onDelete: (ticket: Ticket) => void;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[760px]">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>{ticket?.subject ?? "Ticket"}</SheetTitle>
          <p className="text-sm text-slate-500">
            TCK-{ticket?.id.slice(0, 6).toUpperCase()}
          </p>
        </SheetHeader>
        {ticket ? (
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select
                  value={ticket.status}
                  onChange={(event) =>
                    onUpdate(ticket.id, {
                      status: event.target.value as TicketStatus,
                    })
                  }
                  className="h-10 w-full rounded-xl border px-3"
                >
                  {Object.entries(ticketStatusLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Priority">
                <select
                  value={ticket.priority}
                  onChange={(event) =>
                    onUpdate(ticket.id, {
                      priority: event.target.value as TicketPriority,
                    })
                  }
                  className="h-10 w-full rounded-xl border px-3"
                >
                  {(["low", "medium", "high", "urgent"] as const).map(
                    (priority) => (
                      <option key={priority}>{priority}</option>
                    ),
                  )}
                </select>
              </Field>
              <Field label="Assigned to">
                <Input
                  value={ticket.assigned_to ?? ""}
                  onChange={(event) =>
                    onTicketChange({
                      ...ticket,
                      assigned_to: event.target.value,
                    })
                  }
                  onBlur={() =>
                    onUpdate(ticket.id, { assigned_to: ticket.assigned_to })
                  }
                />
              </Field>
              <Field label="Requester">
                <Input value={ticket.requester_name} readOnly />
              </Field>
            </div>

            <Field label="Description">
              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {ticket.description || "No description."}
              </p>
            </Field>

            <div className="flex flex-wrap gap-3">
              {ticket.lead_id ? (
                <Button asChild variant="outline">
                  <Link href={`/dashboard/leads/${ticket.lead_id}`}>
                    Open lead
                  </Link>
                </Button>
              ) : null}
              {ticket.session_id ? (
                <Button asChild variant="outline">
                  <Link href={`/dashboard/conversations/${ticket.session_id}`}>
                    Open conversation
                  </Link>
                </Button>
              ) : null}
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => onDelete(ticket)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="size-4" /> Delete ticket
              </Button>
            </div>

            <section>
              <h3 className="font-semibold">Internal notes</h3>
              <div className="mt-3 space-y-3">
                {notes.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border bg-[#fafafd] p-4"
                  >
                    <p className="text-sm leading-6">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {item.author} ·{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
              <Textarea
                value={note}
                onChange={(event) => onNoteChange(event.target.value)}
                placeholder="Add an internal note..."
                className="mt-4"
              />
              <Button
                onClick={onAddNote}
                disabled={!note.trim() || busy}
                className="mt-2 bg-[#5964d6] text-white"
              >
                Add note
              </Button>
            </section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
