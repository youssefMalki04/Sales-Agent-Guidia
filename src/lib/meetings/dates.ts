/** Calendar dates remain wall-clock dates, never converted via UTC for display. */
export function localMeetingDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function addMeetingDays(date: string, days: number) {
  const parsed = new Date(`${date}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || localMeetingDate(parsed) !== date || !Number.isInteger(days)) throw new Error("Date invalide.");
  parsed.setDate(parsed.getDate() + days);
  return localMeetingDate(parsed);
}

export function meetingMonthRange(month: Date) {
  return {
    from: localMeetingDate(new Date(month.getFullYear(), month.getMonth(), 1)),
    to: localMeetingDate(new Date(month.getFullYear(), month.getMonth() + 1, 0)),
  };
}
