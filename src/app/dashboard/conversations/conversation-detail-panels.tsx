import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Flame,
  MessageSquareText,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  ConversationLead,
  ConversationMessage,
} from "./conversation-detail-data";
import type { LeadObjection } from "@/types/lead";

export function ConversationDetailStats({
  messageCount,
  score,
}: {
  messageCount: number;
  score: number;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Stat
        icon={MessageSquareText}
        label="Messages"
        value={String(messageCount)}
      />
      <Stat icon={Flame} label="Conversion score" value={`${score}/100`} />
      <Stat icon={Bot} label="Agent" value="Leadia Sales Agent" />
    </section>
  );
}

export function ConversationMessages({
  conversation,
}: {
  conversation: ConversationMessage[];
}) {
  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <h2 className="text-lg font-semibold">Full conversation</h2>
      <div className="mt-5 space-y-3">
        {conversation.map((message) => (
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
                {message.message}
              </p>
              <p className="mt-2 text-xs text-[#9999a2]">
                {formatDate(message.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ConversationLeadInsights({
  lead,
  objections,
  qualified,
}: {
  lead: ConversationLead | null;
  objections: LeadObjection[];
  qualified: boolean;
}) {
  return (
    <aside className="space-y-5">
      <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
        <h2 className="font-semibold">Extracted lead information</h2>
        <div className="mt-4 divide-y divide-[#eeeef1]">
          <Field label="Name" value={lead?.name} />
          <Field label="Email" value={lead?.email} />
          <Field label="Company" value={lead?.company} />
          <Field label="Need" value={lead?.need} />
          <Field label="Budget" value={lead?.budget} />
          <Field label="Urgency" value={lead?.urgency} />
        </div>
      </section>
      <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
        <h2 className="font-semibold">Detected objections</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {objections.length ? (
            objections.map((item, index) => (
              <Badge key={`${item.category}-${index}`} variant="outline">
                {item.category} · {item.status}
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
        <p className="mt-2 flex gap-2 text-sm leading-6 text-emerald-800">
          {qualified ? (
            <CheckCircle2 className="mt-1 size-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-1 size-4 shrink-0" />
          )}
          {lead?.suggested_next_action ||
            "Continue qualification and collect company, budget and urgency."}
        </p>
      </section>
    </aside>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="py-3">
      <p className="text-xs font-bold uppercase text-[#888892]">{label}</p>
      <p className="mt-1 break-words text-sm text-[#50505a]">
        {value || "Not provided"}
      </p>
    </div>
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
        </span>
        {label}
      </div>
      <p className="mt-4 text-xl font-semibold">{value}</p>
    </div>
  );
}
