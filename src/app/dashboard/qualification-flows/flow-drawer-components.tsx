import type React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function DrawerHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between border-b border-[#e1e1e5] px-6 py-4">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-[#202026]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#777780]">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex size-9 items-center justify-center rounded-md border border-[#dedee3] text-[#666670] hover:bg-[#f5f5f6]"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-sm font-semibold text-[#34343b]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function DetailField({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("py-4", !last && "border-b border-[#e5e5e8]")}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#85858e]">
        {label}
      </p>

      <div className="mt-2 text-sm leading-6 text-[#303038]">{children}</div>
    </div>
  );
}

export function IconButton({
  label,
  danger = false,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition",
        danger
          ? "text-[#ca5656] hover:bg-[#fff0f0]"
          : "text-[#44444c] hover:bg-[#efeff1]",
      )}
    >
      {children}
    </button>
  );
}
