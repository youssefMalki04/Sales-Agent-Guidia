import { z } from "zod";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

export async function GET(request: Request) {
  const id = z.uuid().safeParse(new URL(request.url).searchParams.get("meetingId"));
  if (!id.success) return Response.json({ error: "Rendez-vous invalide." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("meeting_activity")
    .select("id,action,changes,created_at").eq("meeting_id", id.data)
    .order("created_at", { ascending: false }).order("id").limit(50);
  if (error) return Response.json({ error: "Historique indisponible. Vérifiez la migration Meetings." }, { status: 503 });
  return Response.json({ events: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}
