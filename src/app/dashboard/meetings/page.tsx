"use client";

import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  List,
  Plus,
  Search,
  Sparkles,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type MeetingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type Meeting = {
  id: string;
  title: string;
  prospect: string;
  company: string;
  email: string;
  owner: string;
  date: string;
  time: string;
  duration: number;
  status: MeetingStatus;
  source: string;
  notes: string;
};

const STORAGE_KEY = "leadia-sales-meetings-v1";
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const isoDate = (day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const initialMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Product discovery",
    prospect: "Amira Ben Salah",
    company: "Nexa Retail",
    email: "amira@nexa.tn",
    owner: "Yosra",
    date: isoDate(Math.min(today.getDate() + 1, 27)),
    time: "10:00",
    duration: 30,
    status: "confirmed",
    source: "AI Widget",
    notes: "Discuss HubSpot integration and qualification volume.",
  },
  {
    id: "meeting-2",
    title: "Technical demo",
    prospect: "Thomas Martin",
    company: "Flowdesk",
    email: "thomas@flowdesk.fr",
    owner: "Sami",
    date: isoDate(Math.min(today.getDate() + 2, 28)),
    time: "14:30",
    duration: 45,
    status: "pending",
    source: "Live Inbox",
    notes: "Salesforce connector and deployment timeline.",
  },
  {
    id: "meeting-3",
    title: "Security review",
    prospect: "Sara Trabelsi",
    company: "Kite Finance",
    email: "sara@kite.tn",
    owner: "Yosra",
    date: isoDate(Math.min(today.getDate() + 4, 28)),
    time: "11:00",
    duration: 30,
    status: "confirmed",
    source: "AI Widget",
    notes: "Data hosting, retention and access controls.",
  },
  {
    id: "meeting-4",
    title: "Follow-up",
    prospect: "Lina Mansour",
    company: "Atlas Cloud",
    email: "lina@atlas.io",
    owner: "Sami",
    date: isoDate(Math.max(today.getDate() - 2, 1)),
    time: "09:30",
    duration: 30,
    status: "completed",
    source: "Manual",
    notes: "Proposal follow-up completed.",
  },
];

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

function MeetingDetails({
  meeting,
  onClose,
  onUpdate,
}: {
  meeting: Meeting;
  onClose: () => void;
  onUpdate: (patch: Partial<Meeting>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <StatusBadge status={meeting.status} />
            <h2 className="mt-4 text-2xl font-semibold">{meeting.title}</h2>
            <p className="mt-2 text-sm text-[#777780]">
              {meeting.prospect} · {meeting.company}
            </p>
          </div>
          <button
            aria-label="Close details"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-md border"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-7 space-y-3 rounded-lg bg-[#f6f6f8] p-4 text-sm text-[#5f5f68]">
          <p className="flex gap-3">
            <CalendarDays className="size-4" />
            {new Date(`${meeting.date}T12:00:00`).toLocaleDateString("en-US", {
              dateStyle: "long",
            })}
          </p>
          <p className="flex gap-3">
            <Clock3 className="size-4" />
            {meeting.time} · {meeting.duration} minutes
          </p>
          <p className="flex gap-3">
            <UserRound className="size-4" />
            Owner: {meeting.owner}
          </p>
          <p className="flex gap-3">
            <Video className="size-4" />
            Video meeting
          </p>
        </div>
        <section className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#92929b]">
            Notes
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#5f5f68]">
            {meeting.notes || "No notes added."}
          </p>
        </section>
        <section className="mt-7 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ status: "confirmed" })}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            <Check className="size-4" />
            Confirm
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ status: "completed" })}
            className="h-10 rounded-md border text-sm font-semibold"
          >
            Complete
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdate({
                date: isoDate(Math.min(today.getDate() + 7, 28)),
                status: "pending",
              })
            }
            className="h-10 rounded-md border text-sm font-semibold"
          >
            Reschedule +7d
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ status: "cancelled" })}
            className="h-10 rounded-md border border-red-200 text-sm font-semibold text-red-700"
          >
            Cancel
          </button>
        </section>
      </aside>
    </div>
  );
}

function CreateMeeting({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const input =
    "h-10 w-full rounded-md border border-[#dcdce2] px-3 text-sm outline-none";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">New meeting</h2>
            <p className="mt-1 text-sm text-[#7d7d86]">
              Schedule a sales appointment.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              required
              name="title"
              defaultValue="Product discovery"
              className={input}
            />
          </Field>
          <Field label="Prospect">
            <input required name="prospect" className={input} />
          </Field>
          <Field label="Company">
            <input required name="company" className={input} />
          </Field>
          <Field label="Email">
            <input type="email" name="email" className={input} />
          </Field>
          <Field label="Date">
            <input
              required
              type="date"
              name="date"
              defaultValue={isoDate(today.getDate())}
              className={input}
            />
          </Field>
          <Field label="Time">
            <input
              required
              type="time"
              name="time"
              defaultValue="10:00"
              className={input}
            />
          </Field>
          <Field label="Duration">
            <select name="duration" className={input}>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </Field>
          <Field label="Owner">
            <select name="owner" className={input}>
              <option>Yosra</option>
              <option>Sami</option>
            </select>
          </Field>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
              Notes
            </span>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-md border border-[#dcdce2] p-3 text-sm"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border px-4 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            Create meeting
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
        {label}
      </span>
      {children}
    </label>
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
function StatusBadge({ status }: { status: MeetingStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle(status)}`}
    >
      {status}
    </span>
  );
}
function statusStyle(status: MeetingStatus) {
  return {
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  }[status];
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
