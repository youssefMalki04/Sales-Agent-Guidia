import { supabaseAdmin } from "@/lib/database/supabase-admin";
import type { LeadObjection } from "@/types/lead";

export type ConversationMessage = {
  created_at: string;
  id: string;
  message: string;
  role: "user" | "assistant" | "system";
};

export type ConversationLead = {
  budget?: string | null;
  company?: string | null;
  conversion_score?: number | null;
  email?: string | null;
  id: string;
  lead_temperature?: string | null;
  name?: string | null;
  need?: string | null;
  objections?: unknown;
  suggested_next_action?: string | null;
  urgency?: string | null;
};

export type ConversationDetail = {
  conversation: ConversationMessage[];
  lead: ConversationLead | null;
  leadName: string;
  objections: LeadObjection[];
  qualified: boolean;
  score: number;
  temperature: string;
};

export async function getConversationDetail(
  sessionId: string,
): Promise<ConversationDetail | null> {
  const [{ data: messages, error }, { data: leadData }] = await Promise.all([
    supabaseAdmin
      .from("conversations")
      .select("id,role,message,created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("leads")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (error || !messages?.length) return null;

  const conversation = messages as ConversationMessage[];
  const lead = leadData as ConversationLead | null;
  const score = lead?.conversion_score ?? 0;
  const temperature = lead?.lead_temperature ?? "cold";

  return {
    conversation,
    lead,
    leadName: lead?.name || lead?.email || "Visitor",
    objections: (Array.isArray(lead?.objections)
      ? lead.objections
      : []) as LeadObjection[],
    qualified: score >= 70 || temperature === "hot",
    score,
    temperature,
  };
}
