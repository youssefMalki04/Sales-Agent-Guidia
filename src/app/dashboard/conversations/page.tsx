import {
  Bot,
  Camera,
  MessageSquareText,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DemoConversations } from "./demo-conversations";
import {
  formatDate,
  getConversationSessions,
  normalizeSearchParam,
  ROLE_STYLES,
  TEMPERATURE_STYLES,
} from "./conversation-data";
import type { ConversationsPageProps } from "./conversation-types";

export default async function ConversationsPage({
  searchParams,
}: ConversationsPageProps) {
  const params = await searchParams;
  const query = normalizeSearchParam(params?.q);
  const sessions = await getConversationSessions(query);
  const messageTotal = sessions.reduce(
    (total, session) => total + session.messageCount,
    0,
  );
  const hotSessions = sessions.filter(
    (session) => session.temperature === "hot",
  ).length;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto flex max-w-[1240px] flex-col gap-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Conversation intelligence
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Conversations
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Historique des messages entre les visiteurs et l&apos;agent IA,
              regroupe par session pour analyser la qualification commerciale.
            </p>
          </div>

          <Badge
            variant="outline"
            className="h-8 rounded-full border-[#e1e4f8] bg-[#f1f2ff] px-3 text-[#5964d6]"
          >
            Messages
          </Badge>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
            <div className="flex items-center gap-3">
              <Camera className="size-5 text-[#4f46e5]" />
              <p className="text-sm font-semibold text-[#686872]">Sessions</p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#171717]">
              {sessions.length}
            </p>
          </div>

          <div className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
            <div className="flex items-center gap-3">
              <MessageSquareText className="size-5 text-[#0f766e]" />
              <p className="text-sm font-semibold text-[#686872]">Messages</p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#171717]">
              {messageTotal}
            </p>
          </div>

          <div className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-[#dc2626]" />
              <p className="text-sm font-semibold text-[#686872]">
                Sessions chaudes
              </p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#171717]">
              {hotSessions}
            </p>
          </div>
        </section>

        <DemoConversations />

        <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
          <div className="flex flex-col gap-3 border-b border-[#eeeef1] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#202026]">
                Sessions recentes
              </h2>
              <p className="mt-1 text-sm text-[#777780]">
                {sessions.length} sessions affichees, triees par dernier
                message.
              </p>
            </div>

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
          </div>

          {sessions.length ? (
            <div className="divide-y divide-[#eeeef1]">
              {sessions.map((session) => (
                <article
                  key={session.sessionId}
                  className="p-5 transition hover:bg-[#fafaff]"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[#202026]">
                          {session.leadName}
                        </h3>
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
                      <p className="mt-1">
                        {formatDate(session.lastMessageAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {session.messages.map((message) => (
                      <div
                        key={message.id}
                        className="rounded-xl border border-slate-100 bg-[#fafafd] p-3"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md capitalize",
                              ROLE_STYLES[message.role],
                            )}
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
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-semibold text-[#202026]">
                Aucune conversation trouvee
              </p>
              <p className="mt-2 text-sm text-[#777780]">
                Les messages sauvegardes par l&apos;agent apparaitront ici.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
