export type Mode = "ai" | "human" | "waiting" | "resolved";
export type Filter = "all" | Mode;

export type Message = {
  id: string;
  author: "visitor" | "ai" | "agent";
  text: string;
  time: string;
};

export type InboxConversation = {
  id: string;
  visitor: string;
  company: string;
  email: string;
  mode: Mode;
  score: number;
  temperature: "hot" | "warm" | "cold";
  owner: string | null;
  unread: number;
  lastActivity: string;
  need: string;
  messages: Message[];
};
