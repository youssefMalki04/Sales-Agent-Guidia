import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { createNotification } from "@/lib/notifications/create-notification";

export const runtime = "nodejs";

const modeSchema = z.enum(["ai", "human", "waiting", "resolved"]);
const updateSchema = z.object({ mode: modeSchema, owner: z.string().trim().max(200).nullable().optional(), sessionId: z.string().trim().min(1).max(200) });
const messageSchema = z.object({ message: z.string().trim().min(1).max(5000), sessionId: z.string().trim().min(1).max(200) });

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("sessionId")?.trim();
  let query = supabaseAdmin.from("conversations").select("id,session_id,role,author_type,message,created_at,lead_id,leads(name,email,company,need,conversion_score,lead_temperature)").order("created_at", { ascending: true }).limit(1000);
  if (sessionId) query = query.eq("session_id", sessionId);
  const { data: messages, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  let stateQuery = supabaseAdmin.from("conversation_sessions").select("session_id,mode,owner");
  if (sessionId) stateQuery = stateQuery.eq("session_id", sessionId);
  const { data: states } = await stateQuery;
  const stateMap = new Map((states ?? []).map((state) => [state.session_id, state]));
  const grouped = new Map<string, Record<string, unknown>[] >();
  for (const message of messages ?? []) grouped.set(message.session_id, [...(grouped.get(message.session_id) ?? []), message as unknown as Record<string, unknown>]);
  const conversations = Array.from(grouped.entries()).map(([sessionId, rows]) => toConversation(sessionId, rows, stateMap.get(sessionId))).sort((a, b) => String(b.sortTime).localeCompare(String(a.sortTime)));
  return Response.json({ conversations });
}

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid inbox update" }, { status: 400 });
  const { error } = await supabaseAdmin.from("conversation_sessions").upsert({ mode: parsed.data.mode, owner: parsed.data.owner ?? null, session_id: parsed.data.sessionId }, { onConflict: "session_id" });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (["human", "waiting"].includes(parsed.data.mode)) {
    await createNotification({ eventKey: `takeover:${parsed.data.sessionId}`, eventType: "takeover-request", message: `Conversation ${parsed.data.sessionId} requires human attention.`, sessionId: parsed.data.sessionId, severity: "warning", title: "Human handoff requested" });
  }
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const parsed = messageSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid inbox message" }, { status: 400 });
  const { data: lead } = await supabaseAdmin.from("leads").select("id").eq("session_id", parsed.data.sessionId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabaseAdmin.from("conversations").insert({ author_type: "agent", lead_id: lead?.id ?? null, message: parsed.data.message, role: "assistant", session_id: parsed.data.sessionId }).select("id,created_at").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ message: { author: "agent", id: data.id, text: parsed.data.message, time: formatTime(data.created_at) } }, { status: 201 });
}

async function readJson(request: Request) { try { return await request.json() as unknown; } catch { return null; } }
function formatTime(value: string) { return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
function toConversation(sessionId: string, rows: Record<string, unknown>[], state?: Record<string, unknown>) {
  const last = rows.at(-1)!;
  const relation = Array.isArray(last.leads) ? last.leads[0] : last.leads;
  const lead = (relation && typeof relation === "object" ? relation : {}) as Record<string, unknown>;
  return { id: sessionId, visitor: lead.name || lead.email || "Visitor", company: lead.company || "Not provided", email: lead.email || "Not provided", mode: state?.mode || "ai", score: Number(lead.conversion_score || 0), temperature: lead.lead_temperature || "cold", owner: state?.owner || null, unread: 0, lastActivity: formatTime(last.created_at as string), sortTime: last.created_at, need: lead.need || "Not identified yet", messages: rows.map((row) => ({ id: row.id, author: row.author_type || (row.role === "user" ? "visitor" : "ai"), text: row.message, time: formatTime(row.created_at as string) })) };
}
