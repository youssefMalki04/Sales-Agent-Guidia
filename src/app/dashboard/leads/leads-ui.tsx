import { CalendarDays, UsersRound, Sparkles, BadgeCheck, Trophy } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "green" | "indigo" | "neutral";
  value: number;
}) {
  const Icon = label === "Won" ? Trophy : label === "Qualified" ? BadgeCheck : tone === "indigo" ? Sparkles : UsersRound;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border px-4 py-3 shadow-[0_3px_14px_rgba(89,100,214,.04)]",
        tone === "green"
          ? "border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70"
          : "border-indigo-100 bg-gradient-to-br from-white to-indigo-50/70",
      )}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <span className={cn("flex size-8 items-center justify-center rounded-xl", tone === "green" ? "bg-emerald-100/70 text-emerald-700" : "bg-indigo-100/70 text-[#5964d6]")}><Icon className="size-4" /></span>
      </div>
      <p
        className={cn(
          "text-2xl font-semibold tracking-tight tabular-nums",
          tone === "indigo" ? "text-[#5964d6]" : "text-[#171717]",
          tone === "green" ? "text-[#0f766e]" : "",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function FieldLabel({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-medium text-[#4c4c56]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function DateInput({ name, value }: { name: string; value: string }) {
  return (
    <div className="relative">
      <input
        name={name}
        type="date"
        defaultValue={value}
        className="h-10 min-w-0 w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-[#4f4f59] outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
      />
      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa3]" />
    </div>
  );
}
