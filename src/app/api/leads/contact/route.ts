import { z } from "zod";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

const schema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(500),
  email: z.union([z.string().trim().email(), z.literal("")]),
  company: z.string().trim().max(500),
});

export async function GET(request: Request) {
  const parsed = z.uuid().safeParse(new URL(request.url).searchParams.get("leadId"));
  if (!parsed.success) return Response.json({ error: "Prospect invalide." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("leads")
    .select("id,name,email,company").eq("id", parsed.data).maybeSingle();
  if (error) return Response.json({ error: "Impossible de charger les coordonnées." }, { status: 503 });
  if (!data) return Response.json({ error: "Prospect introuvable." }, { status: 404 });
  return Response.json({ lead: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Coordonnées invalides." }, { status: 400 });
  const { id, name, email, company } = parsed.data;
  const { data, error } = await supabaseAdmin.from("leads")
    .update({ name, email: email || null, company: company || null })
    .eq("id", id).select("id,name,email,company").single();
  if (error) return Response.json({ error: "Impossible d’enregistrer les coordonnées." }, { status: 500 });
  return Response.json({ lead: data });
}
