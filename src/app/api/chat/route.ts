import { NextResponse } from "next/server";

import { getAgentBySlug } from "@/lib/agents/get-agent-by-slug";
import { isOriginAllowed } from "@/lib/agents/validate-domain";
import { parseChatRequest } from "@/schemas/chat";

/**
 * STUB temporaire — renvoie une réponse simulée mais réaliste.
 * À remplacer par la rotation AI/RAG : recherche pgvector + appel Gemini.
 * Le contrat d'entrée/sortie (JSON ci-dessous) ne doit pas changer pour
 * que le frontend n'ait rien à modifier une fois l'IA branchée.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseChatRequest(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { sessionId, message, agentSlug } = parsed.data;

  const agent = await getAgentBySlug(agentSlug);

  if (!agent || !agent.active) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const origin = request.headers.get("origin");

  if (!isOriginAllowed(origin, agent.allowedDomains)) {
    console.warn(
      `[api/chat] Rejected request for agent "${agentSlug}" from origin "${origin}"`,
    );
    return NextResponse.json(
      { error: "Origin not allowed for this agent" },
      { status: 403 },
    );
  }

  // TODO(rotation AI/RAG): remplacer ce bloc par recherche RAG + Gemini.
  const reply =
    "Merci pour votre message. Je vais vérifier les informations disponibles " +
    "et vous poser une question pour qualifier votre besoin.";

  return NextResponse.json({
    sessionId,
    reply,
    receivedMessage: message,
  });
}