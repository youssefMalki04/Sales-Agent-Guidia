"use client";

import { Sparkles } from "lucide-react";
import {
  NotificationPreferencesPanel,
  RecentNotifications,
} from "./notification-panels";
import { useNotifications } from "./use-notifications";

export default function NotificationsPage() {
  const {
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
  } = useNotifications();

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
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        ) : null}
        <RecentNotifications
          notifications={notifications}
          onDelete={deleteNotification}
          onMarkAllAsRead={markAllAsRead}
          onUpdate={updateNotification}
        />
        <NotificationPreferencesPanel
          emails={emails}
          enabledEvents={enabledEvents}
          onEmailsChange={changeEmails}
          onSave={savePreferences}
          onToggleEvent={toggleEvent}
          saved={saved}
        />
      </div>
    </main>
  );
}
