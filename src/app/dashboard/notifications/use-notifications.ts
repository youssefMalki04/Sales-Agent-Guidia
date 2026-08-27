"use client";

import { useEffect, useState } from "react";

import { NOTIFICATION_EVENTS } from "./notification-data";
import type {
  NotificationAction,
  NotificationPreferences,
  NotificationRow,
} from "./notification-types";

export function useNotifications() {
  const [enabledEvents, setEnabledEvents] = useState<string[]>(
    NOTIFICATION_EVENTS.map((event) => event.id),
  );
  const [emails, setEmails] = useState("");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/notifications")
      .then(async (response) => {
        if (!response.ok) throw new Error("Notifications request failed");
        return response.json() as Promise<{
          notifications: NotificationRow[];
          preferences: NotificationPreferences;
        }>;
      })
      .then((result) => {
        setNotifications(result.notifications);
        setEnabledEvents(result.preferences.enabledEvents);
        setEmails(result.preferences.emails.join("\n"));
      })
      .catch(() =>
        setError(
          "Unable to load notifications. Apply migration 011_notifications.sql in Supabase.",
        ),
      );
  }, []);

  function toggleEvent(id: string) {
    setEnabledEvents((current) =>
      current.includes(id)
        ? current.filter((eventId) => eventId !== id)
        : [...current, id],
    );
    setSaved(false);
  }

  function changeEmails(value: string) {
    setEmails(value);
    setSaved(false);
  }

  async function savePreferences() {
    setError("");
    const recipients = emails
      .split(/\n|,/)
      .map((email) => email.trim())
      .filter(Boolean);
    const response = await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabledEvents, emails: recipients }),
    });
    if (!response.ok) {
      setError("Unable to save notification preferences.");
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  async function updateNotification(id: string, action: NotificationAction) {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, id }),
    });
    if (!response.ok) {
      setError("Unable to update this notification.");
      return;
    }
    setNotifications((current) =>
      action === "archive"
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  read_at: action === "read" ? new Date().toISOString() : null,
                }
              : item,
          ),
    );
  }

  async function markAllAsRead() {
    setError("");
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read-all" }),
    });
    if (!response.ok) {
      setError("Unable to mark notifications as read.");
      return;
    }
    const readAt = new Date().toISOString();
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read_at: readAt })),
    );
  }

  async function deleteNotification(id: string) {
    const response = await fetch(
      `/api/notifications?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      setError("Unable to delete this notification.");
      return;
    }
    setNotifications((current) => current.filter((item) => item.id !== id));
  }

  return {
    enabledEvents,
    emails,
    saved,
    notifications,
    error,
    changeEmails,
    toggleEvent,
    savePreferences,
    updateNotification,
    markAllAsRead,
    deleteNotification,
  };
}
