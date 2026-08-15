export type DemoConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type DemoConversation = {
  id: string;
  agentId: string;
  agentName: string;
  status: "active" | "completed" | "qualified" | "escalated";
  updatedAt: string;
  messages: DemoConversationMessage[];
};

export const DEMO_CONVERSATIONS_KEY = "guidia-demo-conversations-v1";

export function readDemoConversations(): DemoConversation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DEMO_CONVERSATIONS_KEY) ?? "[]") as DemoConversation[];
  } catch {
    return [];
  }
}

export function appendDemoMessage(session: Omit<DemoConversation, "messages" | "updatedAt" | "status">, message: DemoConversationMessage) {
  const conversations = readDemoConversations();
  const existing = conversations.find((item) => item.id === session.id);
  const updatedAt = message.createdAt;
  const next = existing
    ? conversations.map((item) => item.id === session.id ? { ...item, updatedAt, messages: [...item.messages, message] } : item)
    : [{ ...session, status: "active" as const, updatedAt, messages: [message] }, ...conversations];
  localStorage.setItem(DEMO_CONVERSATIONS_KEY, JSON.stringify(next));
}

export function clearDemoConversations() {
  localStorage.removeItem(DEMO_CONVERSATIONS_KEY);
}

export function updateDemoConversationStatus(id: string, status: DemoConversation["status"]) {
  const next = readDemoConversations().map((conversation) => conversation.id === id ? { ...conversation, status, updatedAt: new Date().toISOString() } : conversation);
  localStorage.setItem(DEMO_CONVERSATIONS_KEY, JSON.stringify(next));
  return next;
}
