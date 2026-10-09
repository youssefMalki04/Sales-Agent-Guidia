import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

const commentSchema = z.object({
  actorName: z.string().trim().min(1).max(200).default("Leadia team"),
  id: z.uuid(),
  message: z.string().trim().min(1).max(2_000),
});

export async function GET(request: Request) {
  const parsed = z.uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!parsed.success) {
    return Response.json({ error: "Invalid task id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("follow_up_activity")
    .select("id,action,actor_name,message,metadata,created_at")
    .eq("reminder_id", parsed.data)
    .order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({
    activity: (data ?? []).map((item) => ({
      action: item.action,
      actorName: item.actor_name,
      createdAt: item.created_at,
      id: item.id,
      message: item.message,
      metadata: item.metadata,
    })),
  });
}

export async function POST(request: Request) {
  const parsed = commentSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json({ error: "Invalid task comment" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("follow_up_activity")
    .insert({
      action: "commented",
      actor_name: parsed.data.actorName,
      message: parsed.data.message,
      reminder_id: parsed.data.id,
    })
    .select("id,action,actor_name,message,metadata,created_at")
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ activity: data }, { status: 201 });
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
}
