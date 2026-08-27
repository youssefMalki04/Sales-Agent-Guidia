import type React from "react";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { OrganizationRecord } from "./organization-data";

export function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition sm:flex-none",
        active
          ? "bg-white text-[#5964d6] shadow-sm ring-1 ring-[#e6e8f2]"
          : "text-[#74798b] hover:bg-white/70 hover:text-[#3e4354]",
      )}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

export function OrganizationCard({
  organization,
  applicationCount,
  onDetails,
  onToggle,
  onDelete,
}: {
  organization: OrganizationRecord;
  applicationCount: number;
  onDetails: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
      <section className="soft-lift relative overflow-hidden rounded-[24px] border border-[#e2e5f1] bg-gradient-to-br from-[#f7f8ff] via-white to-[#faf6ff] p-6 shadow-[0_18px_55px_rgba(48,53,88,.07)] sm:p-7">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-[#e5e7ff]/60 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#5964d6] to-[#8069d9] text-base font-bold text-white shadow-[0_10px_25px_rgba(89,100,214,.24)]">
                {organization.initial}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-[-.025em] text-[#303444]">
                    {organization.name}
                  </h2>
                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${organization.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#dedfe5] bg-[#f3f3f5] text-[#757987]"}`}
                  >
                    {organization.active ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-[#858a9b]">
                  {organization.slug}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Organization actions"
                  className="flex size-9 items-center justify-center rounded-xl border border-[#e1e3ec] bg-white text-[#777c8d] shadow-sm"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDetails}>
                  View & edit details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggle}>
                  {organization.active
                    ? "Disable organization"
                    : "Enable organization"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                  Delete organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-7 grid gap-3 border-t border-[#e7e9f1] pt-5 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a0a4b2]">
                Created
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#555a6b]">
                {organization.createdAt}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a0a4b2]">
                Applications
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#555a6b]">
                {applicationCount} of 5
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a0a4b2]">
                Environment
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#555a6b]">
                <span
                  className={`size-2 rounded-full ${organization.active ? "soft-status-pulse bg-emerald-500" : "bg-[#aaaeba]"}`}
                />
                {organization.active ? "Production" : "Paused"}
              </p>
            </div>
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <section className="rounded-[20px] border border-[#e4e6ee] bg-white p-5 shadow-[0_10px_35px_rgba(44,48,75,.04)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3b3f4f]">
              Recent activity
            </h3>
            <span className="soft-status-pulse size-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-4 space-y-4">
            <ActivityItem
              title="Workspace reviewed"
              detail="Just now"
              tone="indigo"
            />
            <ActivityItem
              title={
                applicationCount
                  ? "Application connected"
                  : "Organization created"
              }
              detail={applicationCount ? "Lynara ERP" : organization.createdAt}
              tone="violet"
            />
            <ActivityItem
              title="Security settings verified"
              detail="Production ready"
              tone="green"
            />
          </div>
        </section>
      </aside>
    </div>
  );
}

function ActivityItem({
  title,
  detail,
  tone,
}: {
  title: string;
  detail: string;
  tone: "indigo" | "violet" | "green";
}) {
  const tones = {
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    green: "bg-emerald-500",
  };
  return (
    <div className="flex gap-3">
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${tones[tone]}`} />
      <div>
        <p className="text-xs font-semibold text-[#555a6b]">{title}</p>
        <p className="mt-1 text-[10px] text-[#999dab]">{detail}</p>
      </div>
    </div>
  );
}

export function OrganizationStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "indigo" | "violet" | "green" | "amber";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
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
