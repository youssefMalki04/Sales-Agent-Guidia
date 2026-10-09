import { randomUUID } from "node:crypto";

import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

const bucket = "lead-note-attachments";
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "text/plain",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("action") === "download")
    return downloadAttachment(url.searchParams.get("id"));

  const leadId = z.uuid().safeParse(url.searchParams.get("leadId"));
  if (!leadId.success)
    return Response.json({ error: "Invalid lead id" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("lead_note_attachments")
    .select("id,note_id,lead_id,file_name,file_path,mime_type,size_bytes,created_at")
    .eq("lead_id", leadId.data)
    .order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ attachments: (data ?? []).map(toAttachment) });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const leadId = z.uuid().safeParse(form.get("leadId"));
  const noteId = z.uuid().safeParse(form.get("noteId"));
  const file = form.get("file");
  if (!leadId.success || !noteId.success || !(file instanceof File))
    return Response.json({ error: "Invalid attachment" }, { status: 400 });
  if (!file.size || file.size > maxFileSize)
    return Response.json({ error: "File must be smaller than 10 MB" }, { status: 400 });
  if (!allowedTypes.has(file.type))
    return Response.json({ error: "This file type is not supported" }, { status: 400 });

  const { data: note } = await supabaseAdmin
    .from("lead_notes")
    .select("id")
    .eq("id", noteId.data)
    .eq("lead_id", leadId.data)
    .maybeSingle();
  if (!note) return Response.json({ error: "Note not found" }, { status: 404 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "file";
  const filePath = `${leadId.data}/${noteId.data}/${randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, { contentType: file.type, upsert: false });
  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data, error } = await supabaseAdmin
    .from("lead_note_attachments")
    .insert({
      file_name: file.name.slice(0, 255),
      file_path: filePath,
      lead_id: leadId.data,
      mime_type: file.type,
      note_id: noteId.data,
      size_bytes: file.size,
    })
    .select("id,note_id,lead_id,file_name,file_path,mime_type,size_bytes,created_at")
    .single();
  if (error) {
    await supabaseAdmin.storage.from(bucket).remove([filePath]);
    return Response.json({ error: error.message }, { status: 500 });
  }

  await recordAttachmentEvent({
    eventType: "lead_note_attachment_uploaded",
    fileName: String(data.file_name),
    leadId: leadId.data,
    noteId: noteId.data,
  });

  return Response.json({ attachment: toAttachment(data) }, { status: 201 });
}

export async function DELETE(request: Request) {
  const id = z.uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!id.success)
    return Response.json({ error: "Invalid attachment id" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("lead_note_attachments")
    .select("file_path,file_name,lead_id,note_id")
    .eq("id", id.data)
    .maybeSingle();
  if (!data) return Response.json({ error: "Attachment not found" }, { status: 404 });

  const { error: storageError } = await supabaseAdmin.storage
    .from(bucket)
    .remove([String(data.file_path)]);
  if (storageError) return Response.json({ error: storageError.message }, { status: 500 });

  const { error } = await supabaseAdmin
    .from("lead_note_attachments")
    .delete()
    .eq("id", id.data);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  await recordAttachmentEvent({
    eventType: "lead_note_attachment_deleted",
    fileName: String(data.file_name),
    leadId: String(data.lead_id),
    noteId: String(data.note_id),
  });

  return Response.json({ ok: true });
}

function toAttachment(row: Record<string, unknown>) {
  return {
    createdAt: row.created_at,
    fileName: row.file_name,
    id: row.id,
    leadId: row.lead_id,
    mimeType: row.mime_type,
    noteId: row.note_id,
    sizeBytes: Number(row.size_bytes),
    url: `/api/leads/notes/attachments?action=download&id=${String(row.id)}`,
  };
}

async function downloadAttachment(rawId: string | null) {
  const id = z.uuid().safeParse(rawId);
  if (!id.success)
    return Response.json({ error: "Invalid attachment id" }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from("lead_note_attachments")
    .select("file_path,file_name,lead_id,note_id")
    .eq("id", id.data)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "Attachment not found" }, { status: 404 });

  const { data: signed, error: signedError } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(String(data.file_path), 60);
  if (signedError || !signed?.signedUrl)
    return Response.json({ error: signedError?.message ?? "Unable to download file" }, { status: 500 });

  await recordAttachmentEvent({
    eventType: "lead_note_attachment_downloaded",
    fileName: String(data.file_name),
    leadId: String(data.lead_id),
    noteId: String(data.note_id),
  });
  return Response.redirect(signed.signedUrl, 302);
}

async function recordAttachmentEvent(input: {
  eventType: string;
  fileName: string;
  leadId: string;
  noteId: string;
}) {
  const { error } = await supabaseAdmin.from("agent_events").insert({
    event_type: input.eventType,
    lead_id: input.leadId,
    payload: {
      actorName: "Yosra Gadhgadhi",
      fileName: input.fileName,
      noteId: input.noteId,
    },
  });
  if (error) console.error("Attachment activity creation failed", error);
}
