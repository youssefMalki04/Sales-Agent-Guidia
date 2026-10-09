import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { sendLeadEmail } from "@/lib/notifications/send-email";

export const runtime = "nodejs";

const emailSchema = z.object({
  leadId: z.uuid(),
  meetingId: z.uuid().optional(),
  confirmedPreviousEmailId: z.uuid().optional(),
  expectedEmail: z.string().email().optional(),
  message: z.string().trim().min(1).max(10_000),
  subject: z.string().trim().min(1).max(200),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid email details" }, { status: 400 });
  }

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("id,email,name,company,session_id")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (leadError) {
    return Response.json({ error: leadError.message }, { status: 500 });
  }
  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }
  if (!lead.email) {
    return Response.json(
      { error: "This lead has no email address" },
      { status: 400 },
    );
  }

  if (parsed.data.expectedEmail && parsed.data.expectedEmail !== lead.email) {
    return Response.json({ error: "L’adresse du prospect a changé. Fermez puis rouvrez le rendez-vous avant de préparer un nouvel e-mail." }, { status: 409 });
  }

  if (parsed.data.meetingId) {
    const { data: meeting, error } = await supabaseAdmin.from("meetings")
      .select("id,lead_id").eq("id", parsed.data.meetingId).maybeSingle();
    if (error) return Response.json({ error: "Impossible de vérifier le rendez-vous." }, { status: 503 });
    if (!meeting || meeting.lead_id !== lead.id) return Response.json({ error: "Ce rendez-vous n’est plus associé à ce prospect." }, { status: 409 });
    const { data: previous, error: historyError } = await supabaseAdmin.from("agent_events")
      .select("id,created_at")
      .eq("payload->>meetingId", parsed.data.meetingId)
      .eq("event_type", "lead_email_sent")
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .limit(1).maybeSingle();
    if (historyError) return Response.json({ error: "Impossible de vérifier le dernier envoi. Aucun e-mail envoyé. Réessayez plus tard." }, { status: 503 });
    if (previous && parsed.data.confirmedPreviousEmailId !== previous.id) {
      return Response.json({
        code: "PREVIOUS_EMAIL_CONFIRMATION_REQUIRED",
        error: "Un e-mail a déjà été envoyé pour ce rendez-vous. Confirmez un nouvel envoi.",
        previousEmail: { id: previous.id, sentAt: previous.created_at },
      }, { status: 409 });
    }
  }

  const result = await sendLeadEmail(
    lead.email,
    parsed.data.subject,
    parsed.data.message,
  );

  const { error: historyError } = await supabaseAdmin.from("agent_events").insert({
    event_type:
      result.status === "sent" ? "lead_email_sent" : "lead_email_failed",
    lead_id: lead.id,
    payload: {
      meetingId: parsed.data.meetingId ?? null,
      deliveryStatus: result.status,
      body: parsed.data.message,
      deliveryMessage: result.message,
      recipient: lead.email,
      subject: parsed.data.subject,
    },
  });

  if (result.status !== "sent") {
    return Response.json(
      { error: result.message },
      { status: result.status === "skipped" ? 400 : 502 },
    );
  }

  return Response.json({ message: historyError
    ? `E-mail envoyé à ${lead.email}, mais l’historique n’a pas pu être enregistré. Ne renvoyez pas le message.`
    : `Email sent to ${lead.email}` });
}
