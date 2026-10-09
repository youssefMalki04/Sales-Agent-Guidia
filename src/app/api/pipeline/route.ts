import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";

export const runtime = "nodejs";

const stageSchema = z.enum(["new", "qualified", "meeting", "proposal", "won", "lost"]);
const createSchema = z.object({
  company: z.string().trim().min(1).max(500),
  dealValue: z.number().min(0),
  email: z.email(),
  name: z.string().trim().min(1).max(500),
  owner: z.string().trim().min(1).max(200),
});
const updateSchema = z.object({
  id: z.uuid(),
  stage: stageSchema.optional(),
  dealValue: z.number().min(0).optional(),
  owner: z.string().trim().min(1).max(200).optional(),
  dueDate: z.iso.date().nullable().optional(),
}).refine(({ stage, dealValue, owner, dueDate }) =>
  [stage, dealValue, owner, dueDate].some((value) => value !== undefined));

export async function GET() {
  const { data, error } = await supabaseAdmin.from("leads").select("id,name,email,company,deal_value,conversion_score,lead_temperature,pipeline_stage,owner,due_date,created_at").order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ leads: (data ?? []).map(toPipelineLead) });
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid opportunity", issues: parsed.error.flatten() }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("leads").insert({ company: parsed.data.company, deal_value: parsed.data.dealValue, email: parsed.data.email, lead_temperature: "warm", name: parsed.data.name, owner: parsed.data.owner, pipeline_stage: "new", session_id: `manual-${crypto.randomUUID()}` }).select("id,name,email,company,deal_value,conversion_score,lead_temperature,pipeline_stage,owner,due_date,created_at").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  await dispatchWebhook("lead.created", data as Record<string, unknown>);
  return Response.json({ lead: toPipelineLead(data) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid pipeline update" }, { status: 400 });
  const update: Record<string, unknown> = {};
  if (parsed.data.stage !== undefined) update.pipeline_stage = parsed.data.stage;
  if (parsed.data.dealValue !== undefined) update.deal_value = parsed.data.dealValue;
  if (parsed.data.owner !== undefined) update.owner = parsed.data.owner;
  if (parsed.data.dueDate !== undefined) update.due_date = parsed.data.dueDate;
  const { data, error } = await supabaseAdmin.from("leads").update(update).eq("id", parsed.data.id).select("id,name,email,company,deal_value,conversion_score,lead_temperature,pipeline_stage,owner,due_date,created_at").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ lead: toPipelineLead(data) });
}

async function readJson(request: Request) { try { return await request.json() as unknown; } catch { return null; } }
function toPipelineLead(row: Record<string, unknown>) { return { dueDateValue: row.due_date ?? null, id: row.id, name: row.name || row.email || "Visitor", company: row.company || "Not provided", email: row.email || "", value: Number(row.deal_value || 0), score: Number(row.conversion_score || 0), temperature: row.lead_temperature || "cold", stage: row.pipeline_stage || "new", owner: row.owner || "Yosra", dueDate: row.due_date ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(`${row.due_date}T12:00:00`)) : "No date" }; }
