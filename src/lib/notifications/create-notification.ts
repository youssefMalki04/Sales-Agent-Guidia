import { supabaseAdmin } from "@/lib/database/supabase-admin";

type NotificationInput = {
  eventKey?: string;
  eventType: string;
  leadId?: string;
  message: string;
  sessionId?: string;
  severity?: "info" | "success" | "warning" | "error";
  title: string;
};

export async function createNotification(input: NotificationInput) {
  const payload = {
    event_key: input.eventKey ?? null,
    event_type: input.eventType,
    lead_id: input.leadId ?? null,
    message: input.message,
    session_id: input.sessionId ?? null,
    severity: input.severity ?? "info",
    title: input.title,
  };
  const request = input.eventKey
    ? supabaseAdmin.from("notifications").upsert(payload, { onConflict: "event_key", ignoreDuplicates: true })
    : supabaseAdmin.from("notifications").insert(payload);
  const { error } = await request;
  if (error) console.error("Notification creation failed", error);
}
