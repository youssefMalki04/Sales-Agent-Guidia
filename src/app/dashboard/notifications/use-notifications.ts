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
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ ok: boolean; message: string } | null>(null);
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

  async function sendTestEmail() {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const response = await fetch("/api/notifications", { method: "POST" });
      const payload = (await response.json()) as { message?: string };
      setTestEmailResult({
        ok: response.ok,
        message: payload.message ?? "Email test failed",
      });
    } catch (error) {
      setTestEmailResult({
        ok: false,
        message: error instanceof Error ? error.message : "Email test failed",
      });
    } finally {
      setTestingEmail(false);
    }
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
    setError("");
    try {
    const response = await fetch(
      `/api/notifications?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      setError("Unable to delete this notification.");
      return false;
    }
    setNotifications((current) => current.filter((item) => item.id !== id));
    return true;
    } catch {
      setError("Unable to delete this notification. Please try again.");
      return false;
    }
  }

  async function snoozeNotification(
    notification: NotificationRow,
    snoozeUntil: Date,
  ) {
    if (!notification.task_id) return;
    setError("");
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "snooze",
        id: notification.id,
        snoozeUntil: snoozeUntil.toISOString(),
        taskId: notification.task_id,
      }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to snooze this task.");
      return;
    }
    setNotifications((current) =>
      current.filter((item) => item.id !== notification.id),
    );
  }

  async function openNotification(notification: NotificationRow) {
    if (!notification.read_at) {
      await updateNotification(notification.id, "read");
    }
    if (notification.action_url) window.location.assign(notification.action_url);
  }

  return {
    enabledEvents,
    emails,
    saved,
    testingEmail,
    testEmailResult,
    notifications,
    error,
    changeEmails,
    toggleEvent,
    savePreferences,
    sendTestEmail,
    updateNotification,
    markAllAsRead,
    deleteNotification,
    openNotification,
    snoozeNotification,
  };
}
