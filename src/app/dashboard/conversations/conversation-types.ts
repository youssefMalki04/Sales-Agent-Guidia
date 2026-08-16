export type ConversationRow = {
  id: string;
  lead_id: string | null;
  session_id: string;
  role: "user" | "assistant" | "system";
  message: string;
  created_at: string;
  leads: {
    name: string | null;
    email: string | null;
    company: string | null;
    lead_temperature: string | null;
    conversion_score: number | null;
  } | null;
};

export type ConversationSession = {
  sessionId: string;
  leadId: string | null;
  leadName: string;
  company: string;
  temperature: string;
  score: number;
  messageCount: number;
  lastMessageAt: string;
  messages: ConversationRow[];
};

export type ConversationsPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};
