import { supabaseAdmin } from "@/lib/database/supabase-admin";

export type SalesAgentRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  baseUrl: string | null;
  allowedDomains: string;
  active: boolean;
  token: string;
  createdAt: string;
};

/**
 * Lit un agent par son slug. Utilise le client admin (service_role) car
 * cette fonction tourne uniquement côté serveur (routes API), jamais dans
 * un composant client — le token ne doit jamais atteindre le navigateur
 * tel quel (voir usage dans /api/agents/[slug] qui filtre les champs).
 */
export async function getAgentBySlug(
  slug: string,
): Promise<SalesAgentRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("sales_agents")
    .select("id, name, slug, description, base_url, allowed_domains, active, token, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn("[getAgentBySlug] Supabase error:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    baseUrl: data.base_url,
    allowedDomains: data.allowed_domains,
    active: data.active,
    token: data.token,
    createdAt: data.created_at,
  };
}