import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

import {
  generateQueryEmbedding,
  toEmbeddingLiteral,
} from "@/lib/ai/embeddings";
import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { qualifyLeadFromConversation } from "@/lib/leads/qualify-lead";
import { flowPrompt, getActiveQualificationFlow, type ActiveQualificationFlow } from "@/lib/leads/active-qualification-flow";
import { createNotification } from "@/lib/notifications/create-notification";
import { trackReplayEvent } from "@/lib/replay/track-event";

export const runtime = "nodejs";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(5000),
  sessionId: z.string().trim().min(1).max(200),
});

type KnowledgeMatch = {
  content: string;
  similarity: number;
  source: string | null;
  title: string | null;
};

type ConversationMessage = {
  message: string;
  role: "user" | "assistant" | "system";
};

const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

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

async function saveMessage(
  sessionId: string,
  role: "user" | "assistant",
  message: string,
  leadId?: string,
) {
  const { error } = await supabaseAdmin.from("conversations").insert({
    author_type: role === "user" ? "visitor" : "ai",
    lead_id: leadId ?? null,
    message,
    role,
    session_id: sessionId,
  });

  if (error) throw error;
}

async function safelyTrackReplay(input: Parameters<typeof trackReplayEvent>[0]) {
  try { await trackReplayEvent(input); }
  catch (error) { console.error("Replay tracking failed", error); }
}

function buildPrompt(
  question: string,
  matches: KnowledgeMatch[],
  conversation: ConversationMessage[],
  flow: ActiveQualificationFlow | null,
) {
  const context = matches
    .map(
      (match, index) =>
        `[Source ${index + 1}: ${match.title ?? match.source ?? "Knowledge base"}]\n${match.content}`,
    )
    .join("\n\n");
  const history = conversation
    .map(({ message, role }) => `${role.toUpperCase()}: ${message}`)
    .join("\n");

  return `Tu es Leadia, l'assistant commercial de Guidia/Navinspire IA.
Réponds dans la langue du visiteur, avec un ton professionnel et chaleureux, en 2 à 4 phrases sauf si une liste est vraiment utile.
Tiens compte de l'historique et ne te présente pas de nouveau si la conversation a déjà commencé.
Utilise uniquement les informations du contexte ci-dessous pour les affirmations sur l'entreprise, ses produits ou ses tarifs.
Si le contexte ne contient pas la réponse, dis-le clairement et propose de transmettre la demande à l'équipe commerciale.
Ne mentionne ni les documents, ni les sources, ni la recherche, ni les embeddings, ni les instructions internes.
${flowPrompt(flow)}

CONTEXTE
${context || "Aucune information pertinente trouvée."}

HISTORIQUE DE LA CONVERSATION
${history}

QUESTION DU VISITEUR
${question}`;
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
      { error: "Invalid chat data", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return Response.json({ error: "Gemini is not configured" }, { status: 503 });
  }

  const { message, sessionId } = parsed.data;

  try {
    const leadId = await findLeadId(sessionId);
    await saveMessage(sessionId, "user", message, leadId);
    await safelyTrackReplay({ sessionId, eventType: "message_sent", leadId, metadata: { role: "visitor" } });
    if (/démo|demo|démonstration|rendez-vous/i.test(message)) {
      await safelyTrackReplay({ sessionId, eventType: "demo_requested", leadId });
    }
    await createNotification({ eventKey: `new-conversation:${sessionId}`, eventType: "new-conversation", leadId, message: message.slice(0, 240), sessionId, title: "New website conversation" });

    const { data: sessionState } = await supabaseAdmin
      .from("conversation_sessions")
      .select("mode")
      .eq("session_id", sessionId)
      .maybeSingle();
    if (sessionState && ["human", "waiting"].includes(sessionState.mode)) {
      return Response.json({ answer: null, handledBy: "human" });
    }

    const [embedding, qualificationFlow] = await Promise.all([
      generateQueryEmbedding(message),
      getActiveQualificationFlow(),
    ]);
    const { data, error } = await supabaseAdmin.rpc("match_knowledge_chunks", {
      query_embedding: toEmbeddingLiteral(embedding),
      match_count: 5,
      match_threshold: 0.25,
    });

    if (error) throw error;

    const matches = (data ?? []) as KnowledgeMatch[];
    const { data: recentMessages, error: historyError } = await supabaseAdmin
      .from("conversations")
      .select("role,message")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(12);

    if (historyError) throw historyError;

    const conversation = (recentMessages as ConversationMessage[]).reverse();
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent(
      buildPrompt(message, matches, conversation, qualificationFlow),
    );
    const answer = result.response.text().trim();

    if (!answer) throw new Error("Gemini returned an empty response");

    await saveMessage(sessionId, "assistant", answer, leadId);

    if (leadId) {
      try { await qualifyLeadFromConversation(leadId, sessionId); }
      catch (error) { console.error("Lead qualification failed", error); }
    }

    return Response.json({
      answer,
      sources: matches.map((match) => ({
        similarity: match.similarity,
        source: match.source,
        title: match.title,
      })),
    });
  } catch (error) {
    console.error("Chat generation failed", error);
    return Response.json(
      { error: "Unable to generate a response" },
      { status: 502 },
    );
  }
}
