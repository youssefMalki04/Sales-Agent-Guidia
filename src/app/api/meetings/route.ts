import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { createNotification } from "@/lib/notifications/create-notification";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";
import { trackReplayEvent } from "@/lib/replay/track-event";

export const runtime = "nodejs";

const meetingSchema = z.object({
  company: z.string().trim().max(500).optional(),
  date: z.iso.date(),
  duration: z.number().int().refine((value) => [15, 30, 45, 60].includes(value)),
  email: z.union([z.email(), z.literal("")]).optional(),
  notes: z.string().trim().max(2000).optional(),
  owner: z.string().trim().min(1).max(200).default("Yosra"),
  prospect: z.string().trim().min(1).max(500),
  sessionId: z.string().trim().max(200).optional(),
  source: z.string().trim().min(1).max(200).default("Manual"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  title: z.string().trim().min(1).max(500),
});

const updateSchema = z.object({
  date: z.iso.date().optional(),
  duration: z.number().int().refine((value) => [15, 30, 45, 60].includes(value)).optional(),
  id: z.uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
});

export async function GET() {
  const { data, error } = await supabaseAdmin.from("meetings").select("*").order("scheduled_date", { ascending: true }).order("scheduled_time", { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ meetings: (data ?? []).map(toMeeting) });
}

export async function POST(request: Request) {
  const parsed = meetingSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid meeting", issues: parsed.error.flatten() }, { status: 400 });

  let leadId: string | null = null;
  if (parsed.data.sessionId) {
    const { data } = await supabaseAdmin.from("leads").select("id").eq("session_id", parsed.data.sessionId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    leadId = data?.id ?? null;
    const { data: duplicate } = await supabaseAdmin.from("meetings").select("*").eq("session_id", parsed.data.sessionId).eq("scheduled_date", parsed.data.date).eq("scheduled_time", parsed.data.time).neq("status", "cancelled").limit(1).maybeSingle();
    if (duplicate) return Response.json({ meeting: toMeeting(duplicate), duplicate: true }, { status: 200 });
  }

  const { data, error } = await supabaseAdmin.from("meetings").insert({
    company: parsed.data.company || null,
    duration: parsed.data.duration,
    email: parsed.data.email || null,
    lead_id: leadId,
    notes: parsed.data.notes || null,
    owner: parsed.data.owner,
    prospect: parsed.data.prospect,
    scheduled_date: parsed.data.date,
    scheduled_time: parsed.data.time,
    session_id: parsed.data.sessionId || null,
    source: parsed.data.source,
    title: parsed.data.title,
  }).select("*").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (leadId) {
    await supabaseAdmin.from("leads").update({ pipeline_stage: "meeting" }).eq("id", leadId);
  }
  await createNotification({ eventKey: `meeting:${String(data.id)}`, eventType: "meeting", leadId: leadId ?? undefined, message: `${parsed.data.prospect} booked ${parsed.data.date} at ${parsed.data.time}.`, sessionId: parsed.data.sessionId, severity: "success", title: "New demonstration booked" });
  await dispatchWebhook("meeting.booked", data as Record<string, unknown>);
  if (parsed.data.sessionId) {
    try { await trackReplayEvent({ sessionId: parsed.data.sessionId, eventType: "meeting_booked", leadId: leadId ?? undefined, metadata: { meetingId: String(data.id) } }); }
    catch (trackingError) { console.error("Replay meeting tracking failed", trackingError); }
  }
  return Response.json({ meeting: toMeeting(data) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid meeting update" }, { status: 400 });
  const patch: Record<string, string | number> = {};
  if (parsed.data.status) patch.status = parsed.data.status;
  if (parsed.data.date) patch.scheduled_date = parsed.data.date;
  if (parsed.data.time) patch.scheduled_time = parsed.data.time;
  if (parsed.data.duration) patch.duration = parsed.data.duration;
  const { data, error } = await supabaseAdmin.from("meetings").update(patch).eq("id", parsed.data.id).select("*").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ meeting: toMeeting(data) });
}

async function readJson(request: Request) { try { return await request.json() as unknown; } catch { return null; } }
function toMeeting(row: Record<string, unknown>) { return { id: row.id, title: row.title, prospect: row.prospect, company: row.company ?? "", email: row.email ?? "", owner: row.owner, date: row.scheduled_date, time: String(row.scheduled_time).slice(0, 5), duration: row.duration, status: row.status, source: row.source, notes: row.notes ?? "" }; }
