import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

export type WebhookEvent = "lead.created" | "lead.qualified" | "meeting.booked" | "ticket.created" | "conversation.completed" | "test.ping";

export function validateWebhookUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Only HTTP and HTTPS webhook URLs are accepted");
  const host = url.hostname.toLowerCase();
  const privateIp = isIP(host) > 0 && /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
  if (host === "localhost" || host.endsWith(".local") || privateIp) throw new Error("Private webhook URLs are not accepted");
  return url.toString();
}

async function deliver(endpoint: { id: string; url: string; secret: string }, eventType: WebhookEvent, payload: Record<string, unknown>, existingDeliveryId?: string) {
  const envelope = { id: crypto.randomUUID(), event: eventType, createdAt: new Date().toISOString(), data: payload };
  const body = JSON.stringify(envelope);
  const signature = createHmac("sha256", endpoint.secret).update(body).digest("hex");
  const started = Date.now();
  let code: number | null = null;
  let responseBody = "";
  let status: "delivered" | "failed" = "failed";
  try {
    const response = await fetch(validateWebhookUrl(endpoint.url), { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Leadia-Webhooks/1.0", "X-Leadia-Event": eventType, "X-Leadia-Signature": `sha256=${signature}` }, body, signal: AbortSignal.timeout(10_000) });
    code = response.status; responseBody = (await response.text()).slice(0, 2000); status = response.ok ? "delivered" : "failed";
  } catch (error) { responseBody = error instanceof Error ? error.message : "Delivery failed"; }
  const row = { endpoint_id: endpoint.id, event_type: eventType, payload: envelope, status, response_code: code, response_body: responseBody, duration_ms: Date.now() - started };
  if (existingDeliveryId) {
    const { data: current } = await supabaseAdmin.from("webhook_deliveries").select("attempt_count").eq("id", existingDeliveryId).single();
    await supabaseAdmin.from("webhook_deliveries").update({ ...row, attempt_count: (current?.attempt_count ?? 1) + 1, created_at: new Date().toISOString() }).eq("id", existingDeliveryId);
  } else await supabaseAdmin.from("webhook_deliveries").insert(row);
  return { status, code };
}

export async function dispatchWebhook(eventType: WebhookEvent, payload: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.from("webhook_endpoints").select("id,url,secret,events").eq("enabled", true).contains("events", [eventType]);
  if (error) return;
  await Promise.all((data ?? []).map((endpoint) => deliver(endpoint, eventType, payload)));
}

export async function retryWebhookDelivery(deliveryId: string) {
  const { data, error } = await supabaseAdmin.from("webhook_deliveries").select("id,event_type,payload,endpoint_id,webhook_endpoints(id,url,secret)").eq("id", deliveryId).single();
  if (error || !data) throw new Error(error?.message ?? "Delivery not found");
  const endpointValue = data.webhook_endpoints as unknown as { id: string; url: string; secret: string };
  const original = data.payload as { data?: Record<string, unknown> };
  return deliver(endpointValue, data.event_type as WebhookEvent, original.data ?? {}, data.id);
}

export async function sendTestWebhook(endpoint: { id: string; url: string; secret: string }) {
  return deliver(endpoint, "test.ping", { message: "Leadia webhook test", sentAt: new Date().toISOString() });
}
