import type { ReactNode } from "react";
import { useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  UserRound,
  Video,
  X,
} from "lucide-react";

import type { Meeting, MeetingStatus } from "./meeting-data";
import { isoDate, today } from "./meeting-data";

export function MeetingDetails({
  meeting,
  onClose,
  onUpdate,
}: {
  meeting: Meeting;
  onClose: () => void;
  onUpdate: (patch: Partial<Meeting>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [schedule, setSchedule] = useState({
    date: meeting.date,
    time: meeting.time,
    duration: meeting.duration,
  });

  function saveSchedule() {
    onUpdate(schedule);
    setEditing(false);
  }

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
        <section className="mt-6 rounded-xl border border-[#e1e4f8] bg-[#fafaff] p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">Schedule</h3>
            <button
              type="button"
              onClick={() => setEditing((current) => !current)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5964d6]"
            >
              <Pencil className="size-3.5" />{" "}
              {editing ? "Cancel editing" : "Modify"}
            </button>
          </div>
          {editing ? (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Date">
                  <input
                    required
                    type="date"
                    value={schedule.date}
                    onChange={(event) =>
                      setSchedule((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                </Field>
                <Field label="Time">
                  <input
                    required
                    type="time"
                    value={schedule.time}
                    onChange={(event) =>
                      setSchedule((current) => ({
                        ...current,
                        time: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                </Field>
              </div>
              <Field label="Duration">
                <select
                  value={schedule.duration}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      duration: Number(event.target.value),
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </Field>
              <button
                type="button"
                onClick={saveSchedule}
                disabled={!schedule.date || !schedule.time}
                className="h-10 w-full rounded-xl bg-[#5964d6] text-sm font-semibold text-white hover:bg-[#4f5acb] disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          ) : null}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function StatusBadge({ status }: { status: MeetingStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle(status)}`}
    >
      {status}
    </span>
  );
}

export function statusStyle(status: MeetingStatus) {
  return {
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  }[status];
}
