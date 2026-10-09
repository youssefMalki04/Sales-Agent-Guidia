import type { NotificationRow } from "./notification-types";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function filterNotifications(
  notifications: NotificationRow[],
  filter: "all" | "unread",
  query: string,
) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return notifications.filter((item) => {
    if (filter === "unread" && item.read_at) return false;
    const text = normalize(item.title + " " + item.message);
    return terms.every((term) => text.includes(term));
  });
}
