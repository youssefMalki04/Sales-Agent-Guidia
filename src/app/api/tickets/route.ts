import { createNotification } from "@/lib/notifications/create-notification";
import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";

export const runtime = "nodejs";

function respondError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const migrationRequired = /tickets|ticket_notes/i.test(message) && /schema cache|does not exist|relation/i.test(message);
  return Response.json({ error: message, migrationRequired }, { status });
}

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (id) {
      const [ticketResult, notesResult] = await Promise.all([
        supabaseAdmin.from("tickets").select("*").eq("id", id).single(),
        supabaseAdmin.from("ticket_notes").select("*").eq("ticket_id", id).order("created_at"),
      ]);
      if (ticketResult.error) throw new Error(ticketResult.error.message);
      if (notesResult.error) throw new Error(notesResult.error.message);
      return Response.json({ ticket: ticketResult.data, notes: notesResult.data ?? [] });
    }

    const { data, error } = await supabaseAdmin.from("tickets").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return Response.json({ tickets: data ?? [] });
  } catch (error) { return respondError(error, 502); }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "note") {
      const ticketId = String(body.ticketId ?? "");
      const note = String(body.body ?? "").trim();
      if (!ticketId || !note) return respondError(new Error("Ticket and note are required"), 400);
      const { data, error } = await supabaseAdmin.from("ticket_notes").insert({ ticket_id: ticketId, body: note, author: String(body.author ?? "Support team") }).select("*").single();
      if (error) throw new Error(error.message);
      return Response.json({ note: data }, { status: 201 });
    }

    const subject = String(body.subject ?? "").trim();
    if (!subject) return respondError(new Error("Subject is required"), 400);
    const { data, error } = await supabaseAdmin.from("tickets").insert({
      subject,
      description: String(body.description ?? "").trim(),
      requester_name: String(body.requesterName ?? "Visitor").trim() || "Visitor",
      requester_email: String(body.requesterEmail ?? "").trim() || null,
      priority: body.priority ?? "medium",
      assigned_to: String(body.assignedTo ?? "").trim() || null,
      lead_id: body.leadId || null,
      session_id: String(body.sessionId ?? "").trim() || null,
    }).select("*").single();
    if (error) throw new Error(error.message);
    await createNotification({ eventType: "ticket-created", title: "New support ticket", message: subject, leadId: data.lead_id ?? undefined, sessionId: data.session_id ?? undefined, severity: data.priority === "urgent" ? "error" : "warning" });
    await dispatchWebhook("ticket.created", data as Record<string, unknown>);
    return Response.json({ ticket: data }, { status: 201 });
  } catch (error) { return respondError(error, 502); }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id ?? "");
    if (!id) return respondError(new Error("Ticket id is required"), 400);
    const allowed = ["subject", "description", "status", "priority", "assigned_to", "requester_name", "requester_email", "lead_id", "session_id"];
    const update = Object.fromEntries(allowed.filter((key) => key in body).map((key) => [key, body[key] || null]));
    if (body.status === "resolved" || body.status === "closed") update.resolved_at = new Date().toISOString();
    if (body.status === "open" || body.status === "in_progress") update.resolved_at = null;
    const { data, error } = await supabaseAdmin.from("tickets").update(update).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    if (body.status === "resolved") await createNotification({ eventType: "ticket-resolved", title: "Ticket resolved", message: data.subject, leadId: data.lead_id ?? undefined, sessionId: data.session_id ?? undefined, severity: "success" });
    return Response.json({ ticket: data });
  } catch (error) { return respondError(error, 502); }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return respondError(new Error("Ticket id is required"), 400);
    const { data, error } = await supabaseAdmin.from("tickets").delete().eq("id", id).select("id").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return respondError(new Error("Ticket not found"), 404);
    return Response.json({ deleted: id });
  } catch (error) { return respondError(error, 502); }
}
