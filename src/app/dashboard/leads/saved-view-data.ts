export type SavedLeadView = { id: string; name: string; query: string };
const keys = ["q", "status", "temperature", "country", "sector", "urgency", "crm", "source", "from", "to", "followUp", "sort", "pageSize"];
export function cleanViewQuery(query: string) {
  const source = new URLSearchParams(query);
  const result = new URLSearchParams();
  for (const key of keys) {
    const value = source.get(key);
    if (value) result.set(key, value.slice(0, 500));
  }
  return result.toString();
}
export function readLeadViews(raw: string | null): SavedLeadView[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Invalid saved views");
  return parsed.filter((item): item is SavedLeadView => !!item && typeof item.id === "string" && typeof item.name === "string" && typeof item.query === "string")
    .slice(0, 20).map(item => ({ id: item.id, name: item.name.slice(0, 60), query: cleanViewQuery(item.query) }));
}
