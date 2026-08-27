"use client";

import {
  Archive,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Mail,
  Trash2,
} from "lucide-react";

import { NOTIFICATION_EVENTS } from "./notification-data";
import type { NotificationAction, NotificationRow } from "./notification-types";

export function RecentNotifications({
  notifications,
  onDelete,
  onMarkAllAsRead,
  onUpdate,
}: {
  notifications: NotificationRow[];
  onDelete: (id: string) => void;
  onMarkAllAsRead: () => void;
  onUpdate: (id: string, action: NotificationAction) => void;
}) {
  const unreadCount = notifications.filter((item) => !item.read_at).length;
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <h2 className="font-semibold text-slate-950">Recent notifications</h2>
          <p className="mt-1 text-xs text-slate-500">
            {unreadCount} unread alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={!unreadCount}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-[#939ae2] hover:bg-[#f5f6ff] hover:text-[#5964d6] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck className="size-4" />
            <span className="hidden sm:inline">Mark all as read</span>
          </button>
          <Bell className="size-5 text-[#5964d6]" />
        </div>
      </div>
      {notifications.length ? (
        <div className="divide-y divide-slate-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <p className="p-10 text-center text-sm text-slate-500">
          No notification yet. New commercial events will appear here.
        </p>
      )}
    </section>
  );
}

function NotificationItem({
  notification,
  onDelete,
  onUpdate,
}: {
  notification: NotificationRow;
  onDelete: (id: string) => void;
  onUpdate: (id: string, action: NotificationAction) => void;
}) {
  return (
    <article
      className={`flex gap-4 p-5 ${notification.read_at ? "bg-white" : "bg-[#fafaff]"}`}
    >
      <span
        className={`mt-1 size-2 shrink-0 rounded-full ${severityColor(notification.severity)}`}
      />
      <button
        type="button"
        onClick={() =>
          onUpdate(notification.id, notification.read_at ? "unread" : "read")
        }
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {notification.title}
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
            {notification.event_type}
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {notification.message}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          {new Date(notification.created_at).toLocaleString("fr-FR")}
        </p>
      </button>
      <div className="flex gap-1">
        <button
          type="button"
          aria-label="Archive notification"
          onClick={() => onUpdate(notification.id, "archive")}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <Archive className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Delete notification"
          onClick={() => onDelete(notification.id)}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}

export function NotificationPreferencesPanel({
  emails,
  enabledEvents,
  onEmailsChange,
  onSave,
  onToggleEvent,
  saved,
}: {
  emails: string;
  enabledEvents: string[];
  onEmailsChange: (emails: string) => void;
  onSave: () => void;
  onToggleEvent: (id: string) => void;
  saved: boolean;
}) {
  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
          <Bell className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-950">Conversation alerts</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose which events trigger an email notification.
          </p>
        </div>
      </div>
      <div className="soft-stagger mt-6 grid gap-3 md:grid-cols-3">
        {NOTIFICATION_EVENTS.map((event) => (
          <NotificationEventSwitch
            key={event.id}
            event={event}
            enabled={enabledEvents.includes(event.id)}
            onToggle={onToggleEvent}
          />
        ))}
      </div>
      <label className="mt-6 block rounded-2xl border border-slate-100 bg-[#fafafd] p-5">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Mail className="size-4 text-[#5964d6]" /> Notification recipients
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          Enter one email address per line.
        </span>
        <textarea
          value={emails}
          onChange={(event) => onEmailsChange(event.target.value)}
          rows={3}
          className="mt-4 min-h-20 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
        />
      </label>
      <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {saved ? (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="size-4" /> Preferences saved
          </span>
        ) : null}
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] transition hover:bg-[#4f5acb]"
        >
          <Check className="size-4" /> Save preferences
        </button>
      </div>
    </section>
  );
}

function NotificationEventSwitch({
  enabled,
  event,
  onToggle,
}: {
  enabled: boolean;
  event: (typeof NOTIFICATION_EVENTS)[number];
  onToggle: (id: string) => void;
}) {
  const Icon = event.icon;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(event.id)}
      className={`soft-lift rounded-2xl border p-4 text-left transition ${enabled ? "border-[#939ae2] bg-[#f5f6ff]" : "border-slate-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-xl ${enabled ? "bg-white text-[#5964d6] shadow-sm" : "bg-slate-100 text-slate-400"}`}
        >
          <Icon className="size-[18px]" />
        </span>
        <span
          className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-[#5964d6]" : "bg-slate-300"}`}
        >
          <span
            className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"}`}
          />
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">{event.label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {event.description}
      </p>
    </button>
  );
}

function severityColor(severity: NotificationRow["severity"]) {
  return {
    error: "bg-red-500",
    info: "bg-indigo-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  }[severity];
}
