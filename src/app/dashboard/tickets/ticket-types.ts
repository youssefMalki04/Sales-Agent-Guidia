export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  requester_name: string;
  requester_email: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  lead_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
};

export type TicketNote = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

export type TicketForm = {
  subject: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  priority: TicketPriority;
  assignedTo: string;
  leadId: string;
  sessionId: string;
};

export const initialTicketForm: TicketForm = {
  subject: "",
  description: "",
  requesterName: "",
  requesterEmail: "",
  priority: "medium",
  assignedTo: "",
  leadId: "",
  sessionId: "",
};

export const ticketStatusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};
