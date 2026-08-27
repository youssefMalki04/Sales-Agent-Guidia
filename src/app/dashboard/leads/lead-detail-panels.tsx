import type { ReactNode } from "react";
import {
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Flame,
  MessageSquareText,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LeadObjection } from "@/types/lead";
import type { LeadConversationMessage, LeadDetail } from "./lead-detail-data";
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
      <Stat icon={Flame} label="Conversion score" value={`${score}/100`} />
      <Stat
        icon={Building2}
        label="Company"
        value={company || "Not provided"}
      />
      <Stat
        icon={MessageSquareText}
        label="Messages"
        value={String(messageCount)}
      />
      <Stat
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
    <section className="rounded-xl border border-[#e3e3e8] bg-white p-6">
      <h2 className="text-lg font-semibold">Full conversation</h2>
      <div className="mt-5 space-y-3">
        {conversation.length ? (
          conversation.map((message) => (
            <div
              key={message.id}
              className="flex gap-3 rounded-lg border border-[#eeeef1] bg-[#fbfbfc] p-4"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">
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
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#e3e3e8] bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#777780]">
        <Icon className="size-4" /> {label}
      </div>
      <p className="mt-4 break-words text-xl font-semibold">{value}</p>
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
    <section className="rounded-xl border border-[#e3e3e8] bg-white p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 space-y-1 text-sm leading-6 text-[#60606a]">
        {children}
      </div>
    </section>
  );
}
