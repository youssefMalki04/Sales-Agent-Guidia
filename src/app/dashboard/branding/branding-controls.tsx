import type React from "react";
import { ChevronDown, Palette } from "lucide-react";

import { cx } from "./branding-data";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-zinc-500">
      {children}
    </label>
  );
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]",
        props.className,
      )}
    />
  );
}
export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]",
        props.className,
      )}
    />
  );
}
export function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}
export function Button({
  children,
  onClick,
  dark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
        dark
          ? "bg-[#5964d6] text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]",
      )}
    >
      {children}
    </button>
  );
}
export function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Palette;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all",
        active
          ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,.10)]"
          : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}
