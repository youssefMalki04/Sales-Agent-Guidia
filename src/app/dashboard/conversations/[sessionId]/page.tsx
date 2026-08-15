"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Flame,
  MessageSquareText,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  readDemoConversations,
  updateDemoConversationStatus,
  type DemoConversation,
} from "@/lib/demo-conversations";

const statusStyles = {
  active: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-slate-200 bg-slate-50 text-slate-700",
  qualified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  escalated: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function ConversationDetailsPage() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<DemoConversation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = window.setTimeout(() => {
      setSession(
        readDemoConversations().find((item) => item.id === params.sessionId) ??
          null,
      );
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(load);
  }, [params.sessionId]);

  if (!loaded)
    return (
      <div className="px-8 py-14 text-sm text-[#777780]">
        Loading conversation…
      </div>
    );
  if (!session)
    return (
      <main className="px-8 py-14">
        <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Conversation not found</h1>
          <p className="mt-2 text-sm text-[#777780]">
            This local session may have been reset.
          </p>
          <Button asChild className="mt-5">
            <Link href="/dashboard/conversations">
              <ArrowLeft className="size-4" /> Back to conversations
            </Link>
          </Button>
        </div>
      </main>
    );

  const userMessages = session.messages.filter(
    (message) => message.role === "user",
  );
  const score = Math.min(95, 20 + userMessages.length * 20);
  const temperature = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
  const corpus = userMessages
    .map((message) => message.content.toLowerCase())
    .join(" ");
  const objections = [
    ["price", "Price"],
    ["prix", "Price"],
    ["security", "Security"],
    ["sécurité", "Security"],
    ["integration", "Integration"],
    ["concurrent", "Competitor"],
    ["human", "Human request"],
  ]
    .filter(([keyword]) => corpus.includes(keyword))
    .map(([, label]) => label);
  const extracted = [
    ["Name", "Not provided"],
    ["Email", "Not provided"],
    ["Company", "Not provided"],
    ["Need", userMessages.at(-1)?.content ?? "Not identified"],
    ["Budget", corpus.includes("budget") ? "Mentioned" : "Not provided"],
    ["Urgency", corpus.includes("urgent") ? "High" : "Not confirmed"],
  ];

  function changeStatus(status: DemoConversation["status"]) {
    updateDemoConversationStatus(session!.id, status);
    setSession((current) =>
      current
        ? { ...current, status, updatedAt: new Date().toISOString() }
        : current,
    );
  }

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
              <Badge variant="outline" className={statusStyles[session.status]}>
                {session.status.toUpperCase()}
              </Badge>
              <Badge
                variant="outline"
                className={
                  temperature === "hot"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : temperature === "warm"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                }
              >
                {temperature.toUpperCase()}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Conversation with {session.agentName}
            </h1>
            <p className="mt-2 text-sm text-[#777780]">Session {session.id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => changeStatus("completed")}
            >
              <CheckCircle2 className="size-4" /> Complete
            </Button>
            <Button
              variant="outline"
              onClick={() => changeStatus("escalated")}
              className="rounded-xl border-amber-200 bg-amber-50 text-amber-700"
            >
              <AlertTriangle className="size-4" /> Escalate
            </Button>
            <Button
              onClick={() => changeStatus("qualified")}
              className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            >
              <Sparkles className="size-4" /> Qualify lead
            </Button>
          </div>
        </header>
        <section className="grid gap-4 sm:grid-cols-3">
          <Stat
            icon={MessageSquareText}
            label="Messages"
            value={String(session.messages.length)}
          />
          <Stat icon={Flame} label="Conversion score" value={`${score}/100`} />
          <Stat icon={Bot} label="Agent" value={session.agentName} />
        </section>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
            <h2 className="text-lg font-semibold">Full conversation</h2>
            <div className="mt-5 space-y-3">
              {session.messages.map((message) => (
                <div
                  key={message.id}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-[#fafafd] p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                    {message.role === "assistant" ? (
                      <Bot className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-[#888892]">
                      {message.role}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#50505a]">
                      {message.content}
                    </p>
                    <p className="mt-2 text-xs text-[#9999a2]">
                      {new Date(message.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-5">
            <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
              <h2 className="font-semibold">Extracted lead information</h2>
              <div className="mt-4 divide-y divide-[#eeeef1]">
                {extracted.map(([label, value]) => (
                  <div key={label} className="py-3">
                    <p className="text-xs font-bold uppercase text-[#888892]">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm text-[#50505a]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
              <h2 className="font-semibold">Detected objections</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {objections.length ? (
                  [...new Set(objections)].map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-[#777780]">
                    No explicit objection detected.
                  </span>
                )}
              </div>
            </section>
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="font-semibold text-emerald-900">
                Suggested next action
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                {score >= 70
                  ? "Book a product demonstration and notify the sales team."
                  : "Continue qualification and collect company, budget and urgency."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
          <Icon className="size-4" />
        </span>{" "}
        {label}
      </div>
      <p className="mt-4 text-xl font-semibold">{value}</p>
    </div>
  );
}
