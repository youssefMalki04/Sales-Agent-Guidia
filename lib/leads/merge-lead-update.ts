import type { LeadObjection, LeadUpdate } from "@/lib/schemas/lead";

export type LeadRecord = {
  name?: string | null;
  email?: string | null;
  company?: string | null;
  country?: string | null;
  sector?: string | null;
  need?: string | null;
  budget?: string | null;
  urgency?: string | null;
  lead_temperature?: string | null;
  conversion_score?: number | null;
  objections?: LeadObjection[] | null;
  summary?: string | null;
  suggested_next_action?: string | null;
};

function keepExistingText(currentValue: string | null | undefined, nextValue: string | null | undefined) {
  if (typeof nextValue !== "string") {
    return currentValue ?? null;
  }

  const trimmed = nextValue.trim();
  return trimmed.length > 0 ? trimmed : currentValue ?? null;
}

function keepExistingNumber(currentValue: number | null | undefined, nextValue: number | null | undefined) {
  return typeof nextValue === "number" ? nextValue : currentValue ?? null;
}

function mergeObjections(
  currentObjections: LeadObjection[] | null | undefined,
  nextObjections: LeadObjection[] | null | undefined,
) {
  const merged = new Map<string, LeadObjection>();

  for (const objection of currentObjections ?? []) {
    merged.set(`${objection.category}:${objection.evidence ?? ""}`, objection);
  }

  for (const objection of nextObjections ?? []) {
    merged.set(`${objection.category}:${objection.evidence ?? ""}`, objection);
  }

  return Array.from(merged.values());
}

export function mergeLeadUpdate(currentLead: LeadRecord | null | undefined, leadUpdate: LeadUpdate) {
  const current = currentLead ?? {};

  return {
    name: keepExistingText(current.name, leadUpdate.name),
    email: keepExistingText(current.email, leadUpdate.email),
    company: keepExistingText(current.company, leadUpdate.company),
    country: keepExistingText(current.country, leadUpdate.country),
    sector: keepExistingText(current.sector, leadUpdate.sector),
    need: keepExistingText(current.need, leadUpdate.need),
    budget: keepExistingText(current.budget, leadUpdate.budget),
    urgency: keepExistingText(current.urgency, leadUpdate.urgency),
    lead_temperature: keepExistingText(current.lead_temperature, leadUpdate.leadTemperature),
    conversion_score: keepExistingNumber(current.conversion_score, leadUpdate.conversionScore),
    objections: mergeObjections(current.objections, leadUpdate.objections),
    summary: keepExistingText(current.summary, leadUpdate.salesSummary),
    suggested_next_action: keepExistingText(
      current.suggested_next_action,
      leadUpdate.suggestedNextAction,
    ),
  };
}

