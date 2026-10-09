export type SavedMeetingReport = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
};

export function savedMeetingReports(notes: unknown[]): SavedMeetingReport[] {
  return notes.filter((note): note is SavedMeetingReport => {
    if (!note || typeof note !== "object") return false;
    const entry = note as Partial<SavedMeetingReport>;
    return typeof entry.id === "string" && typeof entry.content === "string"
      && entry.content.startsWith("Compte rendu — ")
      && typeof entry.createdAt === "string" && Number.isFinite(Date.parse(entry.createdAt))
      && typeof entry.authorName === "string";
  }).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id.localeCompare(b.id));
}
