import { CalendarDays } from "lucide-react";
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
  return (
    <div
      className={cn(
        "soft-lift rounded-2xl border p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]",
        tone === "green"
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-200/80 bg-white",
        tone === "neutral" ? "bg-[#fafafd]" : "",
      )}
    >
      <p
        className={cn(
          "text-3xl font-semibold",
          tone === "indigo" ? "text-[#5964d6]" : "text-[#171717]",
          tone === "green" ? "text-[#0f766e]" : "",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-[#686872]">{label}</p>
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
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#4c4c56]">
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
        className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-[#4f4f59] outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
      />
      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa3]" />
    </div>
  );
}
