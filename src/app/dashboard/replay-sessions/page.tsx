"use client";

import { Check, RefreshCw, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ReplayMetrics,
  ReplaySessionsTable,
  VisitorJourneySheet,
} from "./replay-session-panels";
import { type ReplayFilter, useReplaySessions } from "./use-replay-sessions";

export default function ReplaySessionsPage() {
  const {
    sessions,
    filteredSessions,
    eventCounts,
    filter,
    setFilter,
    loading,
    refreshing,
    error,
    refresh,
    selectedSession,
    selectedEvents,
    journeyOpen,
    setJourneyOpen,
    viewJourney,
    removeSession,
    toast,
  } = useReplaySessions();

  return (
    <main className="min-h-screen bg-white px-6 py-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              <Video className="h-4 w-4" />
              Conversation intelligence
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Replay sessions
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-500">
              Review privacy-safe visitor journeys and understand the actions
              behind every lead.
            </p>
          </div>

          <ReplayMetrics sessions={sessions} />
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as ReplayFilter)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              aria-label="Filter replay sessions"
            >
              <option value="all">All sessions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <Button
              variant="outline"
              className="h-11 rounded-xl bg-white"
              onClick={() => void refresh()}
              disabled={refreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Check className="h-4 w-4 text-emerald-500" />
            No keystrokes, passwords or message content recorded
          </p>
        </div>

        <ReplaySessionsTable
          sessions={filteredSessions}
          eventCounts={eventCounts}
          loading={loading}
          onView={viewJourney}
          onDelete={removeSession}
        />
      </section>

      <VisitorJourneySheet
        open={journeyOpen}
        session={selectedSession}
        events={selectedEvents}
        onOpenChange={setJourneyOpen}
      />

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
