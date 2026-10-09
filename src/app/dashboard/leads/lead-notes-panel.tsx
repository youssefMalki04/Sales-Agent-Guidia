"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Download,
  FileText,
  History,
  ListChecks,
  LoaderCircle,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Pin,
  Plus,
  Search,
  Save,
  RotateCcw,
  RefreshCw,
  Sparkles,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialMembers, STORAGE_KEY, type TeamMember } from "@/app/dashboard/team/team-data";
import { SummaryActionTaskDialog } from "./summary-action-task-dialog";
import { EditTaskDialog } from "@/app/dashboard/tasks/edit-task-dialog";
import type { FollowUpTask } from "@/app/dashboard/tasks/tasks-workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type LeadNote = {
  authorName: string;
  content: string;
  createdAt: string;
  id: string;
  leadId: string;
  pinned: boolean;
  updatedAt: string;
};

type Notice = { kind: "error" | "success"; text: string };

type NoteAttachment = {
  createdAt: string;
  fileName: string;
  id: string;
  leadId: string;
  mimeType: string;
  noteId: string;
  sizeBytes: number;
  url: string | null;
};

type NotesSummary = {
  documents: string[];
  keyPoints: string[];
  mentionedPeople: string[];
  nextActions: string[];
  overview: string;
  risks: string[];
};

type SavedNotesSummary = {
  createdAt: string;
  createdBy: string;
  id: string;
  source: "ai" | "fallback";
  summary: NotesSummary;
};

type LinkedSummaryTask = FollowUpTask & {
  sourceAction: string | null;
  sourceSummaryId: string | null;
};

export function LeadNotesPanel({
  initialNotes,
  leadId,
}: {
  initialNotes: LeadNote[];
  leadId: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);
  const [summary, setSummary] = useState<NotesSummary | null>(null);
  const [summarySource, setSummarySource] = useState<"ai" | "fallback">("ai");
  const [summarySavedAt, setSummarySavedAt] = useState<string | null>(null);
  const [summarySavedId, setSummarySavedId] = useState<string | null>(null);
  const [savedSummaries, setSavedSummaries] = useState<SavedNotesSummary[]>([]);
  const [showSummaryHistory, setShowSummaryHistory] = useState(false);
  const [selectedSummaryAction, setSelectedSummaryAction] = useState<string | null>(null);
  const [editingLinkedTask, setEditingLinkedTask] = useState<LinkedSummaryTask | null>(null);
  const [summaryDirty, setSummaryDirty] = useState(false);
  const [linkedTasks, setLinkedTasks] = useState<LinkedSummaryTask[]>([]);
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [uploadingNoteId, setUploadingNoteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch(`/api/leads/notes/attachments?leadId=${encodeURIComponent(leadId)}`)
      .then(async (response) => {
        const payload = (await response.json()) as { attachments?: NoteAttachment[]; error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load attachments");
        if (active) setAttachments(payload.attachments ?? []);
      })
      .catch((error: unknown) => {
        if (active) setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to load attachments" });
      });
    return () => { active = false; };
  }, [leadId]);

  useEffect(() => {
    let active = true;
    fetch(`/api/leads/notes/summary?leadId=${encodeURIComponent(leadId)}`)
      .then(async (response) => {
        const payload = (await response.json()) as { error?: string; summaries?: SavedNotesSummary[] };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load saved summary");
        const latest = payload.summaries?.[0];
        if (active) setSavedSummaries(payload.summaries ?? []);
        if (active && latest) {
          setSummary(latest.summary);
          setSummarySource(latest.source);
          setSummarySavedAt(latest.createdAt);
          setSummarySavedId(latest.id);
        }
      })
      .catch((error: unknown) => {
        if (active) setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to load saved summary" });
      });
    return () => { active = false; };
  }, [leadId]);

  useEffect(() => {
    let active = true;
    fetchLinkedTasks(leadId).then((items) => { if (active) setLinkedTasks(items); });
    return () => { active = false; };
  }, [leadId]);

  const visibleNotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    return notes.filter(
      (note) =>
        !term ||
        note.content.toLowerCase().includes(term) ||
        note.authorName.toLowerCase().includes(term),
    );
  }, [notes, query]);

  const summaryOutdated = Boolean(
    summarySavedAt &&
      (summaryDirty ||
        notes.some(
          (note) =>
            new Date(note.updatedAt).getTime() >
            new Date(summarySavedAt).getTime(),
        )),
  );

  async function refreshLinkedTasks() {
    setLinkedTasks(await fetchLinkedTasks(leadId));
  }

  async function toggleLinkedTask(task: LinkedSummaryTask) {
    const nextStatus = task.status === "completed" ? "upcoming" : "completed";
    setLinkedTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status: nextStatus } : item,
      ),
    );
    try {
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({ id: task.id, status: nextStatus }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to update task");
      setNotice({
        kind: "success",
        text: nextStatus === "completed" ? "Task completed" : "Task reopened",
      });
      router.refresh();
    } catch (error) {
      await refreshLinkedTasks();
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Unable to update task",
      });
    }
  }

  async function addNote() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const response = await fetch("/api/leads/notes", {
        body: JSON.stringify({
          authorName: "Yosra Gadhgadhi",
          content,
          leadId,
          mentionedMembers: getMentionedMembers(content),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; note?: LeadNote };
      if (!response.ok || !payload.note) {
        setNotice({ kind: "error", text: payload.error ?? "Unable to save note" });
        return;
      }
      setNotes((current) => [payload.note!, ...current]);
      setContent("");
      if (summarySavedAt) setSummaryDirty(true);
      setNotice({ kind: "success", text: "Note added" });
    } catch {
      setNotice({ kind: "error", text: "Unable to reach the server" });
    } finally {
      setSaving(false);
    }
  }

  async function updateNote(id: string, patch: { content?: string; pinned?: boolean }) {
    const response = await fetch("/api/leads/notes", {
      body: JSON.stringify({
        id,
        ...patch,
        ...(patch.content ? { mentionedMembers: getMentionedMembers(patch.content) } : {}),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    const payload = (await response.json()) as { error?: string; note?: LeadNote };
    if (!response.ok || !payload.note) {
      setNotice({ kind: "error", text: payload.error ?? "Unable to update note" });
      return;
    }
    setNotes((current) =>
      current
        .map((note) => (note.id === id ? payload.note! : note))
        .sort((first, second) => Number(second.pinned) - Number(first.pinned)),
    );
    setEditingId(null);
    if (patch.content && summarySavedAt) setSummaryDirty(true);
    setNotice({ kind: "success", text: "Note updated" });
  }

  async function deleteNote(note: LeadNote) {
    if (!window.confirm("Delete this note?")) return;
    const response = await fetch(`/api/leads/notes?id=${note.id}`, { method: "DELETE" });
    if (!response.ok) {
      setNotice({ kind: "error", text: "Unable to delete note" });
      return;
    }
    setNotes((current) => current.filter((item) => item.id !== note.id));
    if (summarySavedAt) setSummaryDirty(true);
    setNotice({ kind: "success", text: "Note deleted" });
  }

  async function convertToTask(note: LeadNote) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 1);
    dueAt.setHours(9, 0, 0, 0);
    const response = await fetch("/api/follow-ups", {
      body: JSON.stringify({
        assignedTo: "Yosra Gadhgadhi",
        assignedToEmail: "yosra@leadia.ai",
        dueAt: dueAt.toISOString(),
        leadId,
        notes: note.content,
        priority: "medium",
        title: note.content.slice(0, 80),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    setNotice(response.ok
      ? { kind: "success", text: "Task created for tomorrow at 09:00" }
      : { kind: "error", text: "Unable to create task" });
  }

  function chooseAttachment(noteId: string) {
    setSelectedNoteId(noteId);
    fileInputRef.current?.click();
  }

  async function uploadAttachment(file: File | undefined) {
    const noteId = selectedNoteId;
    if (!file || !noteId) return;
    setUploadingNoteId(noteId);
    const form = new FormData();
    form.append("file", file);
    form.append("leadId", leadId);
    form.append("noteId", noteId);
    try {
      const response = await fetch("/api/leads/notes/attachments", { body: form, method: "POST" });
      const payload = (await response.json()) as { attachment?: NoteAttachment; error?: string };
      if (!response.ok || !payload.attachment)
        throw new Error(payload.error ?? "Unable to upload attachment");
      setAttachments((current) => [payload.attachment!, ...current]);
      if (summarySavedAt) setSummaryDirty(true);
      setNotice({ kind: "success", text: "Attachment uploaded" });
      router.refresh();
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to upload attachment" });
    } finally {
      setSelectedNoteId(null);
      setUploadingNoteId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function deleteAttachment(attachment: NoteAttachment) {
    if (!window.confirm(`Delete ${attachment.fileName}?`)) return;
    const response = await fetch(`/api/leads/notes/attachments?id=${attachment.id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setNotice({ kind: "error", text: payload.error ?? "Unable to delete attachment" });
      return;
    }
    setAttachments((current) => current.filter((item) => item.id !== attachment.id));
    if (summarySavedAt) setSummaryDirty(true);
    setNotice({ kind: "success", text: "Attachment deleted" });
    router.refresh();
  }

  async function generateSummary() {
    setGeneratingSummary(true);
    setNotice(null);
    try {
      const response = await fetch("/api/leads/notes/summary", {
        body: JSON.stringify({ leadId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; source?: "ai" | "fallback"; summary?: NotesSummary };
      if (!response.ok || !payload.summary)
        throw new Error(payload.error ?? "Unable to generate summary");
      setSummary(payload.summary);
      setSummarySource(payload.source ?? "ai");
      setSummarySavedAt(null);
      setSummarySavedId(null);
      setSummaryDirty(false);
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to generate summary" });
    } finally {
      setGeneratingSummary(false);
    }
  }

  async function saveSummary() {
    if (!summary) return;
    await persistSummary(summary, summarySource, "Summary saved");
  }

  async function persistSummary(
    summaryToSave: NotesSummary,
    source: "ai" | "fallback",
    successMessage: string,
  ) {
    setSavingSummary(true);
    try {
      const response = await fetch("/api/leads/notes/summary", {
        body: JSON.stringify({ leadId, source, summary: summaryToSave }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const payload = (await response.json()) as { error?: string; savedSummary?: SavedNotesSummary };
      if (!response.ok || !payload.savedSummary)
        throw new Error(payload.error ?? "Unable to save summary");
      setSummary(summaryToSave);
      setSummarySource(source);
      setSummarySavedAt(payload.savedSummary.createdAt);
      setSummarySavedId(payload.savedSummary.id);
      setSummaryDirty(false);
      setSavedSummaries((current) => [payload.savedSummary!, ...current].slice(0, 10));
      setNotice({ kind: "success", text: successMessage });
      router.refresh();
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to save summary" });
    } finally {
      setSavingSummary(false);
    }
  }

  async function restoreSummary(saved: SavedNotesSummary) {
    await persistSummary(saved.summary, saved.source, "Previous version restored and saved");
  }

  async function deleteSavedSummary(saved: SavedNotesSummary) {
    if (!window.confirm("Delete this saved summary version?")) return;
    const response = await fetch(
      `/api/leads/notes/summary?id=${encodeURIComponent(saved.id)}&leadId=${encodeURIComponent(leadId)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setNotice({ kind: "error", text: payload.error ?? "Unable to delete summary" });
      return;
    }
    const remaining = savedSummaries.filter((item) => item.id !== saved.id);
    setSavedSummaries(remaining);
    if (summarySavedAt === saved.createdAt) {
      const latest = remaining[0];
      setSummary(latest?.summary ?? null);
      setSummarySource(latest?.source ?? "ai");
      setSummarySavedAt(latest?.createdAt ?? null);
      setSummarySavedId(latest?.id ?? null);
      setSummaryDirty(false);
    }
    setNotice({ kind: "success", text: "Summary version deleted" });
  }

  async function copySummary() {
    if (!summary) return;
    await navigator.clipboard.writeText(summaryToText(summary));
    setNotice({ kind: "success", text: "Summary copied" });
  }

  async function convertSummaryToTask() {
    if (!summary) return;
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 1);
    dueAt.setHours(9, 0, 0, 0);
    const response = await fetch("/api/follow-ups", {
      body: JSON.stringify({
        assignedTo: "Yosra Gadhgadhi",
        assignedToEmail: "yosra@leadia.ai",
        dueAt: dueAt.toISOString(),
        leadId,
        notes: summaryToText(summary),
        priority: "high",
        title: summary.nextActions[0]?.slice(0, 80) || "Review commercial notes",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    setNotice(response.ok
      ? { kind: "success", text: "Task created for tomorrow at 09:00" }
      : { kind: "error", text: "Unable to create task" });
  }

  return (
    <section id="commercial-notes" className="scroll-mt-24 rounded-[24px] border border-[#e3e5ee] bg-white p-5 shadow-[0_10px_35px_rgba(36,39,73,.045)] sm:p-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,image/png,image/jpeg,image/webp,image/gif"
        onChange={(event) => uploadAttachment(event.target.files?.[0])}
      />
      <div className="flex flex-col gap-3 border-b border-[#eff0f5] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b8e9c]">Team context</p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-bold"><StickyNote className="size-5 text-[#5962dc]" /> Commercial notes</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block sm:w-52">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes…" className="h-9 rounded-xl pl-9" />
          </label>
          <Button type="button" size="sm" variant="outline" onClick={generateSummary} disabled={generatingSummary || notes.length === 0} className="h-9 rounded-xl text-[#5964d6]">
            {generatingSummary ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {generatingSummary ? "Generating…" : summaryOutdated ? "Regenerate" : "AI summary"}
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#e4e6f2] bg-[#fafaff] p-3">
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add a note… Use @name to mention a teammate" className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0" />
        <div className="flex items-center justify-between border-t border-[#e7e8f2] pt-3">
          <p className="text-xs text-slate-400">{content.length}/5000</p>
          <Button size="sm" disabled={saving || !content.trim()} onClick={addNote} className="rounded-lg bg-[#5964d6]"><Plus className="size-4" /> {saving ? "Adding…" : "Add note"}</Button>
        </div>
      </div>
      {notice ? (
        <button
          type="button"
          onClick={() => setNotice(null)}
          className={`mt-3 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold ${
            notice.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.text}<X className="size-3.5" />
        </button>
      ) : null}

      {summary ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-slate-900"><span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50"><Sparkles className="size-4 text-[#5964d6]" /></span> Commercial brief</div>
              {summaryOutdated ? (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-600"><RefreshCw className="size-3" /> Outdated · notes or documents changed</p>
              ) : summarySavedAt ? (
                <p className="mt-1 text-[11px] text-slate-400">Saved {formatDate(summarySavedAt)}</p>
              ) : (
                <p className="mt-1 text-[11px] font-semibold text-amber-600">Not saved yet</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!summarySavedAt ? <Button type="button" size="sm" onClick={saveSummary} disabled={savingSummary} className="h-8 rounded-lg bg-[#5964d6]">
                {savingSummary ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} {savingSummary ? "Saving…" : "Save"}
              </Button> : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button type="button" size="icon-sm" variant="ghost" aria-label="Brief options"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={copySummary}><Copy className="size-4" /> Copy brief</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowSummaryHistory((current) => !current)}><History className="size-4" /> {showSummaryHistory ? "Hide history" : `History (${savedSummaries.length})`}</DropdownMenuItem>
                  <DropdownMenuItem onSelect={convertSummaryToTask}><ListChecks className="size-4" /> Create task from brief</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => setSummary(null)} aria-label="Close summary"><X className="size-4" /></Button>
            </div>
          </div>
          {summaryOutdated ? (
            <button type="button" onClick={generateSummary} disabled={generatingSummary} className="mt-3 flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs font-semibold text-amber-700">
              New information is available. Regenerate this brief.
              {generatingSummary ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </button>
          ) : null}
          <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">{summary.overview}</p>
          <div className="mt-5 border-t border-[#e4e6f5] pt-4">
            <SummaryList
              title="Next actions"
              items={summary.nextActions}
              empty="No action suggested."
              linkedTasks={linkedTasks.filter((task) => task.sourceSummaryId === summarySavedId)}
              onEditTask={setEditingLinkedTask}
              onToggleTask={(task) => void toggleLinkedTask(task)}
              onCreateTask={(action) => {
                if (!summarySavedId) {
                  setNotice({ kind: "error", text: "Save the summary before creating linked tasks" });
                  return;
                }
                setSelectedSummaryAction(action);
              }}
            />
          </div>
          <details className="mt-4 border-t border-[#e4e6f5] pt-3">
            <summary className="cursor-pointer rounded-md py-1 text-sm font-medium text-slate-500 hover:text-[#5964d6] focus-visible:outline-2 focus-visible:outline-indigo-500">More details <span className="ml-2 hidden text-xs font-normal text-slate-400 sm:inline">Key points, risks & contacts</span></summary>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <SummaryList title="Key points" items={summary.keyPoints} empty="No key point identified." />
              <SummaryList title="Risks & objections" items={summary.risks} empty="No risk identified." />
              <SummaryList title="People & documents" items={[...summary.mentionedPeople.map((name) => `@${name}`), ...summary.documents]} empty="No mention or document." />
            </div>
          </details>
          {showSummaryHistory ? (
            <div className="mt-4 border-t border-[#e4e6f5] pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[.12em] text-slate-400">Version history</p>
              {savedSummaries.length ? (
                <div className="mt-2 space-y-2">
                  {savedSummaries.map((saved, index) => (
                    <div key={saved.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:flex-row sm:items-center">
                      <button type="button" onClick={() => { setSummary(saved.summary); setSummarySource(saved.source); setSummarySavedAt(saved.createdAt); setSummarySavedId(saved.id); }} className="min-w-0 flex-1 text-left">
                        <p className="truncate text-xs font-semibold text-slate-700">{index === 0 ? "Latest · " : ""}{saved.summary.overview}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{formatDate(saved.createdAt)} · {saved.createdBy} · {saved.source === "ai" ? "AI" : "Fallback"}</p>
                      </button>
                      <div className="flex shrink-0 gap-1">
                        <Button type="button" size="sm" variant="ghost" onClick={() => restoreSummary(saved)} disabled={savingSummary} className="h-7 rounded-lg px-2 text-xs"><RotateCcw className="size-3" /> Restore</Button>
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => deleteSavedSummary(saved)} aria-label="Delete summary version" className="size-7 text-slate-400 hover:text-red-600"><Trash2 className="size-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="mt-2 text-xs text-slate-400">No saved version yet.</p>}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {visibleNotes.map((note) => (
          <article key={note.id} className={`rounded-2xl border p-4 ${note.pinned ? "border-amber-200 bg-amber-50/40" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[10px] font-bold text-[#5964d6]">YG</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="text-sm font-bold text-slate-800">{note.authorName}</p>{note.pinned ? <Pin className="size-3.5 fill-amber-400 text-amber-500" /> : null}<time className="ml-auto text-xs text-slate-400">{formatDate(note.createdAt)}</time></div>
                {editingId === note.id ? (
                  <div className="mt-3"><Textarea value={editingContent} onChange={(event) => setEditingContent(event.target.value)} className="min-h-20" /><div className="mt-2 flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button><Button size="sm" onClick={() => updateNote(note.id, { content: editingContent })}><Check className="size-3.5" /> Save</Button></div></div>
                ) : <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{highlightMentions(note.content)}</p>}
                {attachments.some((item) => item.noteId === note.id) ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachments.filter((item) => item.noteId === note.id).map((attachment) => (
                      <div key={attachment.id} className="flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                        <FileText className="size-4 shrink-0 text-[#5964d6]" />
                        <span className="max-w-44 truncate font-semibold text-slate-700">{attachment.fileName}</span>
                        <span className="shrink-0 text-slate-400">{formatFileSize(attachment.sizeBytes)}</span>
                        {attachment.url ? <a href={attachment.url} target="_blank" rel="noreferrer" onClick={() => window.setTimeout(() => router.refresh(), 700)} aria-label={`Download ${attachment.fileName}`} className="text-slate-500 hover:text-[#5964d6]"><Download className="size-4" /></a> : null}
                        <button type="button" onClick={() => deleteAttachment(attachment)} aria-label={`Delete ${attachment.fileName}`} className="text-slate-400 hover:text-red-600"><X className="size-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {editingId !== note.id ? (
                  <button type="button" onClick={() => chooseAttachment(note.id)} disabled={uploadingNoteId !== null} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#5964d6] disabled:opacity-50">
                    {uploadingNoteId === note.id ? <LoaderCircle className="size-3.5 animate-spin" /> : <Paperclip className="size-3.5" />}
                    {uploadingNoteId === note.id ? "Uploading…" : "Attach file"}
                  </button>
                ) : null}
              </div>
              <DropdownMenu><DropdownMenuTrigger asChild><Button size="icon-sm" variant="ghost"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => updateNote(note.id, { pinned: !note.pinned })}><Pin className="size-4" /> {note.pinned ? "Unpin" : "Pin note"}</DropdownMenuItem><DropdownMenuItem onSelect={() => { setEditingId(note.id); setEditingContent(note.content); }}><Pencil className="size-4" /> Edit</DropdownMenuItem><DropdownMenuItem onSelect={() => convertToTask(note)}><ListChecks className="size-4" /> Convert to task</DropdownMenuItem><DropdownMenuItem variant="destructive" onSelect={() => deleteNote(note)}><Trash2 className="size-4" /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            </div>
          </article>
        ))}
        {!visibleNotes.length ? <p className="py-8 text-center text-sm text-slate-400">{query ? "No matching notes." : "No commercial notes yet."}</p> : null}
      </div>
      {selectedSummaryAction ? <SummaryActionTaskDialog
        key={selectedSummaryAction}
        action={selectedSummaryAction}
        leadId={leadId}
        summaryId={summarySavedId ?? ""}
        onClose={() => setSelectedSummaryAction(null)}
        onCreated={() => {
          setNotice({ kind: "success", text: "Task created from next action" });
          void fetchLinkedTasks(leadId).then(setLinkedTasks);
          router.refresh();
        }}
      /> : null}
      {editingLinkedTask ? (
        <EditTaskDialog
          key={editingLinkedTask.id}
          open
          task={editingLinkedTask}
          onOpenChange={(open) => { if (!open) setEditingLinkedTask(null); }}
          onUpdated={async () => {
            await refreshLinkedTasks();
            setNotice({ kind: "success", text: "Task updated" });
            router.refresh();
          }}
        />
      ) : null}
    </section>
  );
}

function highlightMentions(content: string) {
  return content.split(/(@[\p{L}\d._-]+)/gu).map((part, index) =>
    part.startsWith("@") ? <span key={`${part}-${index}`} className="rounded bg-indigo-50 px-1 font-semibold text-[#5964d6]">{part}</span> : part,
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SummaryList({
  title,
  items,
  empty,
  onCreateTask,
  onEditTask,
  onToggleTask,
  linkedTasks = [],
}: {
  title: string;
  items: string[];
  empty: string;
  onCreateTask?: (item: string) => void;
  onEditTask?: (task: LinkedSummaryTask) => void;
  onToggleTask?: (task: LinkedSummaryTask) => void;
  linkedTasks?: LinkedSummaryTask[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-slate-400">{title}</p>
      {items.length ? <ul className="mt-2 space-y-2">{items.map((item, index) => {
        const task = linkedTasks.find((candidate) => candidate.sourceAction === item);
        return <li key={`${item}-${index}`} className="rounded-lg px-2 py-3 text-sm leading-6 text-slate-600 transition-colors hover:bg-slate-50"><div className="flex flex-wrap items-start gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-[#5964d6]" /><span className="min-w-0 flex-1 basis-[180px] break-words">{item}</span>{task ? <><span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${task.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>{task.status === "completed" ? "Completed" : "Scheduled"}</span><DropdownMenu><DropdownMenuTrigger asChild><button type="button" aria-label="Manage linked task" className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-[#5964d6]"><MoreHorizontal className="size-4" /></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => onEditTask?.(task)}><Pencil className="size-4" /> Edit task</DropdownMenuItem><DropdownMenuItem onSelect={() => onToggleTask?.(task)}>{task.status === "completed" ? <RotateCcw className="size-4" /> : <Check className="size-4" />}{task.status === "completed" ? "Reopen task" : "Mark completed"}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></> : onCreateTask ? <button type="button" onClick={() => onCreateTask(item)} className="shrink-0 rounded-md border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold text-[#5964d6] transition hover:bg-indigo-50 hover:opacity-100">+ Task</button> : null}</div>{task ? <p className="ml-3 mt-1 text-xs text-slate-500">{formatDate(task.dueAt)} · {task.priority} · {task.assignedTo || "Unassigned"}</p> : null}</li>;
      })}</ul> : <p className="mt-2 text-xs text-slate-400">{empty}</p>}
    </div>
  );
}

function summaryToText(summary: NotesSummary) {
  return [
    summary.overview,
    `Key points:\n${summary.keyPoints.map((item) => `- ${item}`).join("\n")}`,
    `Next actions:\n${summary.nextActions.map((item) => `- ${item}`).join("\n")}`,
    summary.risks.length ? `Risks:\n${summary.risks.map((item) => `- ${item}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");
}

function getMentionedMembers(content: string) {
  let members = initialMembers;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) members = JSON.parse(stored) as TeamMember[];
  } catch {
    // Demo members remain available when local storage is unavailable.
  }

  const normalizedContent = content.toLocaleLowerCase();
  return members
    .filter((member) => member.status === "active")
    .filter((member) => {
      const aliases = new Set([
        member.name,
        ...member.name.split(/\s+/),
        member.email.split("@")[0],
      ]);
      return [...aliases].some((alias) =>
        normalizedContent.includes(`@${alias.toLocaleLowerCase()}`),
      );
    })
    .map(({ email, name }) => ({ email, name }));
}

async function fetchLinkedTasks(leadId: string) {
  try {
    const response = await fetch(`/api/follow-ups?leadId=${encodeURIComponent(leadId)}`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = (await response.json()) as { reminders?: LinkedSummaryTask[] };
    return (payload.reminders ?? []).filter((task) => task.sourceSummaryId && task.sourceAction);
  } catch {
    return [];
  }
}
