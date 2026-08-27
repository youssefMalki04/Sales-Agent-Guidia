import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { trackReplayEvent, type ReplayEventType } from "@/lib/replay/track-event";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";

const allowedEvents = new Set<ReplayEventType>(["page_view","chat_opened","chat_closed","message_sent","contact_saved","demo_requested","meeting_booked"]);
function fail(error: unknown, status = 500) { const message = error instanceof Error ? error.message : "Unexpected error"; return Response.json({ error: message, migrationRequired: /replay_sessions|replay_events/i.test(message) && /schema cache|does not exist|relation/i.test(message) }, { status }); }

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("sessionId");
    if (id) {
      const [session, events] = await Promise.all([supabaseAdmin.from("replay_sessions").select("*").eq("session_id", id).single(), supabaseAdmin.from("replay_events").select("*").eq("session_id", id).order("created_at")]);
      if (session.error) throw new Error(session.error.message); if (events.error) throw new Error(events.error.message);
      return Response.json({ session: session.data, events: events.data ?? [] });
    }
    const { data, error } = await supabaseAdmin.from("replay_sessions").select("*").order("last_seen_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = (data ?? []).map((item) => item.session_id);
    const events = ids.length ? await supabaseAdmin.from("replay_events").select("session_id,event_type,created_at").in("session_id", ids) : { data: [], error: null };
    if (events.error) throw new Error(events.error.message);
    return Response.json({ sessions: data ?? [], events: events.data ?? [] });
  } catch (error) { return fail(error, 502); }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string; eventType?: ReplayEventType; pagePath?: string };
    if (!body.sessionId || !body.eventType || !allowedEvents.has(body.eventType)) return fail(new Error("Invalid replay event"), 400);
    const previous = body.eventType === "chat_closed" ? await supabaseAdmin.from("replay_sessions").select("status").eq("session_id", body.sessionId).maybeSingle() : null;
    const replayEvent = { sessionId: body.sessionId, eventType: body.eventType, pagePath: body.pagePath?.slice(0, 500) };
    try {
      await trackReplayEvent(replayEvent);
    } catch (error) {
      if (!isTemporaryFetchFailure(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 300));
      await trackReplayEvent(replayEvent);
    }
    if (body.eventType === "chat_closed" && previous?.data?.status !== "completed") await dispatchWebhook("conversation.completed", { sessionId: body.sessionId, pagePath: body.pagePath ?? null });
    return Response.json({ tracked: true }, { status: 201 });
  } catch (error) { return fail(error, 502); }
}

function isTemporaryFetchFailure(error: unknown) {
  return error instanceof Error && /fetch failed|network|econnreset|timeout/i.test(error.message);
}

export async function DELETE(request: Request) {
  try { const id = new URL(request.url).searchParams.get("sessionId"); if (!id) return fail(new Error("Missing session id"), 400); const { error } = await supabaseAdmin.from("replay_sessions").delete().eq("session_id", id); if (error) throw new Error(error.message); return Response.json({ deleted: id }); } catch (error) { return fail(error, 502); }
}
