import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { sendConfiguredNotificationEmail } from "./send-email";

type NotificationInput = {
  actionUrl?: string;
  emailRecipients?: string[];
  eventKey?: string;
  eventType: string;
  leadId?: string;
  message: string;
  sessionId?: string;
  severity?: "info" | "success" | "warning" | "error";
  title: string;
  taskId?: string;
};

export async function createNotification(input: NotificationInput) {
  const payload = {
    action_url: input.actionUrl ?? null,
    event_key: input.eventKey ?? null,
    event_type: input.eventType,
    lead_id: input.leadId ?? null,
    message: input.message,
    session_id: input.sessionId ?? null,
    severity: input.severity ?? "info",
    title: input.title,
    task_id: input.taskId ?? null,
  };
  const request = input.eventKey
    ? supabaseAdmin
        .from("notifications")
        .upsert(payload, { onConflict: "event_key", ignoreDuplicates: true })
        .select("id")
    : supabaseAdmin.from("notifications").insert(payload).select("id");
  const { data, error } = await request;
  if (error) {
    console.error("Notification creation failed", error);
    return;
  }

  // An idempotent notification that already existed must not send another email.
  if (input.eventKey && (!data || data.length === 0)) return;

  const delivery = await sendConfiguredNotificationEmail(
    input,
    input.emailRecipients,
  );
  if (delivery.status === "failed") {
    console.error("Notification email failed", delivery.message);
  }
}
