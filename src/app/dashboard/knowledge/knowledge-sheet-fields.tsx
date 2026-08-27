import type React from "react";

import { cn } from "@/lib/utils";
import type { Scope } from "./knowledge-data";
import { categories } from "./knowledge-data";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
export function ChoiceCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white p-4 text-left transition",
        active
          ? "border-[#939ae2] bg-[#f5f6ff] shadow-[inset_0_0_0_1px_#939ae2]"
          : "border-[#dedee3] hover:border-[#b8b8bf]",
      )}
    >
      <p className={cn("font-semibold", active && "text-[#5964d6]")}>{title}</p>
      <p className="mt-1 text-sm leading-5 text-[#777780]">{description}</p>
    </button>
  );
}
export function ScopeSelect({
  value,
  onChange,
}: {
  value: Scope;
  onChange: (value: Scope) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Scope)}
      className="h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
    >
      <option value="Support">Support</option>
      <option value="Demo">Demo</option>
      <option value="Training">Training</option>
      <option value="Pre-sales">Pre-sales</option>
    </select>
  );
}
export function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
    >
      <option value="">Choose a category...</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
