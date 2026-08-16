"use client";

import type { ReactNode } from "react";

import type { Mode } from "./inbox-types";

export function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#f1f2ff] font-bold text-[#5964d6] ring-1 ring-[#e1e4f8] ${large ? "size-14 text-base" : "size-10 text-xs"}`}
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function ModeBadge({ mode }: { mode: Mode }) {
  const styles: Record<Mode, string> = {
    ai: "bg-indigo-50 text-indigo-700",
    human: "bg-emerald-50 text-emerald-700",
    waiting: "bg-amber-50 text-amber-700",
    resolved: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${styles[mode]}`}
    >
      {mode}
    </span>
  );
}
export function Info({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-5 border-t border-[#eeeeF1] pt-5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#95959e]">
        {title}
      </h3>
      <div className="mt-3 text-xs leading-5 text-[#5f5f68]">{children}</div>
    </section>
  );
}
export function InfoMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#fafafd] p-3 ring-1 ring-slate-100">
      <div className="flex items-center gap-1.5 text-[10px] uppercase text-[#898992]">
        {icon}
        {label}
      </div>
      <p className="mt-2 truncate text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}
