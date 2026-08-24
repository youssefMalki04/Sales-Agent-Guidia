import { NextResponse } from "next/server";

import { getAgentBySlug } from "@/lib/agents/get-agent-by-slug";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

/**
 * Config publique d'un agent, pour que la page /embed/[slug] et le
 * widget-loader.js sachent quoi afficher. Ne renvoie JAMAIS `token` ni
 * `allowedDomains` en clair — ces champs restent côté serveur uniquement.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const agent = await getAgentBySlug(slug);

  if (!agent || !agent.active) {
    return NextResponse.json(
      { error: "Agent not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    name: agent.name,
    slug: agent.slug,
    active: agent.active,
  });
}