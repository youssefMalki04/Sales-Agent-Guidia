export function meetingReportContent(meeting: { title: string; date: string; time: string }, report: string) {
  if (!report.trim() || report.length > 4000) throw new Error("Compte rendu invalide.");
  const content = `Compte rendu — ${meeting.title}\nRendez-vous du ${meeting.date} à ${meeting.time}\n\n${report.trim()}`;
  if (content.length > 5000) throw new Error("Compte rendu trop long.");
  return content;
}
