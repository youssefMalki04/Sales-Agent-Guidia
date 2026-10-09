export type TrendPoint = { date: string; conversations: number; leads: number; meetings: number };
type Dated = { created_at: string };
/** UTC day buckets covering [from, to); the first and last days may be partial. */
export function analyticsTrend(from: string, to: string, messages: (Dated & { session_id: string | null })[], leads: Dated[], meetings: Dated[]): TrendPoint[] {
  const start = Date.parse(from), end = Date.parse(to);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];
  const rows = new Map<string, TrendPoint>();
  const sessions = new Map<string, Set<string>>();
  for (let day = Math.floor(start / 86400000) * 86400000; day < end; day += 86400000) {
    const date = new Date(day).toISOString().slice(0, 10);
    rows.set(date, { date, conversations: 0, leads: 0, meetings: 0 });
    sessions.set(date, new Set());
  }
  const bucket = (value: string) => {
    const time = Date.parse(value);
    return Number.isFinite(time) && time >= start && time < end ? new Date(time).toISOString().slice(0, 10) : null;
  };
  for (const message of messages) {
    const day = bucket(message.created_at);
    if (day && message.session_id) sessions.get(day)?.add(message.session_id);
  }
  for (const [items, key] of [[leads, "leads"], [meetings, "meetings"]] as const) {
    for (const item of items) { const day = bucket(item.created_at); const row = day && rows.get(day); if (row) row[key]++; }
  }
  return [...rows.values()].map((row) => ({ ...row, conversations: sessions.get(row.date)!.size }));
}
