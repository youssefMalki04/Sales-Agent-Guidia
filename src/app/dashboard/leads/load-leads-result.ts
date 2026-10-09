import type { LeadRow } from "./leads-types";

export async function loadLeadsResult(load: () => Promise<LeadRow[]>): Promise<
  { ok: true; leads: LeadRow[] } | { ok: false }
> {
  try {
    return { ok: true, leads: await load() };
  } catch {
    // A failed request is not an empty result. Never return partial data.
    return { ok: false };
  }
}
