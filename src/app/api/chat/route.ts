import { NextResponse } from "next/server";

import { getAgentBySlug } from "@/lib/agents/get-agent-by-slug";
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

  // TODO(rotation AI/RAG): valider agent.allowedDomains contre le header
  // Origin/Referer de la requête avant de répondre, une fois le vrai flux
  // en place (le stub ne le fait pas encore pour rester testable en local).

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