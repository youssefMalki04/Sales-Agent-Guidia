import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LeadExportActions } from "@/components/leadia/lead-export-actions";
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
  LeadConversation,
  LeadDetailStats,
} from "../lead-detail-panels";

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getLeadDetail(id);
  if (!detail) return <LeadNotFound />;

  const {
    conversation,
    lastActivity,
    lead,
    objections,
    pipelineStage,
    score,
    temperature,
  } = detail;

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fbfbfc] px-5 py-8 sm:px-8 xl:px-14">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#686872] hover:text-[#202026]"
        >
          <ArrowLeft className="size-4" /> Back to leads
        </Link>
        <header className="flex flex-col gap-4 border-b border-[#e5e5ea] pb-6 lg:flex-row lg:items-end lg:justify-between">
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
            <h1 className="mt-4 text-3xl font-semibold">
              {lead.name || lead.email || "Visitor"}
            </h1>
            <p className="mt-2 text-sm text-[#777780]">
              Session {lead.session_id}
            </p>
          </div>
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
        </header>

        <LeadDetailStats
          company={lead.company}
          lastActivity={lastActivity}
          messageCount={conversation.length}
          score={score}
        />

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
