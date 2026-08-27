import type { FormEvent, ReactNode } from "react";
import { X } from "lucide-react";
import { isoDate, today } from "./meeting-data";

export function CreateMeeting({
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
