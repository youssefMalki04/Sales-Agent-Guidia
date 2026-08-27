import type { ReactNode } from "react";

import type { Meeting } from "./meeting-data";
import { StatusBadge, statusStyle } from "./meeting-panels";

export function CalendarGrid({
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
          {weekDays.map((day) => (
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

export function MeetingList({
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

export function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
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

export function MeetingStat({
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

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
