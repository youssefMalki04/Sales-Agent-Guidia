export type NotificationRow = {
  created_at: string;
  event_type: string;
  id: string;
  message: string;
  read_at: string | null;
  severity: "info" | "success" | "warning" | "error";
  title: string;
};

export type NotificationAction = "read" | "unread" | "archive";

export type NotificationPreferences = {
  emails: string[];
  enabledEvents: string[];
};
