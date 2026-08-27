import type { Ticket, TicketForm, TicketNote } from "./ticket-types";

type TicketsPayload = {
  tickets?: Ticket[];
  error?: string;
  migrationRequired?: boolean;
};

type TicketPayload = {
  ticket?: Ticket;
  notes?: TicketNote[];
  error?: string;
};

type NotePayload = {
  note?: TicketNote;
  error?: string;
};

export async function fetchTickets() {
  const response = await fetch("/api/tickets", { cache: "no-store" });
  const payload = (await response.json()) as TicketsPayload;

  return { response, payload };
}

export async function postTicket(form: TicketForm) {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const payload = (await response.json()) as { error?: string };

  return { response, payload };
}

export async function patchTicket(id: string, update: Partial<Ticket>) {
  const response = await fetch("/api/tickets", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...update }),
  });
  const payload = (await response.json()) as TicketPayload;

  return { response, payload };
}

export async function removeTicket(id: string) {
  const response = await fetch(`/api/tickets?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const payload = (await response.json()) as { error?: string };

  return { response, payload };
}

export async function fetchTicketDetails(id: string) {
  const response = await fetch(`/api/tickets?id=${id}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as TicketPayload;

  return { response, payload };
}

export async function postTicketNote(ticketId: string, body: string) {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "note", ticketId, body }),
  });
  const payload = (await response.json()) as NotePayload;

  return { response, payload };
}
