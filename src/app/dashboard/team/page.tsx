"use client";

import {
  BriefcaseBusiness,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Role, TeamMember } from "./team-data";
import { initialMembers, STORAGE_KEY } from "./team-data";
import {
  InviteDialog,
  MemberPanel,
  Permission,
  RoleBadge,
  Stat,
  StatusBadge,
} from "./team-panels";
export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | Role>("all");
  const [inviting, setInviting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<
    "balanced" | "round-robin" | "manual"
  >("balanced");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setMembers(JSON.parse(stored) as TeamMember[]);
      } catch {
        // Keep demo data when local storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () =>
      members.filter((member) => {
        const term = query.trim().toLowerCase();
        return (
          (role === "all" || member.role === role) &&
          (!term ||
            `${member.name} ${member.email}`.toLowerCase().includes(term))
        );
      }),
    [members, query, role],
  );

  const selected = members.find((member) => member.id === selectedId) ?? null;
  const active = members.filter((member) => member.status === "active");
  const totalLeads = members.reduce(
    (total, member) => total + member.activeLeads,
    0,
  );
  const averageConversion = active.length
    ? Math.round(
        active.reduce((total, member) => total + member.conversion, 0) /
          active.length,
      )
    : 0;

  function save(next: TeamMember[]) {
    setMembers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateMember(id: string, patch: Partial<TeamMember>) {
    save(
      members.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    );
  }

  function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const name = String(
      data.get("name") || email.split("@")[0] || "New member",
    );
    save([
      ...members,
      {
        id: `member-${Date.now()}`,
        name,
        email,
        role: String(data.get("role") ?? "sales") as Role,
        status: "pending",
        activeLeads: 0,
        meetings: 0,
        conversion: 0,
        capacity: 0,
      },
    ]);
    setInviting(false);
  }

  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-4 py-7 text-[#292d3b] sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#626cd1]">
              <UsersRound className="size-3" />
              People & access
            </span>
            <h1 className="mt-4 text-[32px] font-bold tracking-[-.045em] text-[#282c3a] sm:text-[36px]">
              Meet your sales team
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777d8f]">
              Keep roles, workload and lead ownership clear without losing the
              human touch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInviting(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-[0_9px_22px_rgba(89,100,214,.22)] hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" />
            Invite member
          </button>
        </header>

        <section className="soft-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            icon={<UsersRound className="size-4" />}
            label="Team members"
            value={members.length}
            tone="indigo"
          />
          <Stat
            icon={<UserCheck className="size-4" />}
            label="Active now"
            value={active.length}
            tone="green"
          />
          <Stat
            icon={<BriefcaseBusiness className="size-4" />}
            label="Assigned leads"
            value={totalLeads}
            tone="violet"
          />
          <Stat
            icon={<TrendingUp className="size-4" />}
            label="Avg. conversion"
            value={`${averageConversion}%`}
            tone="amber"
          />
        </section>

        <section className="rounded-[22px] border border-[#e5e7ef] bg-[#fafafd] p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#373b4c]">
                Team directory
              </h2>
              <p className="mt-1 text-xs text-[#8a8f9f]">
                {filtered.length} of {members.length} members
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da1b0]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search people…"
                  className="h-10 w-full rounded-xl border border-[#e0e2ea] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#8b93df] focus:ring-3 focus:ring-[#5964d6]/10"
                />
              </label>
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as "all" | Role)
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

        {filtered.length ? (
          <section className="soft-stagger grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onOpen={() => setSelectedId(member.id)}
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
                      onChange={() => setAssignmentMode(mode)}
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
              <Permission
                role="Admin"
                text="Full workspace and billing access"
              />
              <Permission
                role="Manager"
                text="Manage agents, leads and activity"
              />
              <Permission
                role="Sales"
                text="Work with assigned opportunities"
              />
            </div>
          </section>
        </section>
      </div>

      {inviting ? (
        <InviteDialog onClose={() => setInviting(false)} onSubmit={invite} />
      ) : null}
      {selected ? (
        <MemberPanel
          member={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={(patch) => updateMember(selected.id, patch)}
        />
      ) : null}
    </main>
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
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.1em] text-[#a0a4b2]">
            Meetings
          </p>
          <p className="mt-1 text-base font-bold text-[#444859]">
            {member.meetings}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.1em] text-[#a0a4b2]">
            Conversion
          </p>
          <p className="mt-1 text-base font-bold text-[#444859]">
            {member.conversion}%
          </p>
        </div>
      </div>
    </article>
  );
}
