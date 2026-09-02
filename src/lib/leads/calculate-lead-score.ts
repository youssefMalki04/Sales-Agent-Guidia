import type { LeadObjection } from "@/types/lead";

type ScorableLead = {
  budget?: string | null;
  company?: string | null;
  email?: string | null;
  name?: string | null;
  need?: string | null;
  objections?: LeadObjection[] | null;
  sector?: string | null;
  urgency?: string | null;
};

type ConversationMessage = {
  message: string;
  role: "user" | "assistant" | "system";
};

export type LeadScoreCriterion =
  | "professionalEmail"
  | "name"
  | "company"
  | "sector"
  | "need"
  | "budget"
  | "highUrgency"
  | "crmOrIntegration"
  | "commercialIntent"
  | "resolvedObjection";

export type LeadScoreBreakdown = Record<LeadScoreCriterion, number>;

export type LeadScoreResult = {
  breakdown: LeadScoreBreakdown;
  score: number;
  temperature: "cold" | "warm" | "hot";
};

const PERSONAL_EMAIL_DOMAINS = new Set([
  "aol.com",
  "gmail.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "mail.com",
  "outlook.com",
  "proton.me",
  "protonmail.com",
  "yahoo.com",
  "yandex.com",
]);

const HIGH_URGENCY_PATTERN =
  /\b(urgent|urgente|urgently|imm[eé]diat|asap|ce mois|this month|d[eé]s que possible|dans les? (?:prochains? )?(?:jours?|semaines?)|forte?|high|now|maintenant)\b/i;
const CRM_OR_INTEGRATION_PATTERN =
  /\b(api|crm|hubspot|salesforce|slack|shopify|webhook|zendesk|freshdesk|int[eé]gration|integrat(?:e|ion|ed))\b/i;
const COMMERCIAL_INTENT_PATTERN =
  /\b(d[eé]mo(?:nstration)?|demo|prix|tarif|pricing|price|devis|quote|acheter|buy|achat|rendez-vous|rdv|meeting|call|appel)\b/i;

function hasText(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isProfessionalEmail(email: string | null | undefined) {
  if (!hasText(email)) return false;

  const domain = email!.trim().toLowerCase().split("@")[1];
  return Boolean(domain && !PERSONAL_EMAIL_DOMAINS.has(domain));
}

export function classifyLeadTemperature(
  score: number,
  thresholds: { coldMax: number; warmMax: number } = {
    coldMax: 39,
    warmMax: 69,
  },
): "cold" | "warm" | "hot" {
  if (score <= thresholds.coldMax) return "cold";
  if (score <= thresholds.warmMax) return "warm";
  return "hot";
}

export function calculateLeadScore(input: {
  conversation?: ConversationMessage[];
  lead: ScorableLead;
  thresholds?: { coldMax: number; warmMax: number };
}): LeadScoreResult {
  const visitorTranscript = (input.conversation ?? [])
    .filter(({ role }) => role === "user")
    .map(({ message }) => message)
    .join(" ");
  const urgencyEvidence = `${input.lead.urgency ?? ""} ${visitorTranscript}`;
  const resolvedObjection = (input.lead.objections ?? []).some(({ status }) =>
    ["answered", "resolved"].includes(status),
  );

  const breakdown: LeadScoreBreakdown = {
    professionalEmail: isProfessionalEmail(input.lead.email) ? 10 : 0,
    name: hasText(input.lead.name) ? 5 : 0,
    company: hasText(input.lead.company) ? 10 : 0,
    sector: hasText(input.lead.sector) ? 10 : 0,
    need: hasText(input.lead.need) ? 20 : 0,
    budget: hasText(input.lead.budget) ? 15 : 0,
    highUrgency: HIGH_URGENCY_PATTERN.test(urgencyEvidence) ? 15 : 0,
    crmOrIntegration: CRM_OR_INTEGRATION_PATTERN.test(visitorTranscript)
      ? 5
      : 0,
    commercialIntent: COMMERCIAL_INTENT_PATTERN.test(visitorTranscript)
      ? 15
      : 0,
    resolvedObjection: resolvedObjection ? 5 : 0,
  };
  const score = Math.min(
    100,
    Object.values(breakdown).reduce((total, points) => total + points, 0),
  );

  return {
    breakdown,
    score,
    temperature: classifyLeadTemperature(score, input.thresholds),
  };
}
