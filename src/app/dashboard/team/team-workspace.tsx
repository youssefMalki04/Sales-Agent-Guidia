import {
  BriefcaseBusiness,
  CheckCircle2,
  MoreHorizontal,
  Search,
  ShieldCheck,
} from "lucide-react";

import type { Role, TeamMember } from "./team-data";
import { RoleBadge, StatusBadge } from "./team-panels";

export type AssignmentMode = "balanced" | "round-robin" | "manual";

type TeamDirectoryProps = {
  members: TeamMember[];
  totalMembers: number;
  query: string;
  role: "all" | Role;
  onQueryChange: (query: string) => void;
  onRoleChange: (role: "all" | Role) => void;
  onOpenMember: (id: string) => void;
};

export function TeamDirectory({
  members,
  totalMembers,
  query,
  role,
  onQueryChange,
  onRoleChange,
  onOpenMember,
}: TeamDirectoryProps) {
  return (
    <>
      <section className="rounded-[22px] border border-[#e5e7ef] bg-[#fafafd] p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#373b4c]">
              Team directory
            </h2>
            <p className="mt-1 text-xs text-[#8a8f9f]">
              {members.length} of {totalMembers} members
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da1b0]" />
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search people…"
                className="h-10 w-full rounded-xl border border-[#e0e2ea] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#8b93df] focus:ring-3 focus:ring-[#5964d6]/10"
              />
            </label>
            <select
              value={role}
              onChange={(event) =>
                onRoleChange(event.target.value as "all" | Role)
              }
              className="h-10 rounded-xl border border-[#e0e2ea] bg-white px-3 text-xs font-semibold text-[#626779]"
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>
      </section>

      {members.length ? (
        <section className="soft-stagger grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onOpen={() => onOpenMember(member.id)}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-[22px] border border-dashed border-[#dfe2eb] bg-[#fafafd] px-6 py-14 text-center">
          <Search className="mx-auto size-6 text-[#a0a4b2]" />
          <h2 className="mt-4 text-sm font-bold">No team member found</h2>
          <p className="mt-2 text-xs text-[#858a9a]">
            Try another name or role.
          </p>
        </section>
      )}
    </>
  );
}

function TeamMemberCard({
  member,
  onOpen,
}: {
  member: TeamMember;
  onOpen: () => void;
}) {
  const palette =
    member.role === "admin"
      ? "from-[#ede9ff] to-[#f8f5ff] text-[#7157ca]"
      : member.role === "manager"
        ? "from-[#e8edff] to-[#f5f7ff] text-[#5366c8]"
        : "from-[#e7f7f1] to-[#f4fbf8] text-[#31846a]";

  return (
    <article className="soft-lift group rounded-[22px] border border-[#e5e7ef] bg-white p-5 shadow-[0_10px_32px_rgba(44,48,75,.045)]">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold ${palette}`}
          >
            {member.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#3b3f4f]">
              {member.name}
            </h3>
            <p className="mt-1 truncate text-xs text-[#8a8f9f]">
              {member.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Manage ${member.name}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#e4e6ed] text-[#888d9d] transition hover:bg-[#f5f6fa]"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <RoleBadge role={member.role} />
        <StatusBadge status={member.status} />
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#656a7b]">
            Workload · {member.activeLeads} leads
          </span>
          <span className="font-bold text-[#777c8d]">{member.capacity}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eff0f4]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${member.capacity > 80 ? "bg-amber-400" : "bg-gradient-to-r from-[#5964d6] to-[#8a72dc]"}`}
            style={{ width: `${member.capacity}%` }}
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#f0f1f5] pt-4">
        <MemberMetric label="Meetings" value={member.meetings} />
        <MemberMetric label="Conversion" value={`${member.conversion}%`} />
      </div>
    </article>
  );
}

function MemberMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[.1em] text-[#a0a4b2]">
        {label}
      </p>
      <p className="mt-1 text-base font-bold text-[#444859]">{value}</p>
    </div>
  );
}

export function TeamAccessSettings({
  assignmentMode,
  onAssignmentModeChange,
}: {
  assignmentMode: AssignmentMode;
  onAssignmentModeChange: (mode: AssignmentMode) => void;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-[22px] border border-[#e4e6ee] bg-white p-5 shadow-[0_10px_35px_rgba(44,48,75,.04)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 className="font-bold text-[#3a3e4f]">Lead assignment</h2>
            <p className="mt-1 text-xs leading-5 text-[#818697]">
              Choose how new qualified opportunities reach your team.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {(["balanced", "round-robin", "manual"] as const).map((mode) => (
            <label
              key={mode}
              className={`cursor-pointer rounded-2xl border p-4 transition ${assignmentMode === mode ? "border-[#939ae2] bg-[#f5f6ff] shadow-sm" : "border-[#e5e7ee] bg-white hover:bg-[#fafafd]"}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-8 items-center justify-center rounded-xl ${assignmentMode === mode ? "bg-white text-[#5964d6] shadow-sm" : "bg-[#f3f4f7] text-[#9095a5]"}`}
                >
                  <BriefcaseBusiness className="size-4" />
                </span>
                <input
                  type="radio"
                  name="assignment"
                  checked={assignmentMode === mode}
                  onChange={() => onAssignmentModeChange(mode)}
                  className="size-4 accent-[#5964d6]"
                />
              </div>
              <b className="mt-4 block text-sm capitalize text-[#444859]">
                {mode.replace("-", " ")}
              </b>
              <span className="mt-2 block text-xs leading-5 text-[#858a9a]">
                {mode === "balanced"
                  ? "Send leads to the person with the lightest workload."
                  : mode === "round-robin"
                    ? "Share opportunities equally in a fixed order."
                    : "Let a manager choose the owner manually."}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#e4e6ee] bg-gradient-to-br from-[#f8f8ff] to-white p-5 sm:p-6">
        <h2 className="font-bold text-[#3a3e4f]">Role permissions</h2>
        <p className="mt-1 text-xs text-[#858a9a]">
          Simple access levels for a focused team.
        </p>
        <div className="mt-5 space-y-4 text-xs text-[#686d7e]">
          <Permission role="Admin" text="Full workspace and billing access" />
          <Permission role="Manager" text="Manage agents, leads and activity" />
          <Permission role="Sales" text="Work with assigned opportunities" />
        </div>
      </section>
    </section>
  );
}

function Permission({ role, text }: { role: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      <p>
        <b>{role}</b> — {text}
      </p>
    </div>
  );
}
