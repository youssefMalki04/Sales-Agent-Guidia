import { supabaseAdmin } from "@/lib/database/supabase-admin";

export type ReplayEventType = "page_view" | "chat_opened" | "chat_closed" | "message_sent" | "contact_saved" | "demo_requested" | "meeting_booked";

export async function trackReplayEvent(input: { sessionId: string; eventType: ReplayEventType; pagePath?: string; leadId?: string; metadata?: Record<string, string | number | boolean> }) {
  if (!input.sessionId) return;
  const session = { session_id: input.sessionId, lead_id: input.leadId ?? null, last_page: input.pagePath ?? null, last_seen_at: new Date().toISOString() };
  const { error: sessionError } = await supabaseAdmin.from("replay_sessions").upsert({ ...session, landing_page: input.pagePath ?? null }, { onConflict: "session_id", ignoreDuplicates: true });
  if (sessionError) throw new Error(`Replay session failed: ${sessionError.message}`);
  const { error: updateError } = await supabaseAdmin.from("replay_sessions").update({
    last_page: input.pagePath ?? null,
    last_seen_at: session.last_seen_at,
    ...(input.leadId ? { lead_id: input.leadId } : {}),
    ...(input.eventType === "chat_opened" ? { status: "active" } : {}),
    ...(input.eventType === "chat_closed" ? { status: "completed" } : {}),
  }).eq("session_id", input.sessionId);
  if (updateError) throw new Error(`Replay session update failed: ${updateError.message}`);
  const { error: eventError } = await supabaseAdmin.from("replay_events").insert({ session_id: input.sessionId, event_type: input.eventType, page_path: input.pagePath ?? null, metadata: input.metadata ?? {} });
  if (eventError) throw new Error(`Replay event failed: ${eventError.message}`);
}
