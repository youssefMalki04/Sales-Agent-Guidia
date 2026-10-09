import { safeMeetingUrl } from "./video-url";

type CalendarMeeting = {
  id: string; title: string; date: string; time: string; duration: number;
  prospect: string; company: string; notes: string; videoUrl?: string | null;
  status: string;
  archivedAt?: string | null;
};

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}
function stamp(date: Date) { return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); }
function fold(line: string) {
  const encoder = new TextEncoder();
  let result = "", length = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (length + size > 75) { result += "\r\n "; length = 1; }
    result += character; length += size;
  }
  return result;
}

// Meeting times in the current application are local browser times.
export function meetingCalendarFile(meeting: CalendarMeeting, now = new Date(), reminderMinutes = 0) {
  if (![0, 15, 30, 60].includes(reminderMinutes)) throw new Error("Rappel invalide.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meeting.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(meeting.time) || !Number.isFinite(meeting.duration) || meeting.duration <= 0) throw new Error("Horaire invalide.");
  const start = new Date(`${meeting.date}T${meeting.time}:00`);
  if (!Number.isFinite(start.getTime())) throw new Error("Date invalide.");
  const end = new Date(start.getTime() + meeting.duration * 60000);
  const url = safeMeetingUrl(meeting.videoUrl);
  const description = [`Prospect : ${meeting.prospect}`, meeting.company ? `Entreprise : ${meeting.company}` : "", meeting.notes, url ? `Visioconférence : ${url}` : ""].filter(Boolean).join("\n\n");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Leadia//Meetings//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${encodeURIComponent(meeting.id)}@leadia`, `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(meeting.title)}`, `DESCRIPTION:${escapeText(description)}`,
    `STATUS:${meeting.status === "cancelled" ? "CANCELLED" : meeting.status === "pending" ? "TENTATIVE" : "CONFIRMED"}`,
    ...(url ? [`URL:${url}`, `LOCATION:${escapeText(url)}`] : []),
    ...(reminderMinutes && !meeting.archivedAt && !["cancelled", "completed", "no_show"].includes(meeting.status) ? ["BEGIN:VALARM", `TRIGGER:-PT${reminderMinutes}M`, "ACTION:DISPLAY", `DESCRIPTION:${escapeText(meeting.title)}`, "END:VALARM"] : []),
    "END:VEVENT", "END:VCALENDAR"];
  return lines.map(fold).join("\r\n") + "\r\n";
}
