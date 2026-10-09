import type { LeadRow } from "./leads-types";
export function normalizeLeadSort(value?: string) {
  return value === "score" || value === "oldest" ? value : "newest";
}
export function sortLeads(leads: LeadRow[], sort: string) {
  return [...leads].sort((a, b) => {
    if (sort === "score") {
      const delta = (b.conversion_score ?? -1) - (a.conversion_score ?? -1);
      if (delta) return delta;
    }
    const delta = (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
    return (sort === "oldest" ? -delta : delta) || a.id.localeCompare(b.id);
  });
}
