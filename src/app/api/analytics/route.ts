import { z } from "zod";
import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { summarizeLeads, type AnalyticsLead } from "@/lib/analytics/summary";
import { analyticsTrend } from "@/lib/analytics/trend";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const parsed = z.enum(["7d", "30d", "90d"]).safeParse(new URL(request.url).searchParams.get("period") ?? "30d");
  if (!parsed.success) return Response.json({ error: "Période invalide." }, { status: 400 });
  const now = new Date();
  const to = now.toISOString();
  const from = new Date(now.getTime() - Number(parsed.data.slice(0, -1)) * 86400000).toISOString();
  try {
    const leads: AnalyticsLead[] = [];
    const sessions: string[] = [];
    const messages: { session_id: string | null; created_at: string }[] = [];
    const meetings: { created_at: string }[] = [];
    // Explicit pagination avoids silently limiting the report to the first 1000 rows.
    for (let offset = 0;; offset += 500) {
      const { data, error } = await supabaseAdmin.from("leads").select("id,session_id,created_at,conversion_score,lead_temperature,pipeline_stage")
        .gte("created_at", from).lt("created_at", to).order("created_at").order("id").range(offset, offset + 499);
      if (error) throw error;
      leads.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    for (let offset = 0;; offset += 500) {
      const { data, error } = await supabaseAdmin.from("conversations").select("session_id,created_at")
        .eq("role", "user").gte("created_at", from).lt("created_at", to).order("created_at").order("id").range(offset, offset + 499);
      if (error) throw error;
      sessions.push(...(data ?? []).map((row) => row.session_id));
      messages.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    for (let offset = 0;; offset += 500) {
      const { data, error } = await supabaseAdmin.from("meetings").select("id,created_at").gte("created_at", from).lt("created_at", to).is("archived_at", null).order("created_at").order("id").range(offset, offset + 499);
      if (error) throw error;
      meetings.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    const overdue = await supabaseAdmin.from("follow_up_reminders").select("id", { count: "exact", head: true }).eq("status", "upcoming").lt("due_at", to);
    if (overdue.error) throw overdue.error;
    return Response.json({ ...summarizeLeads(leads, sessions), meetings: meetings.length, overdue: overdue.count ?? 0, from, to, trend: analyticsTrend(from, to, messages, leads, meetings) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Impossible de charger les statistiques. Réessayez ou vérifiez la connexion à la base." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
