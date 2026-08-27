"use client";

import {
  Bot,
  CheckCircle2,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  clearDemoConversations,
  readDemoConversations,
  updateDemoConversationStatus,
  type DemoConversation,
} from "@/lib/demo-conversations";

export function DemoConversations() {
  const [sessions, setSessions] = useState<
    ReturnType<typeof readDemoConversations>
  >([]);
  useEffect(() => {
    const load = window.setTimeout(
      () => setSessions(readDemoConversations()),
      0,
    );
    return () => window.clearTimeout(load);
  }, []);
  if (!sessions.length) return null;
  const messageCount = sessions.reduce(
    (total, session) => total + session.messages.length,
    0,
  );
  const changeStatus = (id: string, status: DemoConversation["status"]) =>
    setSessions(updateDemoConversationStatus(id, status));
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="flex items-center justify-between border-b border-[#eeeef1] px-4 py-4">
        <div>
          <h2 className="font-semibold text-[#202026]">Playground sessions</h2>
          <p className="mt-1 text-sm text-[#777780]">
            {sessions.length} local sessions · {messageCount} messages
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearDemoConversations();
            setSessions([]);
          }}
        >
          <Trash2 className="size-4" /> Clear conversations
        </Button>
      </div>
      <div className="divide-y divide-slate-100">
        {sessions.map((session) => (
          <article
            key={session.id}
            className="p-5 transition hover:bg-[#fafaff]"
          >
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/dashboard/conversations/${encodeURIComponent(session.id)}`}
                  className="font-semibold text-slate-900 hover:text-[#5964d6]"
                >
                  {session.agentName}
                </Link>
                <p className="mt-1 text-xs text-[#777780]">{session.id}</p>
              </div>
              <Badge variant="outline" className="rounded-full capitalize">
                {session.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {session.messages.slice(-4).map((message) => (
                <div
                  key={message.id}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-[#fafafd] p-3"
                >
                  <span className="mt-0.5">
                    {message.role === "assistant" ? (
                      <Bot className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold capitalize text-[#777780]">
                      {message.role}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#50505a]">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeStatus(session.id, "completed")}
              >
                <CheckCircle2 className="size-4" /> Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeStatus(session.id, "qualified")}
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                <Sparkles className="size-4" /> Qualify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeStatus(session.id, "escalated")}
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                <ShieldAlert className="size-4" /> Escalate
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-[#5964d6] hover:bg-[#f1f2ff] hover:text-[#4f5acb]"
                asChild
              >
                <Link
                  href={`/dashboard/conversations/${encodeURIComponent(session.id)}`}
                >
                  Open details
                </Link>
              </Button>
              <p className="ml-auto flex items-center gap-2 text-xs text-[#8a8a94]">
                <MessageSquareText className="size-3.5" />{" "}
                {session.messages.length} messages ·{" "}
                {new Date(session.updatedAt).toLocaleString("fr-FR")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
