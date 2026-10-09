import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { matchesFollowUp, type ReminderState } from "./follow-up-filter";

import type { LeadRow, LeadsFilters } from "./leads-types";

export const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Meeting", value: "meeting" },
  { label: "Proposal", value: "proposal" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

export const SOURCE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Agent", value: "agent" },
  { label: "Manual", value: "manual" },
  { label: "Website", value: "website" },
];

export const STATUS_STYLES: Record<string, string> = {
  lost: "border-red-200 bg-red-50 text-red-700",
  meeting: "border-violet-200 bg-violet-50 text-violet-700",
  proposal: "border-amber-200 bg-amber-50 text-amber-700",
  new: "border-indigo-200 bg-indigo-50 text-indigo-700",
  qualified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  won: "border-green-200 bg-green-50 text-green-700",
};

export function normalizeParam(value: string | undefined) {
  return value?.trim() ?? "";
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getLeadName(lead: LeadRow) {
  return lead.name || lead.email || "Visiteur";
}

export function getLeadSource(lead: LeadRow) {
  if (lead.sector) {
    return lead.sector;
  }

  return lead.email ? "Agent" : "Manual";
}

export function getLeadStatus(lead: LeadRow) {
  const pipelineStage = lead.pipeline_stage?.toLowerCase();
  const crmStatus = lead.crm_status?.toLowerCase();
  const score = lead.conversion_score ?? 0;
  const temperature = lead.lead_temperature?.toLowerCase();

  if (
    pipelineStage &&
    ["new", "qualified", "meeting", "proposal", "won", "lost"].includes(
      pipelineStage,
    )
  ) {
    return {
      label: pipelineStage.charAt(0).toUpperCase() + pipelineStage.slice(1),
      value: pipelineStage,
    };
  }

  if (crmStatus === "failed") {
    return { label: "Lost", value: "lost" };
  }

  if (crmStatus === "sent") {
    return { label: "Won", value: "won" };
  }

  if (score >= 70 || temperature === "hot") {
    return { label: "Qualified", value: "qualified" };
  }

  return { label: "New", value: "new" };
}

export function getLeadInitial(lead: LeadRow) {
  return getLeadName(lead).slice(0, 1).toUpperCase();
}

function matchesSource(lead: LeadRow, source: string) {
  if (!source) {
    return true;
  }

  return getLeadSource(lead).toLowerCase() === source;
}

export async function getLeads(filters: LeadsFilters) {
  if (process.env.ENABLE_SUPABASE_DASHBOARD !== "true") return [];
  let request = supabaseAdmin
    .from("leads")
    .select(
      "id,name,email,company,country,sector,need,urgency,lead_temperature,conversion_score,crm_status,pipeline_stage,created_at,summary,suggested_next_action",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (filters.from) {
    request = request.gte("created_at", `${filters.from}T00:00:00.000Z`);
  }

  if (filters.to) {
    request = request.lte("created_at", `${filters.to}T23:59:59.999Z`);
  }

  if (filters.query) {
    const escapedQuery = filters.query
      .replaceAll("%", "\\%")
      .replaceAll(",", "\\,");
    request = request.or(
      [
        `name.ilike.%${escapedQuery}%`,
        `email.ilike.%${escapedQuery}%`,
        `company.ilike.%${escapedQuery}%`,
        `country.ilike.%${escapedQuery}%`,
        `sector.ilike.%${escapedQuery}%`,
        `need.ilike.%${escapedQuery}%`,
      ].join(","),
    );
  }
  if (filters.temperature)
    request = request.eq("lead_temperature", filters.temperature);
  if (filters.country)
    request = request.ilike("country", `%${filters.country}%`);
  if (filters.sector) request = request.ilike("sector", `%${filters.sector}%`);
  if (filters.urgency) request = request.eq("urgency", filters.urgency);
  if (filters.crm) request = request.eq("crm_status", filters.crm);

  const rows: LeadRow[] = [];
  // Read every matching row before applying derived status/source filters.
  // Small batches avoid the API's default maximum response size.
  const batchSize = 100;
  for (let offset = 0; ; offset += batchSize) {
    const result = await request.range(offset, offset + batchSize - 1);
    if (result.error) throw new Error(result.error.message);
    const batch = (result.data ?? []) as LeadRow[];
    rows.push(...batch);
    if (batch.length < batchSize) break;
  }

  const reminders: ReminderState[] = [];
  if (filters.followUp === "none" || filters.followUp === "overdue") {
    for (let start = 0; start < rows.length; start += 100) {
      const ids = rows.slice(start, start + 100).map(lead => lead.id);
      for (let offset = 0; ; offset += 100) {
        const result = await supabaseAdmin.from("follow_up_reminders")
          .select("lead_id,status,due_at").in("lead_id", ids)
          .eq("status", "upcoming").order("id", { ascending: true }).range(offset, offset + 99);
        if (result.error) throw new Error("Unable to load follow-ups. Please try again.");
        const batch = (result.data ?? []) as ReminderState[];
        reminders.push(...batch);
        if (batch.length < 100) break;
      }
    }
  }
  const now = Date.now();
  return rows
    .filter((lead) => {
      const status = getLeadStatus(lead);

      return (
        matchesFollowUp(lead.id, filters.followUp ?? "", reminders, now) &&
        (!filters.status || status.value === filters.status) &&
        matchesSource(lead, filters.source)
      );
    })
    .sort((first, second) => {
      const scoreDiff =
        (second.conversion_score ?? 0) - (first.conversion_score ?? 0);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return (
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime()
      );
    });
}
