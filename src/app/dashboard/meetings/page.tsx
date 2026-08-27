"use client";

import { Plus, Sparkles } from "lucide-react";

import { MeetingStat } from "./meeting-calendar";
import { CreateMeeting } from "./create-meeting";
import { MeetingDetails } from "./meeting-panels";
import { MeetingWorkspace } from "./meeting-workspace";
import { useMeetings } from "./use-meetings";

export default function MeetingsPage() {
  const {
    meetings,
    filteredMeetings,
    error,
    view,
    setView,
    selectedMonth,
    query,
    setQuery,
    status,
    setStatus,
    owner,
    setOwner,
    selectedMeeting,
    setSelectedId,
    creating,
    setCreating,
    monthLabel,
    confirmedCount,
    pendingCount,
    completionRate,
    showCurrentMonth,
    showPreviousMonth,
    showNextMonth,
    updateMeeting,
    createMeeting,
  } = useMeetings();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-12">
      <div className="soft-page-enter mx-auto max-w-[1400px] space-y-7">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Sales workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Meetings
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage demos and follow-ups booked from your AI conversations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" />
            New meeting
          </button>
        </header>

        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MeetingStat
            label="Total meetings"
            value={meetings.length}
            tone="neutral"
          />
          <MeetingStat label="Confirmed" value={confirmedCount} tone="green" />
          <MeetingStat label="Pending" value={pendingCount} tone="amber" />
          <MeetingStat
            label="Completion rate"
            value={`${completionRate}%`}
            tone="indigo"
          />
        </section>

        <MeetingWorkspace
          meetings={filteredMeetings}
          selectedMonth={selectedMonth}
          monthLabel={monthLabel}
          query={query}
          owner={owner}
          status={status}
          view={view}
          onToday={showCurrentMonth}
          onPreviousMonth={showPreviousMonth}
          onNextMonth={showNextMonth}
          onQueryChange={setQuery}
          onOwnerChange={setOwner}
          onStatusChange={setStatus}
          onViewChange={setView}
          onSelectMeeting={setSelectedId}
        />
      </div>

      {selectedMeeting ? (
        <MeetingDetails
          meeting={selectedMeeting}
          onClose={() => setSelectedId(null)}
          onUpdate={(patch) => updateMeeting(selectedMeeting.id, patch)}
        />
      ) : null}
      {creating ? (
        <CreateMeeting
          onClose={() => setCreating(false)}
          onSubmit={createMeeting}
        />
      ) : null}
    </main>
  );
}
