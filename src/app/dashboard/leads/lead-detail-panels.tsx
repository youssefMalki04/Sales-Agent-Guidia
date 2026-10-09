import type { ReactNode } from "react";
import {
  Activity,
  ArrowRightLeft,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Flame,
  Mail,
  MessageSquareText,
  CalendarDays,
  CalendarClock,
  CloudUpload,
  User,
  StickyNote,
  Paperclip,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LeadObjection } from "@/types/lead";
import type {
  LeadConversationMessage,
  LeadActivityItem,
  LeadDetail,
  LeadEmailHistoryItem,
} from "./lead-detail-data";
import { formatLeadDate, pipelineStageLabel } from "./lead-detail-data";

export function LeadDetailStats({
  company,
  lastActivity,
  messageCount,
  score,
}: {
  company: string | null;
  lastActivity: string;
  messageCount: number;
  score: number;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat
        accent="violet"
        icon={Flame}
        label="Conversion score"
        value={`${score}/100`}
      />
      <Stat
        accent="blue"
        icon={Building2}
        label="Company"
        value={company || "Not provided"}
      />
      <Stat
        accent="emerald"
        icon={MessageSquareText}
        label="Messages"
        value={String(messageCount)}
      />
      <Stat
        accent="amber"
        icon={Clock3}
        label="Last activity"
        value={formatLeadDate(lastActivity)}
      />
    </section>
  );
}

export function LeadConversation({
  conversation,
}: {
  conversation: LeadConversationMessage[];
}) {
  return (
    <section className="rounded-[24px] border border-[#e3e5ee] bg-white p-5 shadow-[0_10px_35px_rgba(36,39,73,.045)] sm:p-6">
      <div className="flex items-center justify-between border-b border-[#eff0f5] pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b8e9c]">
            Activity
          </p>
          <h2 className="mt-1 text-lg font-bold">Full conversation</h2>
        </div>
        <span className="rounded-full bg-[#f0f1ff] px-3 py-1 text-xs font-bold text-[#5b63d9]">
          {conversation.length} messages
        </span>
      </div>
      <div className="mt-5 space-y-3.5">
        {conversation.length ? (
          conversation.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 rounded-2xl border p-4 ${message.role === "assistant" ? "border-[#e5e6f5] bg-[#f7f7ff]" : "border-[#eceef2] bg-[#fbfbfc]"}`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${message.role === "assistant" ? "text-[#5962dc]" : "text-[#5f6370]"}`}
              >
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
                  {formatDateTime(message.created_at)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#777780]">
            No conversation recorded for this lead.
          </p>
        )}
      </div>
    </section>
  );
}

export function LeadEmailHistory({
  emails,
}: {
  emails: LeadEmailHistoryItem[];
}) {
  return (
    <section className="rounded-[24px] border border-[#e3e5ee] bg-white p-5 shadow-[0_10px_35px_rgba(36,39,73,.045)] sm:p-6">
      <div className="flex items-center justify-between border-b border-[#eff0f5] pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b8e9c]">
            Outreach
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
            <Mail className="size-5 text-[#5962dc]" /> Email history
          </h2>
        </div>
        <span className="rounded-full bg-[#f0f1ff] px-3 py-1 text-xs font-bold text-[#5b63d9]">
          {emails.length} emails
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {emails.length ? (
          emails.map((email) => (
            <details
              key={email.id}
              className="group rounded-2xl border border-[#e8e9f0] bg-[#fcfcfd] px-4 py-3.5"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full ${email.status === "sent" ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#33343d]">
                    {email.subject || "Email without subject"}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#858895]">
                    {email.recipient || "Unknown recipient"} ·{" "}
                    {formatDateTime(email.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${email.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                >
                  {email.status}
                </span>
              </summary>
              <div className="mt-4 border-t border-[#ececf2] pt-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#5f626f]">
                  {email.body ||
                    email.deliveryMessage ||
                    "No message content recorded."}
                </p>
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dfe1eb] bg-[#fafaff] px-5 py-8 text-center">
            <Mail className="mx-auto size-6 text-[#9da1b3]" />
            <p className="mt-3 text-sm font-semibold text-[#666976]">
              No email sent to this lead yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function LeadActivityTimeline({
  activity,
}: {
  activity: LeadActivityItem[];
}) {
  const icons = {
    attachment: Paperclip,
    conversation: MessageSquareText,
    crm: CloudUpload,
    email: Mail,
    "follow-up": CalendarClock,
    meeting: CalendarDays,
    note: StickyNote,
    pipeline: ArrowRightLeft,
    score: Activity,
  };

  return (
    <section className="rounded-[24px] border border-[#e3e5ee] bg-white p-5 shadow-[0_10px_35px_rgba(36,39,73,.045)] sm:p-6">
      <div className="flex items-center justify-between border-b border-[#eff0f5] pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b8e9c]">
            Journey
          </p>
          <h2 className="mt-1 text-lg font-bold">Activity timeline</h2>
        </div>
        <span className="rounded-full bg-[#f0f1ff] px-3 py-1 text-xs font-bold text-[#5b63d9]">
          {activity.length} events
        </span>
      </div>
      <div className="mt-5">
        {activity.length ? (
          activity.map((item, index) => {
            const Icon = icons[item.kind];
            const color =
              item.status === "failed"
                ? "bg-red-50 text-red-600 ring-red-100"
                : item.status === "success"
                  ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                  : "bg-indigo-50 text-indigo-600 ring-indigo-100";
            return (
              <div key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
                {index < activity.length - 1 ? (
                  <span className="absolute left-[17px] top-9 h-[calc(100%-20px)] w-px bg-[#e7e8ef]" />
                ) : null}
                <span
                  className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ${color}`}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-bold text-[#33343d]">
                      {item.title}
                    </p>
                    <time dateTime={item.timestamp} className="text-xs text-[#9395a1]">
                      {formatDateTime(item.timestamp)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#717481]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-5 text-center text-sm text-[#777a88]">
            No activity recorded yet.
          </p>
        )}
      </div>
    </section>
  );
}

export function LeadCommercialInsights({
  lead,
  objections,
  pipelineStage,
}: {
  lead: LeadDetail;
  objections: LeadObjection[];
  pipelineStage: string;
}) {
  return (
    <aside className="space-y-5">
      <InfoSection title="Sales summary">
        {lead.summary || "No summary generated yet."}
      </InfoSection>
      <InfoSection title="Identified need">
        {lead.need || "Not identified yet."}
      </InfoSection>
      <InfoSection title="Qualification details">
        <Detail
          label="Pipeline stage"
          value={pipelineStageLabel(pipelineStage)}
        />
        <Detail label="Budget" value={lead.budget} />
        <Detail label="Urgency" value={lead.urgency} />
        <Detail label="Sector" value={lead.sector} />
        <Detail label="Country" value={lead.country} />
      </InfoSection>
      <InfoSection title="Objections">
        {objections.length ? (
          <div className="flex flex-wrap gap-2">
            {objections.map((item, index) => (
              <Badge key={`${item.category}-${index}`} variant="outline">
                {item.category} · {item.status}
              </Badge>
            ))}
          </div>
        ) : (
          "No explicit objection detected."
        )}
      </InfoSection>
      <InfoSection title="Suggested next action">
        <span className="flex gap-2">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          {lead.suggested_next_action ||
            "Continue qualification and confirm the next commercial step."}
        </span>
      </InfoSection>
    </aside>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function Stat({
  accent,
  icon: Icon,
  label,
  value,
}: {
  accent: "amber" | "blue" | "emerald" | "violet";
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  const accentStyle = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  }[accent];
  return (
    <div className="rounded-[22px] border border-[#e3e5ee] bg-white p-5 shadow-[0_8px_28px_rgba(36,39,73,.04)]">
      <div className="flex items-center gap-3 text-sm font-semibold text-[#777a88]">
        <span
          className={`flex size-9 items-center justify-center rounded-xl ${accentStyle}`}
        >
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <p className="mt-4 break-words text-2xl font-bold tracking-[-.025em] text-[#25262e]">
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <p>
      <span className="font-semibold text-[#44444d]">{label}:</span>{" "}
      {value || "Not provided"}
    </p>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#e3e5ee] bg-white p-5 shadow-[0_8px_28px_rgba(36,39,73,.04)]">
      <h2 className="font-bold text-[#292a33]">{title}</h2>
      <div className="mt-3 space-y-1.5 text-sm leading-6 text-[#666976]">
        {children}
      </div>
    </section>
  );
}
