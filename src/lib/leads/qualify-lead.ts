import { GoogleGenerativeAI } from "@google/generative-ai";

import { mergeLeadUpdate, type LeadRecord } from "./merge-lead-update";
import {
  logLeadUpdateValidationFailed,
  validateLeadUpdate,
} from "./validate-lead-update";
import { supabaseAdmin } from "../database/supabase-admin";
import { createNotification } from "../notifications/create-notification";
import { flowPrompt, getActiveQualificationFlow, type ActiveQualificationFlow } from "./active-qualification-flow";
import { dispatchWebhook } from "../webhooks/dispatch-webhook";

const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

type ConversationRow = {
  message: string;
  role: "user" | "assistant" | "system";
};

function qualificationPrompt(conversation: ConversationRow[], flow: ActiveQualificationFlow | null) {
  const transcript = conversation
    .map(({ message, role }) => `${role.toUpperCase()}: ${message}`)
    .join("\n");

  const weights = flow?.steps.map((step) => `${step.field ?? "criterion"}: ${step.weight ?? 0} points`).join(", ") || "coordonnées 20 points, besoin clair 25, entreprise/secteur 15, budget 15, urgence/délai 15, intention de démo ou d'achat 10";
  const coldMax = flow?.scoring.coldMax ?? 34;
  const warmMax = flow?.scoring.warmMax ?? 69;
  return `Analyse cette conversation commerciale et retourne uniquement un objet JSON valide.
N'invente aucune information. Utilise null lorsqu'une donnée n'est pas explicitement connue.

Barème du conversionScore : ${weights}.
leadTemperature : cold de 0 à ${coldMax}, warm de ${coldMax + 1} à ${warmMax}, hot de ${warmMax + 1} à 100.
${flowPrompt(flow)}

Format strict attendu :
{
  "name": string|null,
  "email": string|null,
  "company": string|null,
  "country": string|null,
  "sector": string|null,
  "need": string|null,
  "budget": string|null,
  "urgency": string|null,
  "leadTemperature": "cold"|"warm"|"hot",
  "conversionScore": number,
  "objections": [{"category":"price"|"security"|"integration"|"competitor"|"timing"|"human_request","status":"detected"|"answered"|"needs_follow_up"|"resolved","evidence":string}],
  "salesSummary": string,
  "suggestedNextAction": string
}

CONVERSATION
${transcript}`;
}

function parseJsonResponse(text: string) {
  const normalized = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(normalized) as unknown;
}

export async function qualifyLeadFromConversation(
  leadId: string,
  sessionId: string,
) {
  if (!apiKey) throw new Error("Gemini is not configured");

  const [leadResult, conversationResult] = await Promise.all([
    supabaseAdmin.from("leads").select("*").eq("id", leadId).single(),
    supabaseAdmin
      .from("conversations")
      .select("role,message")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(40),
  ]);

  if (leadResult.error) throw leadResult.error;
  if (conversationResult.error) throw conversationResult.error;

  const flow = await getActiveQualificationFlow();
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
  const result = await model.generateContent(
    qualificationPrompt(conversationResult.data as ConversationRow[], flow),
  );
  const validation = validateLeadUpdate(parseJsonResponse(result.response.text()), {
    leadId,
    sessionId,
  });

  if (!validation.ok) {
    await logLeadUpdateValidationFailed(validation.event);
    throw new Error("Invalid lead qualification returned by Gemini");
  }

  const update: ReturnType<typeof mergeLeadUpdate> & { pipeline_stage?: string } = mergeLeadUpdate(leadResult.data as LeadRecord, validation.data);
  const previousScore = Number((leadResult.data as Record<string, unknown>).conversion_score ?? 0);
  const previousTemperature = (leadResult.data as Record<string, unknown>).lead_temperature;
  const currentStage = String((leadResult.data as Record<string, unknown>).pipeline_stage ?? "new");
  const hotThreshold = (flow?.scoring.warmMax ?? 69) + 1;
  const isHot = (update.conversion_score ?? 0) >= hotThreshold || update.lead_temperature === "hot";
  const wasHot = previousScore >= hotThreshold || previousTemperature === "hot";
  if (isHot && ["new", "qualified"].includes(currentStage)) update.pipeline_stage = "qualified";
  const { error } = await supabaseAdmin.from("leads").update(update).eq("id", leadId);

  if (error) throw error;
  if (isHot && !wasHot) {
    await createNotification({ eventKey: `high-intent:${leadId}`, eventType: "high-intent", leadId, message: `${update.name || update.email || "A visitor"} reached a qualification score of ${update.conversion_score ?? 0}/100.`, sessionId, severity: "success", title: "High-intent lead detected" });
    await dispatchWebhook("lead.qualified", { ...update, id: leadId, session_id: sessionId });
  }
  return update;
}
