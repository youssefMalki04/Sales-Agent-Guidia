import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

function errorResponse(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return Response.json({ error: message, migrationRequired: /qualification_flows/i.test(message) && /schema cache|does not exist|relation/i.test(message) }, { status });
}

function toClient(row: Record<string, unknown>) {
  return { id: row.id, key: row.key, title: row.title, description: row.description, businessGoal: row.business_goal, tags: row.tags, safetyMode: row.safety_mode, active: row.active, entryPageIds: row.entry_page_ids, steps: row.steps, scoring: row.scoring };
}

function toDatabase(body: Record<string, unknown>) {
  return { key: body.key, title: body.title, description: body.description ?? "", business_goal: body.businessGoal ?? "", tags: body.tags ?? [], safety_mode: body.safetyMode ?? "guide", active: body.active ?? true, entry_page_ids: body.entryPageIds ?? [], steps: body.steps ?? [], scoring: body.scoring ?? { coldMax: 34, warmMax: 69 } };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("qualification_flows").select("*").order("created_at");
    if (error) throw new Error(error.message);
    return Response.json({ flows: (data ?? []).map((row) => toClient(row as Record<string, unknown>)) });
  } catch (error) { return errorResponse(error, 502); }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!String(body.key ?? "").trim() || !String(body.title ?? "").trim()) return errorResponse(new Error("Key and title are required"), 400);
    const { data, error } = await supabaseAdmin.from("qualification_flows").insert(toDatabase(body)).select("*").single();
    if (error) throw new Error(error.message);
    return Response.json({ flow: toClient(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) { return errorResponse(error, 502); }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id ?? "");
    if (!id) return errorResponse(new Error("Flow id is required"), 400);
    const { data, error } = await supabaseAdmin.from("qualification_flows").update(toDatabase(body)).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return Response.json({ flow: toClient(data as Record<string, unknown>) });
  } catch (error) { return errorResponse(error, 502); }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return errorResponse(new Error("Flow id is required"), 400);
    const { error } = await supabaseAdmin.from("qualification_flows").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return Response.json({ deleted: id });
  } catch (error) { return errorResponse(error, 502); }
}
