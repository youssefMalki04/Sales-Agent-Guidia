"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Meeting, MeetingStatus } from "./meeting-data";
import {
  initialMeetings,
  isoDate,
  month,
  STORAGE_KEY,
  today,
  year,
} from "./meeting-data";
import {
  CreateMeeting,
  MeetingDetails,
  StatusBadge,
  statusStyle,
} from "./meeting-panels";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date(year, month, 1));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | MeetingStatus>("all");
  const [owner, setOwner] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setMeetings(JSON.parse(stored) as Meeting[]);
      } catch {
        // Keep demo appointments if storage cannot be read.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () =>
      meetings.filter((meeting) => {
        const term = query.trim().toLowerCase();
        return (
          (status === "all" || meeting.status === status) &&
          (owner === "all" || meeting.owner === owner) &&
          (!term ||
            [
              meeting.prospect,
              meeting.company,
              meeting.title,
              meeting.email,
            ].some((value) => value.toLowerCase().includes(term)))
        );
      }),
    [meetings, owner, query, status],
  );

  const selected =
    meetings.find((meeting) => meeting.id === selectedId) ?? null;
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(selectedMonth);
  const confirmed = meetings.filter(
    (meeting) => meeting.status === "confirmed",
  ).length;
  const pending = meetings.filter(
    (meeting) => meeting.status === "pending",
  ).length;

  function save(next: Meeting[]) {
    setMeetings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateMeeting(id: string, patch: Partial<Meeting>) {
    save(
      meetings.map((meeting) =>
        meeting.id === id ? { ...meeting, ...patch } : meeting,
      ),
    );
  }

  function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Meeting = {
      id: `meeting-${Date.now()}`,
      title: String(data.get("title") || "Discovery call"),
      prospect: String(data.get("prospect") || "New prospect"),
      company: String(data.get("company") || "Company"),
      email: String(data.get("email") || ""),
      owner: String(data.get("owner") || "Yosra"),
      date: String(data.get("date") || isoDate(today.getDate())),
      time: String(data.get("time") || "10:00"),
      duration: Number(data.get("duration") || 30),
      status: "pending",
      source: "Manual",
      notes: String(data.get("notes") || ""),
    };
    save([...meetings, next]);
    setCreating(false);
    setSelectedId(next.id);
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-12">
      <div className="soft-page-enter mx-auto max-w-[1400px] space-y-7">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Sales workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Meetings
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage demos and follow-ups booked from your AI conversations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" />
            New meeting
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total meetings" value={meetings.length} tone="neutral" />
          <Stat label="Confirmed" value={confirmed} tone="green" />
          <Stat label="Pending" value={pending} tone="amber" />
          <Stat
            label="Completion rate"
            value={`${meetings.length ? Math.round((meetings.filter((item) => item.status === "completed").length / meetings.length) * 100) : 0}%`}
            tone="indigo"
          />
        </section>

        <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
          <div className="flex flex-col gap-3 border-b border-[#e8e8ec] p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedMonth(new Date(year, month, 1))}
                className="h-9 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-[#5964d6] hover:bg-[#f5f6ff]"
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setSelectedMonth(
                    new Date(
                      selectedMonth.getFullYear(),
                      selectedMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="flex size-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-[#f5f6ff]"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setSelectedMonth(
                    new Date(
                      selectedMonth.getFullYear(),
                      selectedMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="flex size-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-[#f5f6ff]"
              >
                <ChevronRight className="size-4" />
              </button>
              <h2 className="ml-2 text-lg font-semibold">{monthLabel}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="relative min-w-52 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search meetings…"
                  className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-[#939ae2]"
                />
              </label>
              <select
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className="h-9 rounded-md border border-[#dedee4] bg-white px-3 text-xs font-semibold"
              >
                <option value="all">All owners</option>
                <option>Yosra</option>
                <option>Sami</option>
              </select>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "all" | MeetingStatus)
                }
                className="h-9 rounded-md border border-[#dedee4] bg-white px-3 text-xs font-semibold"
              >
                <option value="all">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex rounded-md border border-[#dedee4] p-1">
                <ViewButton
                  active={view === "calendar"}
                  label="Calendar"
                  onClick={() => setView("calendar")}
                >
                  <CalendarDays className="size-4" />
                </ViewButton>
                <ViewButton
                  active={view === "list"}
                  label="List"
                  onClick={() => setView("list")}
                >
                  <List className="size-4" />
                </ViewButton>
              </div>
            </div>
          </div>

          {view === "calendar" ? (
            <CalendarGrid
              month={selectedMonth}
              meetings={filtered}
              onSelect={setSelectedId}
            />
          ) : (
            <MeetingList meetings={filtered} onSelect={setSelectedId} />
          )}
        </section>
      </div>

      {selected ? (
        <MeetingDetails
          meeting={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={(patch) => updateMeeting(selected.id, patch)}
        />
      ) : null}
      {creating ? (
        <CreateMeeting
          onClose={() => setCreating(false)}
          onSubmit={createMeeting}
        />
      ) : null}
    </main>
  );
}

function CalendarGrid({
  month,
  meetings,
  onSelect,
}: {
  month: Date;
  meetings: Meeting[];
  onSelect: (id: string) => void;
}) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];
  while (cells.length % 7) cells.push(null);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[850px]">
        <div className="grid grid-cols-7 border-b border-[#e8e8ec] bg-[#fafafa]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="px-3 py-3 text-xs font-bold uppercase text-[#8b8b94]"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            const date = day
              ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : "";
            const daily = meetings.filter((meeting) => meeting.date === date);
            const isToday =
              day && date === new Date().toISOString().slice(0, 10);
            return (
              <div
                key={`${index}-${day}`}
                className="min-h-32 border-b border-r border-[#ececf0] p-2"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${isToday ? "bg-[#5964d6] text-white" : "text-[#696972]"}`}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {daily.map((meeting) => (
                    <button
                      type="button"
                      key={meeting.id}
                      onClick={() => onSelect(meeting.id)}
                      className={`w-full truncate rounded-md border-l-2 px-2 py-1.5 text-left text-[11px] font-semibold ${statusStyle(meeting.status)}`}
                    >
                      <span className="mr-1 font-normal">{meeting.time}</span>
                      {meeting.prospect}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MeetingList({
  meetings,
  onSelect,
}: {
  meetings: Meeting[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-[#ececf0]">
      {[...meetings]
        .sort((a, b) =>
          `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
        )
        .map((meeting) => (
          <button
            type="button"
            key={meeting.id}
            onClick={() => onSelect(meeting.id)}
            className="grid w-full gap-3 p-4 text-left hover:bg-[#fafafa] sm:grid-cols-[130px_1fr_150px_120px] sm:items-center"
          >
            <div>
              <p className="text-sm font-semibold">
                {new Date(`${meeting.date}T12:00:00`).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </p>
              <p className="mt-1 text-xs text-[#85858e]">
                {meeting.time} · {meeting.duration} min
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">{meeting.title}</p>
              <p className="mt-1 text-xs text-[#777780]">
                {meeting.prospect} · {meeting.company}
              </p>
            </div>
            <p className="text-xs font-medium text-[#696972]">
              {meeting.owner}
            </p>
            <StatusBadge status={meeting.status} />
          </button>
        ))}
      {!meetings.length ? (
        <p className="p-12 text-center text-sm text-[#85858e]">
          No meeting matches these filters.
        </p>
      ) : null}
    </div>
  );
}

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex size-7 items-center justify-center rounded-lg ${active ? "bg-[#5964d6] text-white" : "text-[#85858e]"}`}
    >
      {children}
    </button>
  );
}
function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "neutral" | "green" | "amber" | "indigo";
}) {
  const tones = {
    neutral: "bg-slate-400",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    indigo: "bg-[#5964d6]",
  };
  return (
    <article className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#85858e]">{label}</p>
        <span className={`size-2 rounded-full ${tones[tone]}`} />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </article>
  );
}
