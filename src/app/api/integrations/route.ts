import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";
type Service = { id: string; status: "connected" | "disconnected" | "error"; lastSync: string | null; events: number; detail: string; actionHref?: string };
const has = (...names: string[]) => names.some((name) => Boolean(process.env[name]));

async function snapshot() {
  const [leads, endpoint, deliveries, replay, exportsResult] = await Promise.all([
    supabaseAdmin.from("leads").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("webhook_endpoints").select("id,enabled,updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabaseAdmin.from("webhook_deliveries").select("id,status,created_at").order("created_at", { ascending: false }).limit(100),
    supabaseAdmin.from("replay_sessions").select("session_id,last_seen_at").order("last_seen_at", { ascending: false }).limit(1),
    supabaseAdmin.from("crm_exports").select("type,status,created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  const exports = exportsResult.data ?? [];
  const sent = deliveries.data ?? [];
  const lastReplay = replay.data?.[0];
  const crm = (id: string, configured: boolean, detail: string, actionHref?: string): Service => ({
    id, status: configured ? "connected" : "disconnected",
    lastSync: exports.find((item) => item.type === id)?.created_at ?? null,
    events: exports.filter((item) => item.type === id && item.status === "sent").length,
    detail, actionHref,
  });
  const services: Service[] = [
    { id: "supabase", status: leads.error ? "error" : "connected", lastSync: leads.error ? null : new Date().toISOString(), events: leads.count ?? 0, detail: leads.error?.message ?? "Database reachable" },
    { id: "gemini", status: has("GOOGLE_API_KEY", "GEMINI_API_KEY") ? "connected" : "disconnected", lastSync: null, events: 0, detail: has("GOOGLE_API_KEY", "GEMINI_API_KEY") ? "API key configured" : "Add GOOGLE_API_KEY to .env.local" },
    crm("hubspot", has("HUBSPOT_ACCESS_TOKEN"), has("HUBSPOT_ACCESS_TOKEN") ? "Access token configured" : "Add HUBSPOT_ACCESS_TOKEN to .env.local"),
    crm("salesforce", has("SALESFORCE_REFRESH_TOKEN"), has("SALESFORCE_REFRESH_TOKEN") ? "OAuth connection configured" : "Salesforce OAuth is not connected", "/api/crm/salesforce/auth"),
    crm("slack", has("SLACK_WEBHOOK_URL"), has("SLACK_WEBHOOK_URL") ? "Webhook URL configured" : "Add SLACK_WEBHOOK_URL to .env.local"),
    { id: "widget", status: lastReplay ? "connected" : "disconnected", lastSync: lastReplay?.last_seen_at ?? null, events: lastReplay ? 1 : 0, detail: lastReplay ? "Widget activity detected" : "No visitor session detected yet", actionHref: "/dashboard/widget-installation" },
    { id: "webhooks", status: endpoint.error ? "error" : endpoint.data?.enabled ? "connected" : "disconnected", lastSync: sent[0]?.created_at ?? null, events: sent.filter((item) => item.status === "delivered").length, detail: endpoint.error?.message ?? (endpoint.data?.enabled ? "Active signed endpoint" : "No active endpoint"), actionHref: "/dashboard/webhooks" },
  ];
  const activity = [
    ...sent.slice(0, 5).map((item) => ({ id: `wh-${item.id}`, integration: "Webhooks", action: item.status === "delivered" ? "Event delivered" : "Event delivery failed", status: item.status === "delivered" ? "success" : "failed", time: item.created_at })),
    ...exports.slice(0, 5).map((item, index) => ({ id: `crm-${index}-${item.created_at}`, integration: item.type, action: item.status === "sent" ? "CRM synchronization completed" : "CRM synchronization failed", status: item.status === "sent" ? "success" : "failed", time: item.created_at })),
  ].sort((a, b) => Date.parse(b.time) - Date.parse(a.time)).slice(0, 6);
  return { services, activity };
}

export async function GET() {
  try { return Response.json(await snapshot()); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Unable to load integrations" }, { status: 502 }); }
}

export async function POST(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };
    if (id === "supabase") {
      const result = await supabaseAdmin.from("leads").select("id", { head: true });
      if (result.error) throw new Error(result.error.message);
      return Response.json({ ok: true, message: "Supabase is reachable." });
    }
    if (id === "gemini") {
      const key = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
      if (!key) return Response.json({ error: "Gemini API key is not configured." }, { status: 400 });
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Gemini rejected the configured API key.");
      return Response.json({ ok: true, message: "Gemini API is reachable." });
    }
    const current = (await snapshot()).services.find((item) => item.id === id);
    if (!current || current.status !== "connected") return Response.json({ error: current?.detail ?? "Integration is not configured." }, { status: 400 });
    return Response.json({ ok: true, message: current.detail });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Connection test failed" }, { status: 502 }); }
}
