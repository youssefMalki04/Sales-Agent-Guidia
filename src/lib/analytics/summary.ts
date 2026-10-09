export type AnalyticsLead = { id: string; session_id: string | null; created_at: string; conversion_score: number | null; lead_temperature: string | null; pipeline_stage: string | null };
export function summarizeLeads(leads: AnalyticsLead[], sessionIds: string[]) {
  const sessions = new Set(sessionIds.filter(Boolean));
  const qualified = (lead: AnalyticsLead) => (lead.conversion_score ?? 0) >= 70 || lead.lead_temperature === "hot";
  const converted = new Set(leads.filter((lead) => lead.session_id && sessions.has(lead.session_id)).map((lead) => lead.session_id));
  const sources = [
    { name: "Saisie manuelle", matches: (lead: AnalyticsLead) => Boolean(lead.session_id?.startsWith("manual-")) },
    { name: "Conversation liée", matches: (lead: AnalyticsLead) => Boolean(lead.session_id && !lead.session_id.startsWith("manual-")) },
    { name: "Non renseignée", matches: (lead: AnalyticsLead) => !lead.session_id },
  ].map(({ name, matches }) => {
    const rows = leads.filter(matches);
    return { name, total: rows.length, qualified: rows.filter(qualified).length, won: rows.filter((lead) => lead.pipeline_stage === "won").length };
  });
  return { leads: leads.length, conversations: sessions.size, converted: converted.size,
    conversionRate: sessions.size ? converted.size / sessions.size * 100 : null,
    qualified: leads.filter(qualified).length, won: leads.filter((lead) => lead.pipeline_stage === "won").length, sources };
}
