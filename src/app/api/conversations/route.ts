import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { qualifyLeadFromConversation } from "@/lib/leads/qualify-lead";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";
import { trackReplayEvent } from "@/lib/replay/track-event";

export const runtime = "nodejs";

const requestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("message"),
    message: z.string().trim().min(1).max(5000),
    role: z.enum(["user", "assistant"]),
    sessionId: z.string().trim().min(1).max(200),
  }),
  z.object({
    action: z.literal("contact"),
    company: z.string().trim().max(500).optional(),
    email: z.string().trim().email(),
    name: z.string().trim().min(1).max(500),
    sessionId: z.string().trim().min(1).max(200),
  }),
]);

async function findLeadId(sessionId: string) {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("id")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.id as string | undefined;
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid conversation data", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    if (parsed.data.action === "message") {
      const leadId = await findLeadId(parsed.data.sessionId);
      const { error } = await supabaseAdmin.from("conversations").insert({
        author_type: parsed.data.role === "user" ? "visitor" : "ai",
        lead_id: leadId ?? null,
        message: parsed.data.message,
        role: parsed.data.role,
        session_id: parsed.data.sessionId,
      });

      if (error) throw error;
      return Response.json({ ok: true }, { status: 201 });
    }

    const existingLeadId = await findLeadId(parsed.data.sessionId);
    let leadId = existingLeadId;
    let created = false;

    if (existingLeadId) {
      const { error } = await supabaseAdmin
        .from("leads")
        .update({
          company: parsed.data.company || null,
          email: parsed.data.email,
          name: parsed.data.name,
        })
        .eq("id", existingLeadId);
      if (error) throw error;
    } else {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert({
          company: parsed.data.company || null,
          email: parsed.data.email,
          name: parsed.data.name,
          session_id: parsed.data.sessionId,
        })
        .select("id")
        .single();
      if (error) throw error;
      leadId = data.id as string;
      created = true;
    }

    const { error: linkError } = await supabaseAdmin
      .from("conversations")
      .update({ lead_id: leadId })
      .eq("session_id", parsed.data.sessionId)
      .is("lead_id", null);
    if (linkError) throw linkError;
    const { error: sessionError } = await supabaseAdmin.from("conversation_sessions").upsert({ session_id: parsed.data.sessionId, lead_id: leadId, mode: "ai" }, { onConflict: "session_id" });
    if (sessionError) console.error("Conversation session linking failed", sessionError);

    if (leadId) {
      try { await trackReplayEvent({ sessionId: parsed.data.sessionId, eventType: "contact_saved", leadId }); }
      catch (error) { console.error("Replay contact tracking failed", error); }
      if (created) await dispatchWebhook("lead.created", { id: leadId, session_id: parsed.data.sessionId, name: parsed.data.name, email: parsed.data.email, company: parsed.data.company ?? null });
      try { await qualifyLeadFromConversation(leadId, parsed.data.sessionId); }
      catch (error) { console.error("Initial lead qualification failed", error); }
    }

    return Response.json({ leadId, ok: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Supabase request failed",
      },
      { status: 500 },
    );
  }
}
