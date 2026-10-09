import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { createNotification } from "@/lib/notifications/create-notification";
import { sameTaskTitle } from "@/lib/follow-ups/task-title";

export const runtime = "nodejs";

const createSchema = z.object({
  assignedTo: z.string().trim().max(200).optional(),
  assignedToEmail: z.union([z.email(), z.literal("")]).optional(),
  dueAt: z.iso.datetime(),
  leadId: z.uuid(),
  meetingId: z.uuid().optional(),
  notes: z.string().trim().max(2_000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  sourceAction: z.string().trim().min(1).max(500).optional(),
  sourceSummaryId: z.uuid().optional(),
  title: z.string().trim().min(1).max(300),
}).refine(
  (value) => Boolean(value.sourceAction) === Boolean(value.sourceSummaryId),
  { message: "Summary and action must be linked together" },
);

const updateSchema = z
  .object({
    dueAt: z.iso.datetime().optional(),
    assignedTo: z.string().trim().max(200).optional(),
    assignedToEmail: z.union([z.email(), z.literal("")]).optional(),
    id: z.uuid(),
    leadId: z.uuid().optional(),
    notes: z.string().trim().max(2_000).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: z.enum(["completed", "upcoming"]).optional(),
    title: z.string().trim().min(1).max(300).optional(),
  })
  .refine(
    (value) =>
      value.dueAt !== undefined ||
      value.assignedTo !== undefined ||
      value.assignedToEmail !== undefined ||
      value.leadId !== undefined ||
      value.notes !== undefined ||
      value.priority !== undefined ||
      value.status !== undefined ||
      value.title !== undefined,
  );

export async function GET(request?: Request) {
  const meetingId = request ? new URL(request.url).searchParams.get("meetingId") : null;
  if (meetingId !== null && !z.uuid().safeParse(meetingId).success) return Response.json({ error: "Invalid meeting id" }, { status: 400 });
  const leadId = request
    ? z.uuid().safeParse(new URL(request.url).searchParams.get("leadId"))
    : null;
  let query = supabaseAdmin
    .from("follow_up_reminders")
    .select(
      "id,lead_id,title,notes,due_at,status,completed_at,created_at,assigned_to,assigned_to_email,priority,source_summary_id,source_action",
    )
    .order("due_at", { ascending: true });
  if (request && new URL(request.url).searchParams.has("leadId")) {
    if (!leadId?.success)
      return Response.json({ error: "Invalid lead id" }, { status: 400 });
    query = query.eq("lead_id", leadId.data);
  }
  if (request && new URL(request.url).searchParams.has("taskId")) {
    const taskId = z.uuid().safeParse(new URL(request.url).searchParams.get("taskId"));
    if (!taskId.success) return Response.json({ error: "Invalid task id" }, { status: 400 });
    query = query.eq("id", taskId.data);
  }
  if (meetingId) query = query.eq("meeting_id", meetingId);
  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const reminders = data ?? [];
  const leadIds = [...new Set(reminders.map((item) => String(item.lead_id)))];
  const { data: leads, error: leadsError } = leadIds.length
    ? await supabaseAdmin
        .from("leads")
        .select("id,name,email,company")
        .in("id", leadIds)
    : { data: [], error: null };
  if (leadsError) {
    return Response.json({ error: leadsError.message }, { status: 500 });
  }

  const leadById = new Map(
    (leads ?? []).map((lead) => [String(lead.id), lead]),
  );
  return Response.json({
    reminders: reminders.map((item) => ({
      completedAt: item.completed_at,
      assignedTo: item.assigned_to,
      assignedToEmail: item.assigned_to_email,
      createdAt: item.created_at,
      dueAt: item.due_at,
      id: item.id,
      lead: leadById.get(String(item.lead_id)) ?? null,
      leadId: item.lead_id,
      notes: item.notes,
      priority: item.priority,
      sourceAction: item.source_action,
      sourceSummaryId: item.source_summary_id,
      status: item.status,
      title: item.title,
    })),
  });
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid follow-up reminder" },
      { status: 400 },
    );
  }
  if (parsed.data.meetingId) {
    const { data: meeting, error } = await supabaseAdmin.from("meetings").select("lead_id").eq("id", parsed.data.meetingId).maybeSingle();
    if (error) return Response.json({ error: "Impossible de vérifier le rendez-vous." }, { status: 503 });
    if (!meeting || meeting.lead_id !== parsed.data.leadId) return Response.json({ error: "Le rendez-vous n’est pas associé à ce prospect." }, { status: 409 });
  }

  // Check every open task for this lead, including overdue tasks and tasks
  // owned by another teammate. Completed tasks do not prevent a new follow-up.
  const pageSize = 200;
  for (let offset = 0; ; offset += pageSize) {
    const existing = await supabaseAdmin
      .from("follow_up_reminders")
      .select("id,title,due_at")
      .eq("lead_id", parsed.data.leadId)
      .eq("status", "upcoming")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (existing.error) {
      return Response.json({ error: "Impossible de vérifier les tâches existantes. Réessayez avant de créer cette tâche." }, { status: 500 });
    }
    const duplicate = (existing.data ?? []).find((task) => sameTaskTitle(task.title, parsed.data.title));
    if (duplicate) {
      return Response.json({
        code: "DUPLICATE_OPEN_TASK",
        error: `Une tâche similaire est déjà en cours pour ce prospect : « ${duplicate.title} ». Consultez-la dans Tasks avant d’en créer une autre.`,
        duplicate: { id: duplicate.id, title: duplicate.title, dueAt: duplicate.due_at },
      }, { status: 409 });
    }
    if ((existing.data ?? []).length < pageSize) break;
  }

  const { data, error } = await supabaseAdmin
    .from("follow_up_reminders")
    .insert({
      assigned_to: parsed.data.assignedTo || null,
      assigned_to_email: parsed.data.assignedToEmail || null,
      due_at: parsed.data.dueAt,
      lead_id: parsed.data.leadId,
      ...(parsed.data.meetingId ? { meeting_id: parsed.data.meetingId } : {}),
      notes: parsed.data.notes || null,
      priority: parsed.data.priority,
      source_action: parsed.data.sourceAction ?? null,
      source_summary_id: parsed.data.sourceSummaryId ?? null,
      title: parsed.data.title,
    })
    .select(
      "id,lead_id,title,notes,due_at,status,completed_at,created_at,assigned_to,assigned_to_email,priority,source_summary_id,source_action",
    )
    .single();

  if (error) {
    if (error.code === "23505")
      return Response.json({ error: "A task already exists for this next action" }, { status: 409 });
    return Response.json({ error: error.message }, { status: 500 });
  }

  await recordActivity({
    action: "created",
    message: parsed.data.assignedTo
      ? `Task created and assigned to ${parsed.data.assignedTo}.`
      : "Task created.",
    reminderId: String(data.id),
  });

  await createNotification({
    eventKey: `follow-up:${String(data.id)}`,
    eventType: "follow-up",
    leadId: parsed.data.leadId,
    message: `${parsed.data.title} · ${new Date(parsed.data.dueAt).toLocaleString("fr-FR")}`,
    severity: "info",
    title: "Follow-up scheduled",
  });

  return Response.json({ reminder: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid follow-up update" },
      { status: 400 },
    );
  }

  const { data: current, error: currentError } = await supabaseAdmin
    .from("follow_up_reminders")
    .select("title,due_at,status,assigned_to,priority")
    .eq("id", parsed.data.id)
    .single();
  if (currentError)
    return Response.json({ error: currentError.message }, { status: 500 });

  const update: Record<string, string | null> = {};
  if (parsed.data.assignedTo !== undefined)
    update.assigned_to = parsed.data.assignedTo || null;
  if (parsed.data.assignedToEmail !== undefined)
    update.assigned_to_email = parsed.data.assignedToEmail || null;
  if (parsed.data.dueAt !== undefined) update.due_at = parsed.data.dueAt;
  if (parsed.data.leadId !== undefined) {
    update.lead_id = parsed.data.leadId;
    update.meeting_id = null;
  }
  if (parsed.data.notes !== undefined) update.notes = parsed.data.notes || null;
  if (parsed.data.priority !== undefined)
    update.priority = parsed.data.priority;
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (parsed.data.status !== undefined) {
    update.status = parsed.data.status;
    update.completed_at =
      parsed.data.status === "completed" ? new Date().toISOString() : null;
  }
  if (parsed.data.dueAt !== undefined || parsed.data.status === "upcoming") {
    update.notified_at = null;
    update.upcoming_notified_at = null;
  }

  const { data, error } = await supabaseAdmin
    .from("follow_up_reminders")
    .update(update)
    .eq("id", parsed.data.id)
    .select("id,status,completed_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const activity = describeUpdate(current, parsed.data);
  await recordActivity({
    action: activity.action,
    message: activity.message,
    reminderId: parsed.data.id,
  });
  return Response.json({ reminder: data });
}

export async function DELETE(request: Request) {
  const parsed = z
    .uuid()
    .safeParse(new URL(request.url).searchParams.get("id"));
  if (!parsed.success) {
    return Response.json({ error: "Invalid follow-up id" }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from("follow_up_reminders")
    .delete()
    .eq("id", parsed.data);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
}

async function recordActivity({
  action,
  message,
  reminderId,
}: {
  action: "created" | "updated" | "completed" | "reopened";
  message: string;
  reminderId: string;
}) {
  await supabaseAdmin.from("follow_up_activity").insert({
    action,
    actor_name: "Yosra Gadhgadhi",
    message,
    reminder_id: reminderId,
  });
}

function describeUpdate(
  current: Record<string, unknown>,
  update: z.infer<typeof updateSchema>,
) {
  if (update.status === "completed")
    return { action: "completed" as const, message: "Task marked as completed." };
  if (update.status === "upcoming")
    return { action: "reopened" as const, message: "Task reopened." };

  const changes: string[] = [];
  if (update.title !== undefined && update.title !== current.title)
    changes.push("title");
  if (update.dueAt !== undefined && update.dueAt !== current.due_at)
    changes.push("due date");
  if (update.priority !== undefined && update.priority !== current.priority)
    changes.push(`priority to ${update.priority}`);
  if (update.assignedTo !== undefined && update.assignedTo !== current.assigned_to)
    changes.push(update.assignedTo ? `owner to ${update.assignedTo}` : "owner to unassigned");
  if (update.notes !== undefined) changes.push("notes");
  if (update.leadId !== undefined) changes.push("lead");

  return {
    action: "updated" as const,
    message: changes.length
      ? `Updated ${changes.join(", ")}.`
      : "Task details updated.",
  };
}
