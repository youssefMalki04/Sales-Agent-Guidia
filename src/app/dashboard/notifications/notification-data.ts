import {
  CalendarClock,
  Flame,
  MessageSquareText,
  AtSign,
  UserRoundCheck,
} from "lucide-react";

export const NOTIFICATION_EVENTS = [
  {
    id: "note-mention",
    label: "Note mention",
    description: "A teammate mentions you in a commercial note.",
    icon: AtSign,
  },
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
  {
    id: "follow-up-due",
    label: "Follow-up due",
    description: "A scheduled commercial follow-up reaches its due time.",
    icon: CalendarClock,
  },
] as const;
