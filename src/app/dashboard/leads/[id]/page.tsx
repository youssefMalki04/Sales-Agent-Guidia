import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LeadExportActions } from "@/components/leadia/lead-export-actions";
import { LeadEmailAction } from "@/components/leadia/lead-email-action";
import { LeadFollowUpAction } from "@/components/leadia/lead-follow-up-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getLeadDetail,
  pipelineStageLabel,
  pipelineStageStyle,
  temperatureStyle,
} from "../lead-detail-data";
import {
  LeadCommercialInsights,
  LeadActivityTimeline,
  LeadConversation,
  LeadDetailStats,
  LeadEmailHistory,
} from "../lead-detail-panels";
import { LeadFollowUpsPanel } from "../lead-follow-ups-panel";
import { LeadNotesPanel } from "../lead-notes-panel";
import { LeadMeetingsPanel } from "../lead-meetings-panel";

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getLeadDetail(id);
  if (!detail) return <LeadNotFound />;

  const {
    activity,
    conversation,
    emailHistory,
    followUps,
    lastActivity,
    lead,
    notes,
    objections,
    pipelineStage,
    score,
    temperature,
  } = detail;

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[radial-gradient(circle_at_top_right,#f0f1ff_0,transparent_32%),#f8f9fc] px-5 py-7 sm:px-8 xl:px-12">
      <div className="mx-auto max-w-[1320px] space-y-5">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-semibold text-[#707382] transition hover:text-[#535bd2]"
        >
          <ArrowLeft className="size-4" /> Back to leads
        </Link>
        <header className="relative overflow-hidden rounded-[28px] border border-[#e3e5f1] bg-white px-6 py-6 shadow-[0_12px_40px_rgba(36,39,73,.06)] sm:px-8">
          <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-[#686fe5]/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={pipelineStageStyle(pipelineStage)}>
                  {pipelineStageLabel(pipelineStage).toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className={temperatureStyle(temperature)}
                >
                  {temperature.toUpperCase()}
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-.035em] text-[#1f2028] sm:text-4xl">
                {lead.name || lead.email || "Visitor"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#777a88]">
                {lead.email ? <span>{lead.email}</span> : null}
                {lead.company ? (
                  <span className="font-semibold text-[#555866]">
                    {lead.company}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex max-w-[680px] flex-wrap items-start gap-2 rounded-2xl border border-[#e7e8f2] bg-[#fafaff]/90 p-2.5">
              <LeadFollowUpAction
                leadId={lead.id}
                leadName={lead.name || lead.email || "this lead"}
              />
              <LeadEmailAction
                company={lead.company ?? undefined}
                email={lead.email ?? undefined}
                initialLanguage={detectEmailLanguage(
                  conversation.map((item) => item.message).join(" "),
                )}
                leadId={lead.id}
                name={lead.name ?? undefined}
                need={lead.need ?? undefined}
              />
              <LeadExportActions
                lead={{
                  id: lead.id,
                  sessionId: lead.session_id,
                  name: lead.name ?? undefined,
                  email: lead.email ?? undefined,
                  company: lead.company ?? undefined,
                  country: lead.country ?? undefined,
                  sector: lead.sector ?? undefined,
                  need: lead.need ?? undefined,
                  budget: lead.budget ?? undefined,
                  urgency: lead.urgency ?? undefined,
                  leadTemperature: temperature,
                  conversionScore: score,
                  objections: objections.map((item) => item.category),
                  summary: lead.summary ?? undefined,
                  suggestedNextAction: lead.suggested_next_action ?? undefined,
                }}
              />
            </div>
          </div>
        </header>

        <LeadDetailStats
          company={lead.company}
          lastActivity={lastActivity}
          messageCount={conversation.length}
          score={score}
        />

        <LeadFollowUpsPanel reminders={followUps} />
        <LeadMeetingsPanel leadId={lead.id} name={lead.name} email={lead.email} company={lead.company} />

        <LeadNotesPanel initialNotes={notes} leadId={lead.id} />

        <LeadActivityTimeline activity={activity} />

        <LeadEmailHistory emails={emailHistory} />

        <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <LeadConversation conversation={conversation} />
          <LeadCommercialInsights
            lead={lead}
            objections={objections}
            pipelineStage={pipelineStage}
          />
        </div>
      </div>
    </main>
  );
}

function detectEmailLanguage(text: string): "ar" | "en" | "fr" {
  if (/[\u0600-\u06ff]/u.test(text)) return "ar";
  if (
    /[àâçéèêëîïôûùüÿœ]|\b(bonjour|merci|vous|votre|nous|souhaite|besoin|entreprise)\b/iu.test(
      text,
    )
  ) {
    return "fr";
  }
  return "en";
}

function LeadNotFound() {
  return (
    <main className="px-8 py-14">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Lead not found</h1>
        <p className="mt-2 text-sm text-[#777780]">
          This lead does not exist or has been deleted.
        </p>
        <Button asChild className="mt-5">
          <Link href="/dashboard/leads">
            <ArrowLeft className="size-4" /> Back to leads
          </Link>
        </Button>
      </div>
    </main>
  );
}
