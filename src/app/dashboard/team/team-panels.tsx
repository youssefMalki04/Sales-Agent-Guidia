import type React from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Mail, X } from "lucide-react";

import type { MemberStatus, Role, TeamMember } from "./team-data";

export function InviteDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const input =
    "h-11 w-full rounded-xl border border-[#dfe2eb] px-3 text-sm outline-none focus:border-[#8991df] focus:ring-3 focus:ring-[#5964d6]/10";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[22px] border border-[#e3e5ed] bg-white p-6 shadow-2xl"
      >
        <div className="flex justify-between">
          <div>
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Mail className="size-4" />
            </span>
            <h2 className="text-xl font-bold tracking-[-.025em] text-[#343849]">
              Invite team member
            </h2>
            <p className="mt-1 text-sm text-[#7d7d86]">
              An invitation will be simulated in this frontend.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Full name
          </span>
          <input required name="name" className={input} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Email address
          </span>
          <input required type="email" name="email" className={input} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Role
          </span>
          <select name="role" className={input}>
            <option value="sales">Sales</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-[#e0e2ea] px-4 text-sm font-semibold text-[#686d7e]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            <Mail className="size-4" />
            Send invitation
          </button>
        </div>
      </form>
    </div>
  );
}

export function MemberPanel({
  member,
  onClose,
  onUpdate,
}: {
  member: TeamMember;
  onClose: () => void;
  onUpdate: (patch: Partial<TeamMember>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/25"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <aside className="soft-panel-enter h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} large />
            <div>
              <h2 className="text-lg font-bold tracking-[-.02em] text-[#373b4c]">
                {member.name}
              </h2>
              <p className="mt-1 text-xs text-[#777780]">{member.email}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2">
          <MiniStat label="Leads" value={member.activeLeads} />
          <MiniStat label="Meetings" value={member.meetings} />
          <MiniStat label="Conversion" value={`${member.conversion}%`} />
        </div>
        <label className="mt-7 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Role
          </span>
          <select
            value={member.role}
            onChange={(event) => onUpdate({ role: event.target.value as Role })}
            className="h-11 w-full rounded-xl border border-[#dfe2eb] px-3 text-sm outline-none focus:border-[#8991df]"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="sales">Sales</option>
          </select>
        </label>
        <label className="mt-5 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Account status
          </span>
          <select
            value={member.status}
            onChange={(event) =>
              onUpdate({ status: event.target.value as MemberStatus })
            }
            className="h-11 w-full rounded-xl border border-[#dfe2eb] px-3 text-sm outline-none focus:border-[#8991df]"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
        <section className="mt-6 rounded-2xl bg-gradient-to-br from-[#f5f6ff] to-[#fafafd] p-4">
          <h3 className="text-sm font-semibold">Reassign workload</h3>
          <p className="mt-2 text-xs leading-5 text-[#777780]">
            Move this member&apos;s open leads to another active sales
            representative.
          </p>
          <button
            type="button"
            onClick={() => onUpdate({ activeLeads: 0, capacity: 0 })}
            className="mt-4 h-10 w-full rounded-xl border border-[#dfe2eb] bg-white text-xs font-semibold text-[#626779]"
          >
            Reassign all leads
          </button>
        </section>
      </aside>
    </div>
  );
}

export function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#e8edf8] font-bold text-[#315287] ${large ? "size-12 text-sm" : "size-10 text-xs"}`}
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function RoleBadge({ role }: { role: Role }) {
  const styles = {
    admin: "bg-violet-50 text-violet-700",
    manager: "bg-indigo-50 text-indigo-700",
    sales: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles[role]}`}
    >
      {role}
    </span>
  );
}
export function StatusBadge({ status }: { status: MemberStatus }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    disabled: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}
export function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone: "indigo" | "green" | "violet" | "amber";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <article className="soft-lift flex items-center gap-3 rounded-2xl border border-[#e7e9f1] bg-white p-4 shadow-[0_8px_24px_rgba(45,49,76,.035)]">
      <span
        className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#989cab]">
          {label}
        </p>
        <p className="mt-1 text-lg font-bold text-[#383c4c]">{value}</p>
      </div>
    </article>
  );
}
function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#f5f5f7] p-3 text-center">
      <p className="text-lg font-semibold">{value}</p>
      <p className="mt-1 text-[10px] uppercase text-[#85858e]">{label}</p>
    </div>
  );
}
export function Permission({ role, text }: { role: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      <p>
        <b>{role}</b> — {text}
      </p>
    </div>
  );
}
