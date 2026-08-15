"use client";

import {
  Bell,
  Check,
  CheckCircle2,
  Flame,
  Mail,
  MessageSquareText,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "guidia-notification-settings-v1";
const notificationEvents = [
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
] as const;

export default function NotificationsPage() {
  const [enabledEvents, setEnabledEvents] = useState<string[]>(
    notificationEvents.map((event) => event.id),
  );
  const [emails, setEmails] = useState("admin@company.com");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = window.setTimeout(() => {
      try {
        const stored = JSON.parse(
          localStorage.getItem(STORAGE_KEY) ?? "null",
        ) as { enabledEvents?: string[]; emails?: string } | null;
        if (stored?.enabledEvents) setEnabledEvents(stored.enabledEvents);
        if (typeof stored?.emails === "string") setEmails(stored.emails);
      } catch {
        // Keep safe defaults when local notification preferences are malformed.
      }
    }, 0);
    return () => window.clearTimeout(load);
  }, []);

  function toggleEvent(id: string) {
    setEnabledEvents((current) =>
      current.includes(id)
        ? current.filter((eventId) => eventId !== id)
        : [...current, id],
    );
    setSaved(false);
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ enabledEvents, emails }),
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto flex max-w-[1080px] flex-col gap-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Team awareness
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Notifications
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Keep your team informed when customer conversations need
              attention.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-[#fafafd] px-4 py-3">
            <p className="text-xl font-semibold text-slate-950">
              {enabledEvents.length}
            </p>
            <p className="text-xs font-medium text-slate-500">Active alerts</p>
          </div>
        </header>

        <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)] sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
              <Bell className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">
                Conversation alerts
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose which events trigger an email notification.
              </p>
            </div>
          </div>

          <div className="soft-stagger mt-6 grid gap-3 md:grid-cols-3">
            {notificationEvents.map((event) => {
              const Icon = event.icon;
              const enabled = enabledEvents.includes(event.id);
              return (
                <button
                  key={event.id}
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => toggleEvent(event.id)}
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
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    {event.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {event.description}
                  </p>
                </button>
              );
            })}
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
              onChange={(event) => {
                setEmails(event.target.value);
                setSaved(false);
              }}
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
              onClick={save}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] transition hover:bg-[#4f5acb]"
            >
              <Check className="size-4" /> Save preferences
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
