export type WebhookEndpoint = {
  id: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
};

export type WebhookDelivery = {
  id: string;
  event_type: string;
  status: "pending" | "delivered" | "failed";
  response_code: number | null;
  response_body: string | null;
  duration_ms: number | null;
  attempt_count: number;
  created_at: string;
};

export const availableWebhookEvents = [
  "lead.created",
  "lead.qualified",
  "conversation.completed",
  "meeting.booked",
  "ticket.created",
];
