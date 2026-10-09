import { z } from "zod";
import { safeMeetingUrl } from "@/lib/meetings/video-url";
import { checkMeetingConflict } from "@/lib/meetings/check-conflict";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { createNotification } from "@/lib/notifications/create-notification";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";
import { trackReplayEvent } from "@/lib/replay/track-event";

export const runtime = "nodejs";

const meetingSchema = z.object({
  leadId: z.uuid().optional(),
  videoUrl: z.string().trim().max(2000).refine((value) => !value || Boolean(safeMeetingUrl(value))).optional(),
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
  title: meetingSchema.shape.title.optional(),
  prospect: meetingSchema.shape.prospect.optional(),
  company: meetingSchema.shape.company,
  email: meetingSchema.shape.email,
  owner: z.string().trim().min(1).max(200).optional(),
  notes: meetingSchema.shape.notes,
  videoUrl: meetingSchema.shape.videoUrl,
  leadId: z.uuid().nullable().optional(),
  date: z.iso.date().optional(),
  duration: z.number().int().refine((value) => [15, 30, 45, 60].includes(value)).optional(),
  id: z.uuid(),
  archived: z.boolean().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]).optional(),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
});

export async function GET(request?: Request) {
  const params = request ? new URL(request.url).searchParams : new URLSearchParams();
  const leadId = params.get("leadId");
  if (leadId !== null && !z.uuid().safeParse(leadId).success) return Response.json({ error: "Invalid lead id" }, { status: 400 });
  const filters = z.object({
    from: z.iso.date().optional(), to: z.iso.date().optional(),
    offset: z.coerce.number().int().min(0).max(1000000).default(0),
    limit: z.coerce.number().int().min(1).max(200).default(200),
    archive: z.enum(["active", "archived", "all"]).optional(),
  }).safeParse(Object.fromEntries(params));
  if (!filters.success || (filters.data.from && filters.data.to && filters.data.from > filters.data.to)) return Response.json({ error: "Filtres de rendez-vous invalides." }, { status: 400 });
  const { from, to, offset, limit, archive } = filters.data;
  const withReports = params.get("reports") === "1";
  let query = (withReports ? supabaseAdmin.from("meetings").select("*,lead_notes(count)") : supabaseAdmin.from("meetings").select("*")).order("scheduled_date", { ascending: true }).order("scheduled_time", { ascending: true }).order("id");
  if (leadId) query = query.eq("lead_id", leadId);
  if (from) query = query.gte("scheduled_date", from);
  if (to) query = query.lte("scheduled_date", to);
  if (archive === "active") query = query.is("archived_at", null);
  if (archive === "archived") query = query.not("archived_at", "is", null);
  query = query.range(offset, offset + limit - 1);
  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ meetings: (data ?? []).map(toMeeting), nextOffset: data?.length === limit ? offset + limit : null }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const parsed = meetingSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid meeting", issues: parsed.error.flatten() }, { status: 400 });

  let leadId: string | null = null;
  if (parsed.data.leadId) {
    const { data: lead, error: leadError } = await supabaseAdmin.from("leads").select("id").eq("id", parsed.data.leadId).maybeSingle();
    if (leadError) return Response.json({ error: "Unable to verify lead" }, { status: 500 });
    if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });
    leadId = String(lead.id);
  }
  if (parsed.data.sessionId) {
    const { data } = await supabaseAdmin.from("leads").select("id").eq("session_id", parsed.data.sessionId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (leadId && data?.id !== leadId) return Response.json({ error: "Lead and session do not match" }, { status: 400 });
    leadId = data?.id ?? leadId;
    const { data: duplicate } = await supabaseAdmin.from("meetings").select("*").eq("session_id", parsed.data.sessionId).eq("scheduled_date", parsed.data.date).eq("scheduled_time", parsed.data.time).neq("status", "cancelled").limit(1).maybeSingle();
    if (duplicate) return Response.json({ meeting: toMeeting(duplicate), duplicate: true }, { status: 200 });
  }

  const conflict = await checkMeetingConflict(parsed.data);
  if (conflict) return conflict;
  const { data, error } = await supabaseAdmin.from("meetings").insert({
    company: parsed.data.company || null,
    duration: parsed.data.duration,
    email: parsed.data.email || null,
    lead_id: leadId,
    notes: parsed.data.notes || null,
    ...(parsed.data.videoUrl ? { video_url: safeMeetingUrl(parsed.data.videoUrl) } : {}),
    owner: parsed.data.owner,
    prospect: parsed.data.prospect,
    scheduled_date: parsed.data.date,
    scheduled_time: parsed.data.time,
    session_id: parsed.data.sessionId || null,
    source: parsed.data.source,
    title: parsed.data.title,
  }).select("*").single();
  if (error) return meetingWriteError(error);
  if (leadId && parsed.data.sessionId) {
    await supabaseAdmin.from("leads").update({ pipeline_stage: "meeting" }).eq("id", leadId);
  }
  // The meeting is already committed: a notification failure must not invite a duplicate booking.
  try {
    await createNotification({ eventKey: `meeting:${String(data.id)}`, eventType: "meeting", leadId: leadId ?? undefined, message: `${parsed.data.prospect} booked ${parsed.data.date} at ${parsed.data.time}.`, sessionId: parsed.data.sessionId, severity: "success", title: "New demonstration booked" });
    await dispatchWebhook("meeting.booked", data as Record<string, unknown>);
  } catch (error) { console.error("Meeting saved, notification failed", error); }
  if (parsed.data.sessionId) {
    try { await trackReplayEvent({ sessionId: parsed.data.sessionId, eventType: "meeting_booked", leadId: leadId ?? undefined, metadata: { meetingId: String(data.id) } }); }
    catch (trackingError) { console.error("Replay meeting tracking failed", trackingError); }
  }
  return Response.json({ meeting: toMeeting(data) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid meeting update" }, { status: 400 });
  if (parsed.data.archived === false || ["owner", "date", "time", "duration", "status"].some((key) => key in parsed.data)) {
    const { data: current, error } = await supabaseAdmin.from("meetings").select("id,owner,scheduled_date,scheduled_time,duration,status,archived_at").eq("id", parsed.data.id).maybeSingle();
    if (error) return Response.json({ error: "Impossible de vérifier le rendez-vous." }, { status: 503 });
    if (!current) return Response.json({ error: "Rendez-vous introuvable." }, { status: 404 });
    const archived = parsed.data.archived ?? Boolean(current.archived_at);
    const conflict = archived ? null : await checkMeetingConflict({ id: parsed.data.id, owner: parsed.data.owner ?? current.owner, date: parsed.data.date ?? current.scheduled_date, time: parsed.data.time ?? current.scheduled_time, duration: parsed.data.duration ?? current.duration, status: parsed.data.status ?? current.status });
    if (conflict) return conflict;
  }
  const patch: Record<string, string | number | null> = {};
  if (parsed.data.archived !== undefined) patch.archived_at = parsed.data.archived ? new Date().toISOString() : null;
  if (parsed.data.leadId) {
    const { data: lead, error } = await supabaseAdmin.from("leads").select("id").eq("id", parsed.data.leadId).maybeSingle();
    if (error) return Response.json({ error: "Unable to verify lead" }, { status: 500 });
    if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });
  }
  if (parsed.data.leadId !== undefined) patch.lead_id = parsed.data.leadId;
  if (parsed.data.videoUrl !== undefined) patch.video_url = safeMeetingUrl(parsed.data.videoUrl);
  for (const key of ["title", "prospect", "company", "email", "owner", "notes"] as const) {
    if (parsed.data[key] !== undefined) patch[key] = parsed.data[key]!;
  }
  if (parsed.data.status) patch.status = parsed.data.status;
  if (parsed.data.date) patch.scheduled_date = parsed.data.date;
  if (parsed.data.time) patch.scheduled_time = parsed.data.time;
  if (parsed.data.duration) patch.duration = parsed.data.duration;
  const { data, error } = await supabaseAdmin.from("meetings").update(patch).eq("id", parsed.data.id).select("*").single();
  if (error) return meetingWriteError(error);
  return Response.json({ meeting: toMeeting(data) });
}

async function readJson(request: Request) { try { return await request.json() as unknown; } catch { return null; } }
function toMeeting(row: Record<string, unknown>) { return { id: row.id, archivedAt: row.archived_at ?? null, reportCount: Array.isArray(row.lead_notes) ? Number(row.lead_notes[0]?.count ?? 0) : undefined, leadId: row.lead_id ?? null, videoUrl: safeMeetingUrl(row.video_url), title: row.title, prospect: row.prospect, company: row.company ?? "", email: row.email ?? "", owner: row.owner, date: row.scheduled_date, time: String(row.scheduled_time).slice(0, 5), duration: row.duration, status: row.status, source: row.source, notes: row.notes ?? "" }; }
function meetingWriteError(error: { code?: string; message: string }) {
  return Response.json({ error: error.code === "23P01" ? "Ce créneau vient d’être réservé pour ce responsable. Choisissez un autre horaire." : error.message }, { status: error.code === "23P01" ? 409 : 500 });
}
