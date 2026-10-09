"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LeadFollowUpItem } from "./lead-detail-data";

export function LeadFollowUpsPanel({
  reminders,
}: {
  reminders: LeadFollowUpItem[];
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function complete(id: string) {
    setUpdating(id);
    setError("");
    try {
      const response = await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "completed" }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) setError(payload.error ?? "Unable to update reminder");
      else router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <section className="rounded-[24px] border border-[#e3e5ee] bg-white p-5 shadow-[0_10px_35px_rgba(36,39,73,.045)] sm:p-6">
      <div className="flex items-center justify-between border-b border-[#eff0f5] pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b8e9c]">
            Next actions
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
            <CalendarClock className="size-5 text-[#5962dc]" /> Follow-up
            reminders
          </h2>
        </div>
        <span className="rounded-full bg-[#f0f1ff] px-3 py-1 text-xs font-bold text-[#5b63d9]">
          {reminders.filter((item) => item.status === "upcoming").length} open
        </span>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {reminders.length ? (
          reminders.map((reminder) => {
            const overdue = reminder.displayStatus === "overdue";
            return (
              <article
                key={reminder.id}
                className="rounded-2xl border border-[#e8e9f0] bg-[#fcfcfd] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#33343d]">{reminder.title}</p>
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${overdue ? "text-red-600" : reminder.status === "completed" ? "text-emerald-700" : "text-[#717481]"}`}
                    >
                      <Clock3 className="size-3.5" />{" "}
                      {formatReminderDate(reminder.dueAt)} ·{" "}
                      {reminder.displayStatus === "completed"
                        ? "Completed"
                        : overdue
                          ? "Overdue"
                          : "Upcoming"}
                    </p>
                  </div>
                  {reminder.status === "upcoming" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updating === reminder.id}
                      onClick={() => complete(reminder.id)}
                    >
                      <Check className="size-3.5" />
                      {updating === reminder.id ? "Saving…" : "Done"}
                    </Button>
                  ) : null}
                </div>
                {reminder.notes ? (
                  <p className="mt-3 text-sm leading-6 text-[#707380]">
                    {reminder.notes}
                  </p>
                ) : null}
              </article>
            );
          })
        ) : (
          <p className="col-span-full rounded-2xl border border-dashed py-7 text-center text-sm text-[#777a88]">
            No follow-up scheduled yet.
          </p>
        )}
      </div>
      {error ? (
        <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>
      ) : null}
    </section>
  );
}

function formatReminderDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
