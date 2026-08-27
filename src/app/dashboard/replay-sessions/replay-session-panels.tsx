import {
  Bot,
  CalendarCheck,
  Clock3,
  Eye,
  Loader2,
  MessageCircle,
  Monitor,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { VisitorReplayEvent, VisitorReplaySession } from "./replay-types";

const eventLabels: Record<string, string> = {
  page_view: "Page viewed",
  chat_opened: "Chat opened",
  chat_closed: "Chat closed",
  message_sent: "Visitor message sent",
  contact_saved: "Contact details saved",
  demo_requested: "Demonstration requested",
  meeting_booked: "Meeting booked",
};

export function ReplayMetrics({
  sessions,
}: {
  sessions: VisitorReplaySession[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Metric value={sessions.length} label="Sessions" />
      <Metric
        value={sessions.filter((session) => session.status === "active").length}
        label="Active"
      />
    </div>
  );
}

export function ReplaySessionsTable({
  sessions,
  eventCounts,
  loading,
  onView,
  onDelete,
}: {
  sessions: VisitorReplaySession[];
  eventCounts: Record<string, number>;
  loading: boolean;
  onView: (session: VisitorReplaySession) => void;
  onDelete: (session: VisitorReplaySession) => void;
}) {
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-[#fafafd] text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-4">Session</th>
              <th>Landing page</th>
              <th>Events</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Started</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16">
                  <Loader2 className="mx-auto size-6 animate-spin text-[#5964d6]" />
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr
                  key={session.session_id}
                  className="border-t hover:bg-[#fafaff]"
                >
                  <td className="px-4 py-5 font-mono text-xs font-semibold text-[#5964d6]">
                    {session.session_id.slice(0, 22)}
                  </td>
                  <td className="max-w-[240px] truncate text-sm">
                    {session.landing_page ?? "Unknown"}
                  </td>
                  <td className="text-sm font-semibold">
                    {eventCounts[session.session_id] ?? 0}
                  </td>
                  <td className="text-sm text-slate-500">
                    <Clock3 className="mr-1 inline size-3.5" />
                    {getDuration(session)}
                  </td>
                  <td>
                    <Badge
                      className={
                        session.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {session.status}
                    </Badge>
                  </td>
                  <td className="text-sm text-slate-500">
                    {new Date(session.started_at).toLocaleString()}
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="View replay"
                        onClick={() => onView(session)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete replay"
                        className="text-rose-500"
                        onClick={() => onDelete(session)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!loading && sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-16 text-center text-sm text-slate-500"
                >
                  No replay sessions yet. Open the chatbot to start one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function VisitorJourneySheet({
  open,
  session,
  events,
  onOpenChange,
}: {
  open: boolean;
  session: VisitorReplaySession | null;
  events: VisitorReplayEvent[];
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-[720px]">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Visitor journey</SheetTitle>
          <p className="font-mono text-xs text-slate-500">
            {session?.session_id}
          </p>
        </SheetHeader>
        <div className="px-6 py-5">
          {session?.lead_id ? (
            <Button asChild variant="outline" className="mb-5">
              <Link href={`/dashboard/leads/${session.lead_id}`}>
                <UserRound className="size-4" /> Open linked lead
              </Link>
            </Button>
          ) : null}
          <div className="relative ml-3 border-l border-[#dfe2f5] pl-7">
            {events.map((event) => (
              <article
                key={event.id ?? `${event.event_type}-${event.created_at}`}
                className="relative pb-6"
              >
                <span className="absolute -left-[39px] flex size-6 items-center justify-center rounded-full bg-[#f1f2ff] text-[#5964d6]">
                  <EventIcon type={event.event_type} />
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {eventLabels[event.event_type] ?? event.event_type}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {event.page_path ?? session?.last_page ?? ""} ·{" "}
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getDuration(session: VisitorReplaySession) {
  const seconds = Math.max(
    0,
    Math.round(
      (new Date(session.last_seen_at).getTime() -
        new Date(session.started_at).getTime()) /
        1000,
    ),
  );
  return seconds < 60
    ? `${seconds}s`
    : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-28 rounded-2xl border border-slate-100 bg-[#fafafd] px-4 py-3">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function EventIcon({ type }: { type: string }) {
  const Icon =
    type === "page_view"
      ? Monitor
      : type === "message_sent"
        ? MessageCircle
        : type === "meeting_booked"
          ? CalendarCheck
          : type === "contact_saved"
            ? UserRound
            : Bot;
  return <Icon className="size-3.5" />;
}
