"use client";

import { Sparkles } from "lucide-react";
import {
  ConversationDetails,
  ConversationList,
  ConversationThread,
} from "./inbox-panels";
import { useLiveInbox } from "./use-live-inbox";

export default function InboxPage() {
  const {
    draft,
    endRef,
    error,
    filter,
    query,
    selected,
    visible,
    waitingCount,
    setDraft,
    setFilter,
    setQuery,
    selectConversation,
    sendMessage,
    updateConversation,
  } = useLiveInbox();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white p-3 text-[#171717] sm:p-6 lg:h-[calc(100vh-76px)] lg:min-h-[760px]">
      <div className="soft-page-enter mx-auto flex h-full max-w-[1500px] flex-col">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Human handoff
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
              Live inbox
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join active conversations and help high-intent visitors at the
              right moment.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xl font-semibold text-amber-800">
              {waitingCount}
            </p>
            <p className="text-xs font-medium text-amber-700">
              Waiting for a human
            </p>
          </div>
        </header>
        {error ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        ) : null}
        <div className="grid min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.055)] lg:grid-cols-[330px_minmax(420px,1fr)_300px]">
          <ConversationList
            filter={filter}
            onFilterChange={setFilter}
            onQueryChange={setQuery}
            onSelect={selectConversation}
            query={query}
            selectedId={selected.id}
            visible={visible}
          />
          <ConversationThread
            conversation={selected}
            draft={draft}
            endRef={endRef}
            onDraftChange={setDraft}
            onModeChange={(update) => updateConversation(selected.id, update)}
            onSubmit={sendMessage}
          />
          <ConversationDetails conversation={selected} />
        </div>
      </div>
    </main>
  );
}
