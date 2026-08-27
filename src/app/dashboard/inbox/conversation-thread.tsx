import { Bot, Check, CheckCircle2, Send, UserRound } from "lucide-react";
import type { FormEvent, RefObject } from "react";

import type { InboxConversation } from "./inbox-types";
import { Avatar } from "./inbox-ui";

export function ConversationThread({
  conversation,
  draft,
  endRef,
  onDraftChange,
  onModeChange,
  onSubmit,
}: {
  conversation: InboxConversation;
  draft: string;
  endRef: RefObject<HTMLDivElement | null>;
  onDraftChange: (draft: string) => void;
  onModeChange: (update: Partial<InboxConversation>) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <section className="flex min-h-[650px] flex-col border-b border-[#e5e5e9] lg:min-h-0 lg:border-b-0 lg:border-r">
      <ConversationHeader
        conversation={conversation}
        onModeChange={onModeChange}
      />
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#fafafd] px-5 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a0a0a8]">
            Today
          </p>
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.author === "visitor" ? "justify-start" : "justify-end"}`}
            >
              {message.author === "visitor" ? (
                <span className="mt-auto flex size-7 items-center justify-center rounded-full bg-[#e9e9ed]">
                  <UserRound className="size-3.5" />
                </span>
              ) : null}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.author === "visitor" ? "rounded-bl-sm border border-[#e2e2e7] bg-white text-[#45454e]" : message.author === "ai" ? "rounded-br-sm bg-[#eef0ff] text-[#404a9f]" : "rounded-br-sm bg-[#5964d6] text-white"}`}
              >
                <p>{message.text}</p>
                <p
                  className={`mt-1 text-[10px] ${message.author === "agent" ? "text-white/55" : "text-[#9999a2]"}`}
                >
                  {message.author === "ai"
                    ? "AI · "
                    : message.author === "agent"
                      ? "You · "
                      : ""}
                  {message.time}
                </p>
              </div>
              {message.author !== "visitor" ? (
                <span
                  className={`mt-auto flex size-7 items-center justify-center rounded-full ${message.author === "ai" ? "bg-[#dfe2ff] text-[#5964d6]" : "bg-[#5964d6] text-white"}`}
                >
                  {message.author === "ai" ? (
                    <Bot className="size-3.5" />
                  ) : (
                    <UserRound className="size-3.5" />
                  )}
                </span>
              ) : null}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <ReplyComposer
        conversation={conversation}
        draft={draft}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </section>
  );
}

function ConversationHeader({
  conversation,
  onModeChange,
}: {
  conversation: InboxConversation;
  onModeChange: (update: Partial<InboxConversation>) => void;
}) {
  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-[#e7e7eb] px-5 py-3">
      <div className="flex items-center gap-3">
        <Avatar name={conversation.visitor} />
        <div>
          <h2 className="text-sm font-semibold">{conversation.visitor}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#7e7e87]">
            <span className="size-2 rounded-full bg-emerald-500" />
            Online · {conversation.company}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {conversation.mode !== "human" && conversation.mode !== "resolved" ? (
          <button
            type="button"
            onClick={() => onModeChange({ mode: "human", owner: "Yosra" })}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#5964d6] px-3 text-xs font-semibold text-white hover:bg-[#4f5acb]"
          >
            <UserRound className="size-4" /> Take over
          </button>
        ) : null}
        {conversation.mode === "human" ? (
          <button
            type="button"
            onClick={() => onModeChange({ mode: "ai", owner: null })}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-[#f5f6ff]"
          >
            <Bot className="size-4" /> Return to AI
          </button>
        ) : null}
        {conversation.mode !== "resolved" ? (
          <button
            type="button"
            onClick={() => onModeChange({ mode: "resolved" })}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-[#f5f6ff]"
          >
            <Check className="size-4" /> Resolve
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onModeChange({ mode: "human", owner: "Yosra" })}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold"
          >
            Reopen
          </button>
        )}
      </div>
    </header>
  );
}

function ReplyComposer({
  conversation,
  draft,
  onDraftChange,
  onSubmit,
}: {
  conversation: InboxConversation;
  draft: string;
  onDraftChange: (draft: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-[#e5e5e9] bg-white p-4"
    >
      {conversation.mode === "human" ? (
        <div className="flex items-end gap-3">
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={2}
            placeholder="Write a reply…"
            className="max-h-28 min-h-12 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb] disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f3f3f5] text-sm font-medium text-[#74747d]">
          {conversation.mode === "resolved" ? (
            <CheckCircle2 className="size-4 text-emerald-600" />
          ) : (
            <Bot className="size-4" />
          )}
          {conversation.mode === "resolved"
            ? "This conversation is resolved."
            : "The AI is handling this conversation. Take over to reply."}
        </div>
      )}
    </form>
  );
}
