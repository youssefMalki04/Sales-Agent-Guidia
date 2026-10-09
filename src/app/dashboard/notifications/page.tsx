"use client";

import { Bell } from "lucide-react";
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
  } = useNotifications();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-4 py-6 text-slate-900 sm:px-8 xl:px-10">
      <div className="soft-page-enter mx-auto flex max-w-[1400px] flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100/60 bg-gradient-to-r from-indigo-50/70 via-white to-white p-4 sm:p-5">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-950">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"><Bell aria-hidden="true" className="size-5" /></span>
              Notifications
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Keep your team informed when customer conversations need
              attention.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-white px-4 py-3">
            <p className="text-xl font-semibold tabular-nums text-indigo-600">
              {enabledEvents.length}
            </p>
            <p className="text-xs font-medium text-slate-500">Enabled email events</p>
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
          onOpen={openNotification}
          onSnooze={snoozeNotification}
          onUpdate={updateNotification}
        />
        <NotificationPreferencesPanel
          emails={emails}
          enabledEvents={enabledEvents}
          onEmailsChange={changeEmails}
          onSave={savePreferences}
          onSendTest={sendTestEmail}
          onToggleEvent={toggleEvent}
          saved={saved}
          testingEmail={testingEmail}
          testEmailResult={testEmailResult}
        />
      </div>
    </main>
  );
}
