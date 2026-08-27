import { MoreHorizontal, Search } from "lucide-react";

import type { Filter, InboxConversation } from "./inbox-types";
import { Avatar, ModeBadge } from "./inbox-ui";

const INBOX_FILTERS: Filter[] = ["all", "waiting", "human", "ai", "resolved"];

export function ConversationList({
  filter,
  onFilterChange,
  onQueryChange,
  onSelect,
  query,
  selectedId,
  visible,
}: {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  query: string;
  selectedId: string;
  visible: InboxConversation[];
}) {
  return (
    <aside className="flex max-h-[520px] min-h-0 flex-col border-b border-[#e5e5e9] lg:max-h-none lg:border-b-0 lg:border-r">
      <div className="border-b border-[#e9e9ed] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Conversations</h2>
            <p className="mt-1 text-xs text-[#82828b]">
              Live customer activity
            </p>
          </div>
          <button
            aria-label="Inbox options"
            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-[#f5f6ff]"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        <label className="relative mt-4 block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#92929b]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search conversations…"
            className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
          />
        </label>

        <div className="mt-3 flex gap-1 overflow-x-auto">
          {INBOX_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onFilterChange(item)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition ${filter === item ? "bg-[#f1f2ff] text-[#5964d6] shadow-sm" : "bg-[#f3f3f5] text-[#6f6f78]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            selected={selectedId === conversation.id}
            onSelect={onSelect}
          />
        ))}
        {!visible.length ? (
          <p className="p-8 text-center text-sm text-[#85858e]">
            No conversation matches these filters.
          </p>
        ) : null}
      </div>
    </aside>
  );
}

function ConversationListItem({
  conversation,
  onSelect,
  selected,
}: {
  conversation: InboxConversation;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-[#fafaff] ${selected ? "border-l-2 border-l-[#5964d6] bg-[#f5f6ff]" : "bg-white"}`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={conversation.visitor} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">
              {conversation.visitor}
            </p>
            <span className="shrink-0 text-[10px] text-[#9999a2]">
              {conversation.lastActivity}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-[#777780]">
            {conversation.company}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#65656e]">
            {conversation.messages.at(-1)?.text}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <ModeBadge mode={conversation.mode} />
            {conversation.unread ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#5964d6] text-[10px] font-bold text-white">
                {conversation.unread}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}
