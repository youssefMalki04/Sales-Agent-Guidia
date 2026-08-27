"use client";

import {
  BriefcaseBusiness,
  Plus,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Role, TeamMember } from "./team-data";
import { initialMembers, STORAGE_KEY } from "./team-data";
import { InviteDialog } from "./invite-dialog";
import { MemberPanel, Stat } from "./team-panels";
import {
  TeamAccessSettings,
  TeamDirectory,
  type AssignmentMode,
} from "./team-workspace";
export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | Role>("all");
  const [inviting, setInviting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignmentMode, setAssignmentMode] =
    useState<AssignmentMode>("balanced");

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

        <TeamDirectory
          members={filtered}
          totalMembers={members.length}
          query={query}
          role={role}
          onQueryChange={setQuery}
          onRoleChange={setRole}
          onOpenMember={setSelectedId}
        />

        <TeamAccessSettings
          assignmentMode={assignmentMode}
          onAssignmentModeChange={setAssignmentMode}
        />
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
