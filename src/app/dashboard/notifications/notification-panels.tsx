"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  CalendarDays,
  MessageSquare,
  Check,
  CheckCheck,
  CheckCircle2,
  Mail,
  MailOpen,
  Clock3,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Search,
  X,
} from "lucide-react";

import { NOTIFICATION_EVENTS } from "./notification-data";
import { filterNotifications } from "./filter-notifications";
import type { NotificationAction, NotificationRow } from "./notification-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

export function RecentNotifications({
  notifications,
  onDelete,
  onMarkAllAsRead,
  onOpen,
  onSnooze,
  onUpdate,
}: {
  notifications: NotificationRow[];
  onDelete: (id: string) => Promise<boolean>;
  onMarkAllAsRead: () => void;
  onOpen: (notification: NotificationRow) => void;
  onSnooze: (notification: NotificationRow, until: Date) => void;
  onUpdate: (id: string, action: NotificationAction) => void;
}) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const unreadCount = notifications.filter((item) => !item.read_at).length;
  const visibleNotifications = filterNotifications(notifications, filter, query);
  const searching = Boolean(query.trim());
  return (
    <section className="soft-panel-enter overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_16px_rgba(15,23,42,.025)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-950">Recent notifications</h2>
          <p className="mt-1 text-xs text-slate-500">
            {unreadCount} unread alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mark all as read"
            onClick={onMarkAllAsRead}
            disabled={!unreadCount}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-[#939ae2] hover:bg-[#f5f6ff] hover:text-[#5964d6] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck className="size-4" />
            <span className="hidden sm:inline">Mark all as read</span>
          </button>
        </div>
      </div>
      <div role="group" aria-label="Filter notifications" className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">
        {([
          { value: "all", label: "All", count: notifications.length },
          { value: "unread", label: "Unread", count: unreadCount },
        ] as const).map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${filter === item.value ? "bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-200" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {item.label}
            <span className="rounded-full bg-white px-1.5 py-0.5 tabular-nums">{item.count}</span>
          </button>
        ))}
        <div className="flex min-h-10 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 sm:ml-auto sm:w-72">
          <Search aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          <input
            type="search"
            aria-label="Search loaded notifications by title or message"
            placeholder="Search notifications…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500"><X aria-hidden="true" className="size-4" /></button>}
        </div>
      </div>
      {searching && <p role="status" className="px-5 py-2 text-xs text-slate-500">{visibleNotifications.length} results in loaded notifications · {filter === "unread" ? "Unread" : "All"}</p>}
      {visibleNotifications.length ? (
        <div className="divide-y divide-slate-100">
          {visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={onDelete}
              onOpen={onOpen}
              onSnooze={onSnooze}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <div role="status" className="flex flex-col items-center gap-3 px-5 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CheckCheck aria-hidden="true" className="size-5" />
          </span>
          <p className="text-sm font-medium text-slate-700">
            {searching ? "No matching notifications." : filter === "unread" ? "You’re all caught up." : "No notifications yet."}
          </p>
          <p className="text-xs text-slate-500">
            {searching ? "Try another word or clear your search." : filter === "unread" ? "No unread notifications in this list." : "New commercial events will appear here."}
          </p>
          {searching && <button type="button" onClick={() => setQuery("")} className="min-h-10 rounded-xl px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">Clear search</button>}
          {!searching && filter === "unread" && notifications.length > 0 && (
            <button type="button" onClick={() => setFilter("all")} className="min-h-10 rounded-xl px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500">
              View all notifications
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function NotificationItem({
  notification,
  onDelete,
  onOpen,
  onSnooze,
  onUpdate,
}: {
  notification: NotificationRow;
  onDelete: (id: string) => Promise<boolean>;
  onOpen: (notification: NotificationRow) => void;
  onSnooze: (notification: NotificationRow, until: Date) => void;
  onUpdate: (id: string, action: NotificationAction) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const Icon = notification.event_type === "meeting"
    ? CalendarDays
    : notification.event_type.includes("follow") || notification.task_id
      ? Clock3
      : notification.event_type === "note-mention" ? MessageSquare : Bell;
  return (
    <article
      className={`group grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 border-l-2 px-4 py-4 transition-colors sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:px-5 ${notification.read_at ? "border-l-transparent bg-white hover:bg-slate-50/60" : "border-l-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/50"}`}
    >
      <span className={`relative flex size-10 items-center justify-center rounded-xl ${severityColor(notification.severity)}`}>
        <Icon aria-hidden="true" className="size-[18px]" />
        {!notification.read_at && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />}
      </span>
      <button
        type="button"
        onClick={() =>
          notification.action_url
            ? onOpen(notification)
            : onUpdate(notification.id, notification.read_at ? "unread" : "read")
        }
        className="min-w-0 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`break-words text-sm ${notification.read_at ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}>
            {notification.title}
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
            {notification.event_type}
          </span>
        </div>
        <span className="sr-only">{notification.read_at ? "Read notification. " : "Unread notification. "}</span>
        <p className="mt-1 break-words text-sm leading-5 text-slate-500">
          {notification.message}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {new Date(notification.created_at).toLocaleString("fr-FR")}
        </p>
        {notification.action_url ? (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#5964d6]">
            {notification.event_type === "note-mention" ? "Open lead" : "Open task"} <ExternalLink className="size-3" />
          </span>
        ) : null}
      </button>
      <div className="col-start-2 flex items-start gap-1 sm:col-start-auto [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-indigo-500">
        <button
          type="button"
          aria-label={notification.read_at ? "Mark as unread" : "Mark as read"}
          title={notification.read_at ? "Mark as unread" : "Mark as read"}
          onClick={() => onUpdate(notification.id, notification.read_at ? "unread" : "read")}
          className="flex size-8 items-center justify-center rounded-lg text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          {notification.read_at ? <Mail aria-hidden="true" className="size-4" /> : <MailOpen aria-hidden="true" className="size-4" />}
        </button>
        {notification.task_id ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label="Snooze task">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5">
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                onSelect={() => onSnooze(notification, tomorrowAtNine())}
              >
                <Clock3 className="size-4" /> Tomorrow at 09:00
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                onSelect={() => onSnooze(notification, nextWeek())}
              >
                <Clock3 className="size-4" /> Next week
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                onSelect={() => {
                  const value = window.prompt(
                    "New date (YYYY-MM-DD HH:mm)",
                    customDateDefault(),
                  );
                  if (!value) return;
                  const date = new Date(value.replace(" ", "T"));
                  if (!Number.isNaN(date.getTime())) onSnooze(notification, date);
                }}
              >
                <Clock3 className="size-4" /> Choose a date…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <button
          type="button"
          aria-label="Archive notification"
          onClick={() => onUpdate(notification.id, "archive")}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <Archive className="size-4" />
        </button>
        <Dialog open={deleteOpen} onOpenChange={(open) => {
          if (deleting) return;
          setDeleteError(false);
          setDeleteOpen(open);
        }}>
          <DialogTrigger asChild>
            <button type="button" aria-label="Delete notification" className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="size-4" />
            </button>
          </DialogTrigger>
          <DialogContent showCloseButton={false} className="rounded-2xl bg-white p-6 sm:max-w-md">
            <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 aria-hidden="true" className="size-5" /></span>
            <DialogTitle>Supprimer cette notification ?</DialogTitle>
            <DialogDescription>
              La notification « {notification.title} » sera supprimée définitivement. Le prospect, la tâche ou le rendez-vous associé ne sera pas supprimé.
            </DialogDescription>
            {deleteError && <p role="alert" className="text-sm text-red-600">La suppression a échoué. Réessayez.</p>}
            <div className="mt-2 flex justify-end gap-2">
              <DialogClose asChild><Button variant="outline" disabled={deleting}>Annuler</Button></DialogClose>
              <Button disabled={deleting} className="bg-red-600 text-white hover:bg-red-700" onClick={async () => {
                setDeleting(true);
                setDeleteError(false);
                try {
                  const success = await onDelete(notification.id);
                  if (success) setDeleteOpen(false);
                  else setDeleteError(true);
                } catch {
                  setDeleteError(true);
                } finally {
                  setDeleting(false);
                }
              }}>{deleting ? "Suppression…" : "Supprimer"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}

function tomorrowAtNine() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return date;
}

function nextWeek() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(9, 0, 0, 0);
  return date;
}

function customDateDefault() {
  const date = tomorrowAtNine();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16).replace("T", " ");
}

export function NotificationPreferencesPanel({
  emails,
  enabledEvents,
  onEmailsChange,
  onSave,
  onSendTest,
  onToggleEvent,
  saved,
  testingEmail,
  testEmailResult,
}: {
  emails: string;
  enabledEvents: string[];
  onEmailsChange: (emails: string) => void;
  onSave: () => void;
  onSendTest: () => void;
  onToggleEvent: (id: string) => void;
  saved: boolean;
  testingEmail: boolean;
  testEmailResult: { ok: boolean; message: string } | null;
}) {
  return (
    <section className="soft-panel-enter rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,.025)] sm:p-6">
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
      <div className="soft-stagger mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
      <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {testEmailResult ? (
          <span
            className={`mr-auto text-sm font-medium ${testEmailResult.ok ? "text-emerald-700" : "text-red-600"}`}
          >
            {testEmailResult.message}
          </span>
        ) : null}
        {saved ? (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="size-4" /> Preferences saved
          </span>
        ) : null}
        <button
          type="button"
          onClick={onSendTest}
          disabled={testingEmail}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dfe2eb] bg-white px-5 text-sm font-semibold text-[#5964d6] transition hover:bg-[#f5f6ff] disabled:opacity-60"
        >
          <Mail className="size-4" />{" "}
          {testingEmail ? "Sending…" : "Send test email"}
        </button>
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
    error: "bg-red-50 text-red-600",
    info: "bg-indigo-50 text-indigo-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
  }[severity];
}
