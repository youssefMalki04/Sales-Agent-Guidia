import { overlapsMeeting, type MeetingSlot } from "./conflicts";

// Suggestions only: users may still enter another hour manually.
export function availableMeetingSlots(date: string, owner: string, duration: number, meetings: MeetingSlot[], excludeId?: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !owner.trim() || ![15, 30, 45, 60].includes(duration)) return [];
  const slots: string[] = [];
  for (let minute = 9 * 60; minute + duration <= 18 * 60; minute += 15) {
    const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
    const start = new Date(`${date}T${time}:00`);
    if (!Number.isFinite(start.getTime()) || start <= now) continue;
    if (!meetings.some((meeting) => overlapsMeeting({ id: excludeId, date, time, duration, owner }, meeting))) slots.push(time);
  }
  return slots;
}
