export type ReminderState = { lead_id: string; status: string; due_at: string };
export function matchesFollowUp(leadId: string, mode: string, reminders: ReminderState[], now: number) {
  const open = reminders.filter(task => task.lead_id === leadId && task.status === "upcoming");
  if (mode === "none") return open.length === 0;
  if (mode === "overdue") return open.some(task => Date.parse(task.due_at) < now);
  return true;
}
