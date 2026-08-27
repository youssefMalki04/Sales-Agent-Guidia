import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { dispatchWebhook } from "@/lib/webhooks/dispatch-webhook";

export const runtime = "nodejs";

const leadInputSchema = z.object({
  company: z.string().trim().max(500).nullable().optional(),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(500),
  status: z.enum(["new", "qualified", "won", "failed"]),
  summary: z.string().trim().max(2000).nullable().optional(),
});

function statusFields(status: z.infer<typeof leadInputSchema>["status"]) {
  if (status === "won") return { crm_status: "sent" };
  if (status === "failed") return { crm_status: "failed" };
  if (status === "qualified") {
    return {
      crm_status: "not_sent",
      conversion_score: 70,
      lead_temperature: "hot",
    };
  }
  return { crm_status: "not_sent" };
}

async function readInput(request: Request) {
  try {
    return leadInputSchema.safeParse(await request.json());
  } catch {
    return leadInputSchema.safeParse(null);
  }
}

export async function POST(request: Request) {
  const parsed = await readInput(request);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid lead data", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { company, email, name, status, summary } = parsed.data;
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({
      company: company || null,
      email: email || null,
      name,
      session_id: `manual-${crypto.randomUUID()}`,
      summary: summary || null,
      ...statusFields(status),
    })
    .select("*")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  await dispatchWebhook("lead.created", data as Record<string, unknown>);
  return Response.json({ lead: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = await readInput(request);
  if (!parsed.success || !parsed.data.id) {
    return Response.json(
      {
        error: "Invalid lead data",
        issues: parsed.success ? undefined : parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { company, email, id, name, status, summary } = parsed.data;
  const { data, error } = await supabaseAdmin
    .from("leads")
    .update({
      company: company || null,
      email: email || null,
      name,
      summary: summary || null,
      ...statusFields(status),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (status === "qualified") await dispatchWebhook("lead.qualified", data as Record<string, unknown>);
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success)
    return Response.json({ error: "Invalid lead id" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("leads")
    .delete()
    .eq("id", parsedId.data);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
