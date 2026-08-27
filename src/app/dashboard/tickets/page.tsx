"use client";

import { Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketCreateSheet } from "./ticket-create-sheet";
import { TicketDetailSheet } from "./ticket-detail-sheet";
import { TicketOverview } from "./ticket-list-panel";
import { useTicketWorkspace } from "./use-ticket-workspace";

export default function TicketsPage() {
  const workspace = useTicketWorkspace();
  const {
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
  } = workspace;

  return (
    <>
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
                Track customer requests, human handoffs and internal follow-up.
              </p>
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              className="h-11 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            >
              <Plus className="size-4" /> New ticket
            </Button>
          </header>
          {error ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
              <p className="font-semibold">Tickets could not be loaded.</p>
              <p className="mt-1">
                {migrationRequired
                  ? "Run supabase/migrations/012_support_tickets.sql in the Supabase SQL Editor, then reload this page."
                  : error}
              </p>
            </section>
          ) : null}
          <TicketOverview
            tickets={tickets}
            filteredTickets={filteredTickets}
            query={query}
            status={status}
            loading={loading}
            busy={busy}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onTicketStatusChange={(ticket, nextStatus) =>
              updateTicket(ticket.id, { status: nextStatus })
            }
            onOpen={openDetails}
            onDelete={deleteTicket}
          />
        </div>
      </main>
      <TicketCreateSheet
        open={createOpen}
        setOpen={setCreateOpen}
        form={form}
        setForm={setForm}
        busy={busy}
        onCreate={createTicket}
      />
      <TicketDetailSheet
        open={detailsOpen}
        ticket={selected}
        notes={notes}
        note={note}
        busy={busy}
        onOpenChange={setDetailsOpen}
        onTicketChange={setSelected}
        onUpdate={updateTicket}
        onDelete={deleteTicket}
        onNoteChange={setNote}
        onAddNote={addNote}
      />
      {toast ? (
        <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          <Check className="size-4" />
          {toast}
        </div>
      ) : null}
    </>
  );
}
