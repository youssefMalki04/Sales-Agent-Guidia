import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { sendTestNotificationEmail } from "@/lib/notifications/send-email";

export const runtime = "nodejs";

const preferencesSchema = z.object({ enabledEvents: z.array(z.string().trim().min(1)).max(20), emails: z.array(z.email()).max(20) });
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.enum(["read", "unread", "archive"]), id: z.uuid() }),
  z.object({ action: z.literal("read-all") }),
  z.object({
    action: z.literal("snooze"),
    id: z.uuid(),
    snoozeUntil: z.iso.datetime(),
    taskId: z.uuid(),
  }),
]);

export async function GET() {
  const [notificationsResult, preferencesResult] = await Promise.all([
    supabaseAdmin.from("notifications").select("*").is("archived_at", null).order("created_at", { ascending: false }).limit(100),
    supabaseAdmin.from("notification_preferences").select("enabled_events,recipient_emails").eq("id", "default").maybeSingle(),
  ]);
  if (notificationsResult.error) return Response.json({ error: notificationsResult.error.message }, { status: 500 });
  return Response.json({ notifications: notificationsResult.data ?? [], preferences: { enabledEvents: preferencesResult.data?.enabled_events ?? [], emails: preferencesResult.data?.recipient_emails ?? [] } });
}

export async function PUT(request: Request) {
  const parsed = preferencesSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid notification preferences" }, { status: 400 });
  const { error } = await supabaseAdmin.from("notification_preferences").upsert({ enabled_events: parsed.data.enabledEvents, id: "default", recipient_emails: parsed.data.emails }, { onConflict: "id" });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function POST() {
  const result = await sendTestNotificationEmail();
  return Response.json(
    result,
    { status: result.status === "sent" ? 200 : result.status === "skipped" ? 400 : 502 },
  );
}

export async function PATCH(request: Request) {
  const parsed = actionSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid notification action" }, { status: 400 });
  const now = new Date().toISOString();

  if (parsed.data.action === "read-all") {
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ read_at: now })
      .is("read_at", null)
      .is("archived_at", null);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "snooze") {
    if (new Date(parsed.data.snoozeUntil).getTime() <= Date.now()) {
      return Response.json({ error: "Snooze date must be in the future" }, { status: 400 });
    }
    const { error: taskError } = await supabaseAdmin
      .from("follow_up_reminders")
      .update({
        due_at: parsed.data.snoozeUntil,
        notified_at: null,
        upcoming_notified_at: null,
      })
      .eq("id", parsed.data.taskId);
    if (taskError) return Response.json({ error: taskError.message }, { status: 500 });
    const { error: activityError } = await supabaseAdmin
      .from("follow_up_activity")
      .insert({
        action: "updated",
        actor_name: "Yosra Gadhgadhi",
        message: `Task snoozed until ${new Date(parsed.data.snoozeUntil).toLocaleString("fr-FR")}.`,
        reminder_id: parsed.data.taskId,
      });
    if (activityError) return Response.json({ error: activityError.message }, { status: 500 });
    const { error: notificationError } = await supabaseAdmin
      .from("notifications")
      .update({ archived_at: now })
      .eq("id", parsed.data.id);
    if (notificationError) return Response.json({ error: notificationError.message }, { status: 500 });
    return Response.json({ ok: true });
  }

  const update = parsed.data.action === "archive" ? { archived_at: now } : { read_at: parsed.data.action === "read" ? now : null };
  const { error } = await supabaseAdmin.from("notifications").update(update).eq("id", parsed.data.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const parsed = z.uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!parsed.success) return Response.json({ error: "Invalid notification id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("notifications").delete().eq("id", parsed.data);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

async function readJson(request: Request) { try { return await request.json() as unknown; } catch { return null; } }
