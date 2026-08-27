import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getConversationDetail } from "../conversation-detail-data";
import {
  ConversationDetailStats,
  ConversationLeadInsights,
  ConversationMessages,
} from "../conversation-detail-panels";

export default async function ConversationDetailsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const detail = await getConversationDetail(sessionId);

  if (!detail) return <ConversationNotFound />;

  const {
    conversation,
    lead,
    leadName,
    objections,
    qualified,
    score,
    temperature,
  } = detail;

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px] space-y-7">
        <Link
          href="/dashboard/conversations"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#5964d6]"
        >
          <ArrowLeft className="size-4" /> Back to conversations
        </Link>
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={
                  qualified
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }
              >
                {qualified ? "QUALIFIED" : "ACTIVE"}
              </Badge>
              <Badge
                variant="outline"
                className={temperatureStyle(temperature)}
              >
                {temperature.toUpperCase()}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Conversation with {leadName}
            </h1>
            <p className="mt-2 text-sm text-[#777780]">Session {sessionId}</p>
          </div>
          {lead ? (
            <Button
              asChild
              className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            >
              <Link href={`/dashboard/leads/${lead.id}`}>
                <Sparkles className="size-4" /> View qualified lead
              </Link>
            </Button>
          ) : null}
        </header>

        <ConversationDetailStats
          messageCount={conversation.length}
          score={score}
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <ConversationMessages conversation={conversation} />
          <ConversationLeadInsights
            lead={lead}
            objections={objections}
            qualified={qualified}
          />
        </div>
      </div>
    </main>
  );
}

function ConversationNotFound() {
  return (
    <main className="px-8 py-14">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Conversation not found</h1>
        <p className="mt-2 text-sm text-[#777780]">
          This session does not exist or contains no saved messages.
        </p>
        <Button asChild className="mt-5">
          <Link href="/dashboard/conversations">
            <ArrowLeft className="size-4" /> Back to conversations
          </Link>
        </Button>
      </div>
    </main>
  );
}

function temperatureStyle(value: string) {
  if (value === "hot") return "border-red-200 bg-red-50 text-red-700";
  if (value === "warm") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}
