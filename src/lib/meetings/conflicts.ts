export type MeetingSlot = { id?: string; owner: string; date: string; time: string; duration: number; status?: string };
export function overlapsMeeting(candidate: MeetingSlot, existing: MeetingSlot) {
  if (candidate.id && candidate.id === existing.id) return false;
  if ([candidate.status, existing.status].some((status) => status === "cancelled" || status === "completed" || status === "no_show")) return false;
  if (candidate.owner.trim().toLowerCase() !== existing.owner.trim().toLowerCase()) return false;
  const start = (slot: MeetingSlot) => Date.parse(`${slot.date}T${slot.time.slice(0, 5)}:00Z`);
  const a = start(candidate), b = start(existing);
  return a < b + existing.duration * 60000 && b < a + candidate.duration * 60000;
}
