import {
  Bot,
  Camera,
  MessageSquareText,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  formatDate,
  ROLE_STYLES,
  TEMPERATURE_STYLES,
} from "./conversation-data";
import type {
  ConversationRow,
  ConversationSession,
} from "./conversation-types";

type ConversationStatsProps = {
  hotSessions: number;
  messageTotal: number;
  sessionTotal: number;
};

const SUMMARY_CARDS = [
  { icon: Camera, key: "sessions", label: "Sessions", tone: "text-[#4f46e5]" },
  {
    icon: MessageSquareText,
    key: "messages",
    label: "Messages",
    tone: "text-[#0f766e]",
  },
  {
    icon: UserRound,
    key: "hot",
    label: "Sessions chaudes",
    tone: "text-[#dc2626]",
  },
] as const;

export function ConversationStats({
  hotSessions,
  messageTotal,
  sessionTotal,
}: ConversationStatsProps) {
  const totals = {
    hot: hotSessions,
    messages: messageTotal,
    sessions: sessionTotal,
  };

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {SUMMARY_CARDS.map(({ icon: Icon, key, label, tone }) => (
        <div
          key={key}
          className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]"
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("size-5", tone)} />
            <p className="text-sm font-semibold text-[#686872]">{label}</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-[#171717]">
            {totals[key]}
          </p>
        </div>
      ))}
    </section>
  );
}

export function ConversationSessionsPanel({
  query,
  sessions,
}: {
  query: string;
  sessions: ConversationSession[];
}) {
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="flex flex-col gap-3 border-b border-[#eeeef1] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#202026]">
            Sessions recentes
          </h2>
          <p className="mt-1 text-sm text-[#777780]">
            {sessions.length} sessions affichees, triees par dernier message.
          </p>
        </div>
        <ConversationSearch query={query} />
      </div>

      {sessions.length ? (
        <div className="divide-y divide-[#eeeef1]">
          {sessions.map((session) => (
            <ConversationSessionCard
              key={session.sessionId}
              session={session}
            />
          ))}
        </div>
      ) : (
        <EmptyConversations />
      )}
    </section>
  );
}

function ConversationSearch({ query }: { query: string }) {
  return (
    <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label className="relative w-full sm:min-w-[280px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8a8a94]" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Rechercher session ou message..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
        />
      </label>
      <button
        type="submit"
        className="h-10 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
      >
        Rechercher
      </button>
    </form>
  );
}

function ConversationSessionCard({
  session,
}: {
  session: ConversationSession;
}) {
  return (
    <article className="p-5 transition hover:bg-[#fafaff]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#202026]">{session.leadName}</h3>
            <Badge
              variant="outline"
              className={cn(
                "rounded-md capitalize",
                TEMPERATURE_STYLES[session.temperature] ??
                  TEMPERATURE_STYLES.cold,
              )}
            >
              {session.temperature}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-md border-[#d9d9df] bg-[#fbfbfc] text-[#50505a]"
            >
              {session.score}/100
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm text-[#686872]">
            {session.company} - {session.sessionId}
          </p>
        </div>

        <div className="text-sm text-[#777780]">
          <p>{session.messageCount} messages</p>
          <p className="mt-1">{formatDate(session.lastMessageAt)}</p>
          <Link
            href={`/dashboard/conversations/${encodeURIComponent(session.sessionId)}`}
            className="mt-2 inline-flex font-semibold text-[#5964d6] hover:text-[#4f5acb]"
          >
            View conversation
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {session.messages.map((message) => (
          <ConversationMessage key={message.id} message={message} />
        ))}
      </div>
    </article>
  );
}

function ConversationMessage({ message }: { message: ConversationRow }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#fafafd] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <Badge
          variant="outline"
          className={cn("rounded-md capitalize", ROLE_STYLES[message.role])}
        >
          {message.role === "assistant" ? (
            <Bot className="mr-1 size-3" />
          ) : null}
          {message.role}
        </Badge>
        <span className="text-xs font-medium text-[#8a8a94]">
          {formatDate(message.created_at)}
        </span>
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-[#50505a]">
        {message.message}
      </p>
    </div>
  );
}

function EmptyConversations() {
  return (
    <div className="px-4 py-12 text-center">
      <p className="text-sm font-semibold text-[#202026]">
        Aucune conversation trouvee
      </p>
      <p className="mt-2 text-sm text-[#777780]">
        Les messages sauvegardes par l&apos;agent apparaitront ici.
      </p>
    </div>
  );
}
