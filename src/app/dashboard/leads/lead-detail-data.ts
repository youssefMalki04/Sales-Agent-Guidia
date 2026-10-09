import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { toPipelineStageActivity } from "@/lib/leads/pipeline-stage-history";
import type { LeadObjection } from "@/types/lead";
import type { LeadNote } from "./lead-notes-panel";

export { pipelineStageLabel } from "@/lib/leads/pipeline-stage-history";

export type LeadConversationMessage = {
  created_at: string;
  id: string;
  message: string;
  role: "user" | "assistant" | "system";
};

export type LeadDetail = {
  budget: string | null;
  company: string | null;
  conversion_score: number | null;
  country: string | null;
  created_at: string;
  email: string | null;
  id: string;
  lead_temperature: string | null;
  name: string | null;
  need: string | null;
  objections: unknown;
  pipeline_stage: string | null;
  sector: string | null;
  session_id: string;
  suggested_next_action: string | null;
  summary: string | null;
  updated_at: string;
  urgency: string | null;
};

export type LeadDetailData = {
  activity: LeadActivityItem[];
  conversation: LeadConversationMessage[];
  emailHistory: LeadEmailHistoryItem[];
  followUps: LeadFollowUpItem[];
  lastActivity: string;
  lead: LeadDetail;
  notes: LeadNote[];
  objections: LeadObjection[];
  pipelineStage: string;
  score: number;
  temperature: "cold" | "warm" | "hot";
};

export type LeadActivityItem = {
  description: string;
  id: string;
  kind: "attachment" | "conversation" | "crm" | "email" | "follow-up" | "meeting" | "note" | "pipeline" | "score";
  status: "failed" | "info" | "success";
  timestamp: string;
  title: string;
};

export type LeadFollowUpItem = {
  completedAt: string | null;
  displayStatus: "completed" | "overdue" | "upcoming";
  dueAt: string;
  id: string;
  notes: string | null;
  status: "completed" | "upcoming";
  title: string;
};

export type LeadEmailHistoryItem = {
  body: string | null;
  createdAt: string;
  deliveryMessage: string | null;
  id: string;
  recipient: string | null;
  status: "failed" | "sent";
  subject: string | null;
};

export async function getLeadDetail(
  id: string,
): Promise<LeadDetailData | null> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;

  const lead = data as LeadDetail;
  const { data: messages } = await supabaseAdmin
    .from("conversations")
    .select("id,role,message,created_at")
    .eq("session_id", lead.session_id)
    .order("created_at", { ascending: true });
  const conversation = (messages ?? []) as LeadConversationMessage[];
  const { data: emailEvents } = await supabaseAdmin
    .from("agent_events")
    .select("id,event_type,payload,created_at")
    .eq("lead_id", lead.id)
    .in("event_type", ["lead_email_sent", "lead_email_failed"])
    .order("created_at", { ascending: false });

  const emailHistory = (emailEvents ?? []).map((event) => {
    const payload =
      event.payload && typeof event.payload === "object"
        ? (event.payload as Record<string, unknown>)
        : {};
    return {
      body: typeof payload.body === "string" ? payload.body : null,
      createdAt: String(event.created_at),
      deliveryMessage:
        typeof payload.deliveryMessage === "string"
          ? payload.deliveryMessage
          : typeof payload.message === "string"
            ? payload.message
            : null,
      id: String(event.id),
      recipient:
        typeof payload.recipient === "string" ? payload.recipient : null,
      status: event.event_type === "lead_email_sent" ? "sent" : "failed",
      subject: typeof payload.subject === "string" ? payload.subject : null,
    } satisfies LeadEmailHistoryItem;
  });

  const [
    { data: agentEvents },
    { data: crmExports },
    { data: meetings },
    { data: reminderRows },
    { data: noteRows },
  ] = await Promise.all([
    supabaseAdmin
      .from("agent_events")
      .select("id,event_type,payload,created_at")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("crm_exports")
      .select("id,type,status,response,created_at")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("meetings")
      .select("id,title,status,scheduled_date,scheduled_time,created_at")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("follow_up_reminders")
      .select("id,title,notes,due_at,status,completed_at,created_at")
      .eq("lead_id", lead.id)
      .order("due_at", { ascending: true }),
    supabaseAdmin
      .from("lead_notes")
      .select("id,lead_id,author_name,content,pinned,created_at,updated_at")
      .eq("lead_id", lead.id)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const notes = (noteRows ?? []).map(
    (note) =>
      ({
        authorName: String(note.author_name),
        content: String(note.content),
        createdAt: String(note.created_at),
        id: String(note.id),
        leadId: String(note.lead_id),
        pinned: Boolean(note.pinned),
        updatedAt: String(note.updated_at),
      }) satisfies LeadNote,
  );

  const followUps = (reminderRows ?? []).map(
    (reminder) =>
      ({
        completedAt: reminder.completed_at
          ? String(reminder.completed_at)
          : null,
        displayStatus:
          reminder.status === "completed"
            ? "completed"
            : new Date(String(reminder.due_at)).getTime() < Date.now()
              ? "overdue"
              : "upcoming",
        dueAt: String(reminder.due_at),
        id: String(reminder.id),
        notes: reminder.notes ? String(reminder.notes) : null,
        status: reminder.status === "completed" ? "completed" : "upcoming",
        title: String(reminder.title),
      }) satisfies LeadFollowUpItem,
  );

  const activity: LeadActivityItem[] = [];
  const firstMessage = conversation.at(0);
  if (firstMessage) {
    activity.push({
      description: firstMessage.message.slice(0, 180),
      id: `conversation-${firstMessage.id}`,
      kind: "conversation",
      status: "info",
      timestamp: firstMessage.created_at,
      title: "Conversation started",
    });
  }

  for (const event of agentEvents ?? []) {
    const payload = toRecord(event.payload);
    if (event.event_type === "lead_pipeline_stage_changed") {
      const stageActivity = toPipelineStageActivity({
        id: String(event.id),
        event_type: event.event_type,
        payload: event.payload,
        created_at: String(event.created_at),
      });
      if (stageActivity) activity.push(stageActivity);
    } else if (event.event_type === "lead_score_calculated") {
      activity.push({
        description: `Score ${String(payload.score ?? 0)}/100 · ${String(payload.temperature ?? "cold")}`,
        id: `event-${String(event.id)}`,
        kind: "score",
        status: "success",
        timestamp: String(event.created_at),
        title: "Lead qualification updated",
      });
    } else if (
      ["lead_email_sent", "lead_email_failed"].includes(event.event_type)
    ) {
      activity.push({
        description: `${String(payload.subject ?? "Follow-up email")} · ${String(payload.recipient ?? lead.email ?? "unknown recipient")}`,
        id: `event-${String(event.id)}`,
        kind: "email",
        status: event.event_type === "lead_email_sent" ? "success" : "failed",
        timestamp: String(event.created_at),
        title:
          event.event_type === "lead_email_sent"
            ? "Email sent"
            : "Email failed",
      });
    } else if (event.event_type.startsWith("lead_note_attachment_")) {
      const action = event.event_type.replace("lead_note_attachment_", "");
      activity.push({
        description: `${String(payload.fileName ?? "File")} · ${String(payload.actorName ?? "Leadia team")}`,
        id: `event-${String(event.id)}`,
        kind: "attachment",
        status: action === "deleted" ? "failed" : action === "uploaded" ? "success" : "info",
        timestamp: String(event.created_at),
        title: `Attachment ${action}`,
      });
    } else if (event.event_type === "lead_notes_summary_saved") {
      activity.push({
        description: `${String(payload.actorName ?? "Leadia team")} · ${payload.source === "fallback" ? "automatic fallback" : "AI generated"}`,
        id: `event-${String(event.id)}`,
        kind: "note",
        status: "success",
        timestamp: String(event.created_at),
        title: "Commercial brief saved",
      });
    }
  }

  for (const item of crmExports ?? []) {
    const response = toRecord(item.response);
    activity.push({
      description:
        typeof response.message === "string"
          ? response.message
          : `Lead sent to ${String(item.type)}`,
      id: `crm-${String(item.id)}`,
      kind: "crm",
      status: item.status === "sent" ? "success" : "failed",
      timestamp: String(item.created_at),
      title: `${titleCase(String(item.type))} export ${item.status === "sent" ? "completed" : "failed"}`,
    });
  }

  for (const meeting of meetings ?? []) {
    activity.push({
      description: `${String(meeting.title)} · ${String(meeting.scheduled_date)} at ${String(meeting.scheduled_time).slice(0, 5)}`,
      id: `meeting-${String(meeting.id)}`,
      kind: "meeting",
      status: meeting.status === "cancelled" ? "failed" : "success",
      timestamp: String(meeting.created_at),
      title:
        meeting.status === "cancelled" ? "Meeting cancelled" : "Meeting booked",
    });
  }

  for (const reminder of reminderRows ?? []) {
    activity.push({
      description: `${String(reminder.title)} · due ${formatActivityDate(String(reminder.due_at))}`,
      id: `follow-up-${String(reminder.id)}`,
      kind: "follow-up",
      status: reminder.status === "completed" ? "success" : "info",
      timestamp: String(reminder.completed_at ?? reminder.created_at),
      title:
        reminder.status === "completed"
          ? "Follow-up completed"
          : "Follow-up scheduled",
    });
  }

  for (const note of notes) {
    activity.push({
      description: `${note.authorName}: ${note.content.slice(0, 180)}`,
      id: `note-${note.id}`,
      kind: "note",
      status: "info",
      timestamp: note.createdAt,
      title: note.pinned ? "Pinned commercial note" : "Commercial note added",
    });
  }

  activity.sort(
    (first, second) =>
      new Date(second.timestamp).getTime() -
      new Date(first.timestamp).getTime(),
  );

  const rawTemperature = lead.lead_temperature?.toLowerCase();
  const temperature =
    rawTemperature === "hot" || rawTemperature === "warm"
      ? rawTemperature
      : "cold";

  return {
    activity,
    conversation,
    emailHistory,
    followUps,
    lastActivity: [
      lead.updated_at,
      conversation.at(-1)?.created_at,
      activity.at(0)?.timestamp,
    ]
      .filter((timestamp): timestamp is string => Boolean(timestamp))
      .sort((first, second) => Date.parse(second) - Date.parse(first))[0],
    lead,
    notes,
    objections: (Array.isArray(lead.objections)
      ? lead.objections
      : []) as LeadObjection[],
    pipelineStage: String(lead.pipeline_stage ?? "new"),
    score: lead.conversion_score ?? 0,
    temperature,
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function pipelineStageStyle(value: string) {
  if (value === "won") return "bg-emerald-600";
  if (value === "lost") return "bg-rose-500";
  if (value === "meeting") return "bg-violet-600";
  if (value === "proposal") return "bg-amber-500";
  if (value === "qualified") return "bg-cyan-600";
  return "bg-indigo-600";
}

export function temperatureStyle(value: string) {
  if (value === "hot") return "border-red-200 bg-red-50 text-red-700";
  if (value === "warm") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
