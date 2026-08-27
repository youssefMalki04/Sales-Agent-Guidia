import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { sendLeadToHubSpot } from "@/lib/crm/hubspot";
import { sendLeadToSalesforce } from "@/lib/crm/salesforce";
import { sendLeadToSlack } from "@/lib/crm/slack";
import { sendLeadToGenericWebhook } from "@/lib/crm/webhook";
import type { CrmExportTarget, LeadExportPayload } from "@/lib/crm/types";

export const runtime = "nodejs";

const senders = { hubspot: sendLeadToHubSpot, salesforce: sendLeadToSalesforce, slack: sendLeadToSlack, webhook: sendLeadToGenericWebhook };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("target");
  const status = url.searchParams.get("status");
  let query = supabaseAdmin.from("crm_exports").select("id,lead_id,type,status,payload,response,created_at,leads(name,email,company)").order("created_at", { ascending: false }).limit(100);
  if (target && target !== "all") query = query.eq("type", target);
  if (status && status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 502 });
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayRows = data.filter((item) => Date.parse(item.created_at) >= today.getTime());
  const delivered = data.filter((item) => item.status === "sent").length;
  return Response.json({ payloads: data, metrics: { today: todayRows.length, delivered, failed: data.filter((item) => item.status === "failed").length, successRate: data.length ? Math.round((delivered / data.length) * 1000) / 10 : 0 } });
}

export async function POST(request: Request) {
  try {
    const parsed = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid export id" }, { status: 400 });
    const { data: previous, error } = await supabaseAdmin.from("crm_exports").select("lead_id,type,payload").eq("id", parsed.data.id).single();
    if (error) throw new Error(error.message);
    const target = previous.type as CrmExportTarget;
    const sender = senders[target];
    if (!sender) return Response.json({ error: "Unsupported export target" }, { status: 400 });
    const payload = previous.payload as LeadExportPayload;
    const result = await sender(payload);
    const { data: saved, error: saveError } = await supabaseAdmin.from("crm_exports").insert({ lead_id: previous.lead_id, type: target, status: result.status === "sent" ? "sent" : "failed", payload, response: { message: result.message, data: result.response ?? null, originalStatus: result.status, retryOf: parsed.data.id } }).select("id").single();
    if (saveError) throw new Error(saveError.message);
    return Response.json({ result, id: saved.id }, { status: result.status === "sent" ? 200 : 502 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Retry failed" }, { status: 502 }); }
}
