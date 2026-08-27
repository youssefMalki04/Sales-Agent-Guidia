import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DemoConversations } from "./demo-conversations";
import {
  getConversationSessions,
  normalizeSearchParam,
} from "./conversation-data";
import {
  ConversationSessionsPanel,
  ConversationStats,
} from "./conversation-panels";
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

        <ConversationStats
          hotSessions={hotSessions}
          messageTotal={messageTotal}
          sessionTotal={sessions.length}
        />

        <DemoConversations />

        <ConversationSessionsPanel query={query} sessions={sessions} />
      </div>
    </div>
  );
}
