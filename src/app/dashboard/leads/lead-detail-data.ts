import { supabaseAdmin } from "@/lib/database/supabase-admin";
import type { LeadObjection } from "@/types/lead";

export type LeadConversationMessage = {
  created_at: string;
  id: string;
  message: string;
  role: "user" | "assistant" | "system";
};

export type LeadDetail = {
  budget: string | null;
  company: string | null;
  conversion_score: number | null;
  country: string | null;
  email: string | null;
  id: string;
  lead_temperature: string | null;
  name: string | null;
  need: string | null;
  objections: unknown;
  pipeline_stage: string | null;
  sector: string | null;
  session_id: string;
  suggested_next_action: string | null;
  summary: string | null;
  updated_at: string;
  urgency: string | null;
};

export type LeadDetailData = {
  conversation: LeadConversationMessage[];
  lastActivity: string;
  lead: LeadDetail;
  objections: LeadObjection[];
  pipelineStage: string;
  score: number;
  temperature: "cold" | "warm" | "hot";
};

export async function getLeadDetail(
  id: string,
): Promise<LeadDetailData | null> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;

  const lead = data as LeadDetail;
  const { data: messages } = await supabaseAdmin
    .from("conversations")
    .select("id,role,message,created_at")
    .eq("session_id", lead.session_id)
    .order("created_at", { ascending: true });
  const conversation = (messages ?? []) as LeadConversationMessage[];

  const rawTemperature = lead.lead_temperature?.toLowerCase();
  const temperature =
    rawTemperature === "hot" || rawTemperature === "warm"
      ? rawTemperature
      : "cold";

  return {
    conversation,
    lastActivity: conversation.at(-1)?.created_at ?? lead.updated_at,
    lead,
    objections: (Array.isArray(lead.objections)
      ? lead.objections
      : []) as LeadObjection[],
    pipelineStage: String(lead.pipeline_stage ?? "new"),
    score: lead.conversion_score ?? 0,
    temperature,
  };
}

export function pipelineStageLabel(value: string) {
  return (
    (
      {
        new: "New",
        qualified: "Qualified",
        meeting: "Meeting",
        proposal: "Proposal",
        won: "Won",
        lost: "Lost",
      } as Record<string, string>
    )[value] ?? value
  );
}

export function pipelineStageStyle(value: string) {
  if (value === "won") return "bg-emerald-600";
  if (value === "lost") return "bg-rose-500";
  if (value === "meeting") return "bg-violet-600";
  if (value === "proposal") return "bg-amber-500";
  if (value === "qualified") return "bg-cyan-600";
  return "bg-indigo-600";
}

export function temperatureStyle(value: string) {
  if (value === "hot") return "border-red-200 bg-red-50 text-red-700";
  if (value === "warm") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
