import { Flame, MessageSquareText, UserRoundCheck } from "lucide-react";

export const NOTIFICATION_EVENTS = [
  {
    id: "new-conversation",
    label: "New conversation",
    description: "A visitor starts a new conversation with an agent.",
    icon: MessageSquareText,
  },
  {
    id: "high-intent",
    label: "High intent",
    description: "A lead reaches a high qualification score.",
    icon: Flame,
  },
  {
    id: "takeover-request",
    label: "Takeover request",
    description: "An agent requests help from a human teammate.",
    icon: UserRoundCheck,
  },
] as const;
