import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { createNotification } from "@/lib/notifications/create-notification";

export const runtime = "nodejs";

const mentionedMemberSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(200),
});

const createSchema = z.object({
  authorName: z.string().trim().min(1).max(200).default("Leadia team"),
  content: z.string().trim().min(1).max(5_000),
  leadId: z.uuid(),
  meetingId: z.uuid().optional(),
  mentionedMembers: z.array(mentionedMemberSchema).max(20).default([]),
});

const updateSchema = z
  .object({
    content: z.string().trim().min(1).max(5_000).optional(),
    id: z.uuid(),
    expectedContent: z.string().max(5000).optional(),
    mentionedMembers: z.array(mentionedMemberSchema).max(20).optional(),
    pinned: z.boolean().optional(),
  })
  .refine((value) => value.content !== undefined || value.pinned !== undefined);

export async function GET(request: Request) {
  const meetingId = new URL(request.url).searchParams.get("meetingId");
  if (meetingId !== null && !z.uuid().safeParse(meetingId).success)
    return Response.json({ error: "Rendez-vous invalide." }, { status: 400 });
  const parsed = z.uuid().safeParse(new URL(request.url).searchParams.get("leadId"));
  if (!parsed.success)
    return Response.json({ error: "Invalid lead id" }, { status: 400 });

  let query = supabaseAdmin
    .from("lead_notes")
    .select("id,lead_id,author_name,content,pinned,created_at,updated_at")
    .eq("lead_id", parsed.data)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (meetingId !== null) query = query.eq("meeting_id", meetingId);
  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ notes: (data ?? []).map(toNote) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await readJson(request));
  if (!parsed.success)
    return Response.json({ error: "Invalid lead note" }, { status: 400 });
  if (parsed.data.meetingId) {
    const { data: meeting, error } = await supabaseAdmin.from("meetings")
      .select("id,lead_id").eq("id", parsed.data.meetingId).maybeSingle();
    if (error) return Response.json({ error: "Impossible de vérifier le rendez-vous." }, { status: 503 });
    if (!meeting || meeting.lead_id !== parsed.data.leadId)
      return Response.json({ error: "Le rendez-vous n’est pas associé à ce prospect." }, { status: 409 });
  }
  const { data, error } = await supabaseAdmin
    .from("lead_notes")
    .insert({
      author_name: parsed.data.authorName,
      content: parsed.data.content,
      lead_id: parsed.data.leadId,
      ...(parsed.data.meetingId ? { meeting_id: parsed.data.meetingId } : {}),
    })
    .select("id,lead_id,author_name,content,pinned,created_at,updated_at")
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  await notifyMentionedMembers({
    authorName: parsed.data.authorName,
    content: parsed.data.content,
    leadId: parsed.data.leadId,
    members: parsed.data.mentionedMembers,
    noteId: String(data.id),
  });
  return Response.json({ note: toNote(data) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success)
    return Response.json({ error: "Invalid note update" }, { status: 400 });
  const { data: existing } = await supabaseAdmin
    .from("lead_notes")
    .select("author_name,lead_id")
    .eq("id", parsed.data.id)
    .maybeSingle();
  if (!existing) return Response.json({ error: "Note not found" }, { status: 404 });
  const update: Record<string, string | boolean> = { updated_at: new Date().toISOString() };
  if (parsed.data.content !== undefined) update.content = parsed.data.content;
  if (parsed.data.pinned !== undefined) update.pinned = parsed.data.pinned;
  let updateQuery = supabaseAdmin
    .from("lead_notes")
    .update(update)
    .eq("id", parsed.data.id);
  if (parsed.data.expectedContent !== undefined) updateQuery = updateQuery.eq("content", parsed.data.expectedContent);
  const { data, error } = await updateQuery
    .select("id,lead_id,author_name,content,pinned,created_at,updated_at")
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "La note a été modifiée ou supprimée ailleurs. Annulez puis actualisez avant de la modifier à nouveau." }, { status: 409 });
  if (parsed.data.content && parsed.data.mentionedMembers?.length) {
    await notifyMentionedMembers({
      authorName: String(existing.author_name),
      content: parsed.data.content,
      leadId: String(existing.lead_id),
      members: parsed.data.mentionedMembers,
      noteId: parsed.data.id,
    });
  }
  return Response.json({ note: toNote(data) });
}

export async function DELETE(request: Request) {
  const parsed = z.uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!parsed.success)
    return Response.json({ error: "Invalid note id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("lead_notes").delete().eq("id", parsed.data);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

function toNote(row: Record<string, unknown>) {
  return {
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
    id: row.id,
    leadId: row.lead_id,
    pinned: row.pinned,
    updatedAt: row.updated_at,
  };
}

async function readJson(request: Request) {
  try { return (await request.json()) as unknown; } catch { return null; }
}

async function notifyMentionedMembers(input: {
  authorName: string;
  content: string;
  leadId: string;
  members: Array<{ email: string; name: string }>;
  noteId: string;
}) {
  const uniqueMembers = [...new Map(
    input.members.map((member) => [member.email.toLowerCase(), member]),
  ).values()];
  await Promise.all(uniqueMembers.map((member) => createNotification({
    actionUrl: `/dashboard/leads/${input.leadId}`,
    emailRecipients: [member.email],
    eventKey: `note-mention:${input.noteId}:${member.email.toLowerCase()}`,
    eventType: "note-mention",
    leadId: input.leadId,
    message: `${input.authorName}: ${input.content.slice(0, 240)}`,
    severity: "info",
    title: `${member.name}, you were mentioned in a note`,
  })));
}
