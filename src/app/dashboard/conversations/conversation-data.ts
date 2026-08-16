import { supabaseAdmin } from "@/lib/database/supabase-admin";

import type {
  ConversationRow,
  ConversationSession,
} from "./conversation-types";

export const ROLE_STYLES: Record<ConversationRow["role"], string> = {
  user: "border-blue-200 bg-blue-50 text-blue-700",
  assistant: "border-emerald-200 bg-emerald-50 text-emerald-700",
  system: "border-slate-200 bg-slate-50 text-slate-700",
};

export const TEMPERATURE_STYLES: Record<string, string> = {
  hot: "border-red-200 bg-red-50 text-red-700",
  warm: "border-amber-200 bg-amber-50 text-amber-700",
  cold: "border-slate-200 bg-slate-50 text-slate-700",
};

export function normalizeSearchParam(value: string | undefined) {
  return value?.trim() ?? "";
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getLeadName(message: ConversationRow) {
  return (
    message.leads?.name ||
    message.leads?.email ||
    `Session ${message.session_id.slice(0, 8)}`
  );
}

function getCompany(message: ConversationRow) {
  return message.leads?.company || "Entreprise non renseignee";
}

function groupBySession(messages: ConversationRow[]) {
  const sessions = new Map<string, ConversationSession>();

  for (const message of messages) {
    const current = sessions.get(message.session_id);
    const temperature =
      message.leads?.lead_temperature?.toLowerCase() ?? "cold";
    const score = message.leads?.conversion_score ?? 0;

    if (!current) {
      sessions.set(message.session_id, {
        sessionId: message.session_id,
        leadId: message.lead_id,
        leadName: getLeadName(message),
        company: getCompany(message),
        temperature,
        score,
        messageCount: 1,
        lastMessageAt: message.created_at,
        messages: [message],
      });
      continue;
    }

    current.messageCount += 1;
    current.messages.push(message);

    if (new Date(message.created_at) > new Date(current.lastMessageAt)) {
      current.lastMessageAt = message.created_at;
    }

    if (score > current.score) {
      current.score = score;
      current.temperature = temperature;
    }
  }

  return Array.from(sessions.values())
    .map((session) => ({
      ...session,
      messages: session.messages
        .sort(
          (first, second) =>
            new Date(first.created_at).getTime() -
            new Date(second.created_at).getTime(),
        )
        .slice(-4),
    }))
    .sort(
      (first, second) =>
        new Date(second.lastMessageAt).getTime() -
        new Date(first.lastMessageAt).getTime(),
    );
}

export async function getConversationSessions(query: string) {
  // The dashboard can run as a frontend-only demo. Supabase reads are enabled
  // explicitly once the remote schema and data are ready.
  if (process.env.ENABLE_SUPABASE_DASHBOARD !== "true") {
    return [];
  }

  try {
    let request = supabaseAdmin
      .from("conversations")
      .select(
        "id,lead_id,session_id,role,message,created_at,leads(name,email,company,lead_temperature,conversion_score)",
      )
      .order("created_at", { ascending: false })
      .limit(120);

    if (query) {
      const escapedQuery = query.replaceAll("%", "\\%").replaceAll(",", "\\,");
      request = request.or(
        [
          `session_id.ilike.%${escapedQuery}%`,
          `message.ilike.%${escapedQuery}%`,
        ].join(","),
      );
    }

    const result = await request;

    if (result.error) {
      console.error("Conversations fetch failed", result.error.message);
      return [];
    }

    return groupBySession((result.data ?? []) as unknown as ConversationRow[]);
  } catch (error) {
    console.error(
      "Conversations fetch failed",
      error instanceof Error ? error.message : "Unknown Supabase error",
    );
    return [];
  }
}
