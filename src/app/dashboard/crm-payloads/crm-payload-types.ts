export type CrmPayload = {
  id: string;
  lead_id: string | null;
  type: string;
  status: "sent" | "failed" | "pending";
  payload: Record<string, unknown> | null;
  response: Record<string, unknown> | null;
  created_at: string;
  leads: { name?: string; email?: string; company?: string } | null;
};

export type CrmPayloadMetrics = {
  today: number;
  delivered: number;
  failed: number;
  successRate: number;
};
