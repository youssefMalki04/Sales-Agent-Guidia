import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { retryWebhookDelivery, sendTestWebhook, validateWebhookUrl } from "@/lib/webhooks/dispatch-webhook";

const allowedEvents = new Set(["lead.created","lead.qualified","conversation.completed","meeting.booked","ticket.created"]);
function fail(error: unknown, status = 500) { const message = error instanceof Error ? error.message : "Unexpected error"; return Response.json({ error: message, migrationRequired: /webhook_endpoints|webhook_deliveries/i.test(message) && /schema cache|does not exist|relation/i.test(message) }, { status }); }

export async function GET() {
  try {
    const endpointResult = await supabaseAdmin.from("webhook_endpoints").select("*").order("created_at").limit(1).maybeSingle();
    if (endpointResult.error) throw new Error(endpointResult.error.message);
    const endpoint = endpointResult.data;
    let deliveries: unknown[] = [];
    if (endpoint) { const result = await supabaseAdmin.from("webhook_deliveries").select("id,event_type,status,response_code,response_body,duration_ms,attempt_count,created_at").eq("endpoint_id", endpoint.id).order("created_at", { ascending: false }).limit(50); if (result.error) throw new Error(result.error.message); deliveries = result.data ?? []; }
    return Response.json({ endpoint, deliveries });
  } catch (error) { return fail(error, 502); }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "retry") { const result = await retryWebhookDelivery(String(body.deliveryId ?? "")); return Response.json(result); }
    if (body.action === "test") {
      const { data, error } = await supabaseAdmin.from("webhook_endpoints").select("id,url,secret").eq("id", body.endpointId).single();
      if (error) throw new Error(error.message); return Response.json(await sendTestWebhook(data));
    }
    const url = validateWebhookUrl(String(body.url ?? ""));
    const events = Array.isArray(body.events) ? body.events.filter((item): item is string => typeof item === "string" && allowedEvents.has(item)) : [];
    const { data, error } = await supabaseAdmin.from("webhook_endpoints").insert({ url, events, enabled: body.enabled !== false, secret: `whsec_${randomBytes(24).toString("hex")}` }).select("*").single();
    if (error) throw new Error(error.message); return Response.json({ endpoint: data }, { status: 201 });
  } catch (error) { return fail(error, 502); }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>; const id = String(body.id ?? ""); if (!id) return fail(new Error("Endpoint id is required"), 400);
    const events = Array.isArray(body.events) ? body.events.filter((item): item is string => typeof item === "string" && allowedEvents.has(item)) : [];
    const update = { url: validateWebhookUrl(String(body.url ?? "")), events, enabled: body.enabled !== false };
    const { data, error } = await supabaseAdmin.from("webhook_endpoints").update(update).eq("id", id).select("*").single();
    if (error) throw new Error(error.message); return Response.json({ endpoint: data });
  } catch (error) { return fail(error, 502); }
}

export async function DELETE(request: Request) {
  try { const id = new URL(request.url).searchParams.get("id"); if (!id) return fail(new Error("Endpoint id is required"), 400); const { error } = await supabaseAdmin.from("webhook_endpoints").delete().eq("id", id); if (error) throw new Error(error.message); return Response.json({ deleted: id }); } catch (error) { return fail(error, 502); }
}
