"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchTicketDetails,
  fetchTickets,
  patchTicket,
  postTicket,
  postTicketNote,
  removeTicket,
} from "./ticket-api";
import {
  initialTicketForm,
  type Ticket,
  type TicketNote,
  type TicketStatus,
} from "./ticket-types";

export function useTicketWorkspace() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [migrationRequired, setMigrationRequired] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [form, setForm] = useState(initialTicketForm);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [notes, setNotes] = useState<TicketNote[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function loadTickets() {
    setError(null);
    const { response, payload } = await fetchTickets();
    if (!response.ok) {
      setMigrationRequired(Boolean(payload.migrationRequired));
      throw new Error(payload.error ?? "Unable to load tickets");
    }
    setTickets(payload.tickets ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTickets()
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load tickets",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredTickets = useMemo(() => {
    const value = query.trim().toLowerCase();
    return tickets.filter(
      (ticket) =>
        (status === "all" || ticket.status === status) &&
        (!value ||
          ticket.subject.toLowerCase().includes(value) ||
          ticket.requester_name.toLowerCase().includes(value) ||
          (ticket.requester_email ?? "").toLowerCase().includes(value)),
    );
  }, [query, status, tickets]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function createTicket() {
    if (!form.subject.trim()) return;
    setBusy(true);
    try {
      const { response, payload } = await postTicket(form);
      if (!response.ok)
        throw new Error(payload.error ?? "Ticket creation failed");
      await loadTickets();
      setCreateOpen(false);
      setForm(initialTicketForm);
      showToast("Ticket created.");
    } catch (reason) {
      showToast(
        reason instanceof Error ? reason.message : "Ticket creation failed",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateTicket(id: string, update: Partial<Ticket>) {
    const { response, payload } = await patchTicket(id, update);
    if (!response.ok || !payload.ticket)
      return showToast(payload.error ?? "Update failed");
    setTickets((current) =>
      current.map((item) => (item.id === id ? payload.ticket! : item)),
    );
    setSelected((current) => (current?.id === id ? payload.ticket! : current));
    showToast("Ticket updated.");
  }

  async function deleteTicket(ticket: Ticket) {
    if (
      !window.confirm(
        `Delete ticket TCK-${ticket.id.slice(0, 6).toUpperCase()}? This action cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    try {
      const { response, payload } = await removeTicket(ticket.id);
      if (!response.ok)
        throw new Error(payload.error ?? "Ticket deletion failed");
      setTickets((current) => current.filter((item) => item.id !== ticket.id));
      setDetailsOpen(false);
      setSelected(null);
      showToast("Ticket deleted.");
    } catch (reason) {
      showToast(
        reason instanceof Error ? reason.message : "Ticket deletion failed",
      );
    } finally {
      setBusy(false);
    }
  }

  async function openDetails(ticket: Ticket) {
    setSelected(ticket);
    setDetailsOpen(true);
    setNotes([]);
    const { response, payload } = await fetchTicketDetails(ticket.id);
    if (!response.ok)
      return showToast(payload.error ?? "Unable to open ticket");
    setSelected(payload.ticket ?? ticket);
    setNotes(payload.notes ?? []);
  }

  async function addNote() {
    if (!selected || !note.trim()) return;
    setBusy(true);
    try {
      const { response, payload } = await postTicketNote(selected.id, note);
      if (!response.ok || !payload.note)
        throw new Error(payload.error ?? "Unable to add note");
      setNotes((current) => [...current, payload.note!]);
      setNote("");
      showToast("Internal note added.");
    } catch (reason) {
      showToast(
        reason instanceof Error ? reason.message : "Unable to add note",
      );
    } finally {
      setBusy(false);
    }
  }

  return {
    tickets,
    filteredTickets,
    query,
    setQuery,
    status,
    setStatus,
    loading,
    error,
    migrationRequired,
    createOpen,
    setCreateOpen,
    detailsOpen,
    setDetailsOpen,
    form,
    setForm,
    selected,
    setSelected,
    notes,
    note,
    setNote,
    busy,
    toast,
    createTicket,
    updateTicket,
    deleteTicket,
    openDetails,
    addNote,
  };
}
