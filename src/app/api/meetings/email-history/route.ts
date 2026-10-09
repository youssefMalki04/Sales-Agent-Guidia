import { z } from "zod";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

export async function GET(request: Request) {
  const parsed = z.uuid().safeParse(new URL(request.url).searchParams.get("meetingId"));
  if (!parsed.success) return Response.json({ error: "Rendez-vous invalide." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("agent_events")
    .select("id,created_at,event_type,payload")
    .eq("payload->>meetingId", parsed.data)
    .in("event_type", ["lead_email_sent", "lead_email_failed"])
    .order("created_at", { ascending: false }).limit(50);
  if (error) return Response.json({ error: "Impossible de charger l’historique." }, { status: 503 });
  return Response.json({ emails: (data ?? []).map((event) => ({
    id: event.id,
    createdAt: event.created_at,
    subject: event.payload?.subject ?? "Sans objet",
    recipient: event.payload?.recipient ?? "Destinataire inconnu",
    status: event.event_type === "lead_email_sent" ? "sent" : "failed",
  })) }, { headers: { "Cache-Control": "no-store" } });
}
