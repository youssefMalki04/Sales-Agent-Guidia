import type React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {children}
    </div>
  );
}

export function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between border-b border-[#e1e1e5] px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-[#202026]">{title}</h2>

        {subtitle && <p className="mt-1 text-xs text-[#777780]">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex size-9 items-center justify-center rounded-md border border-[#dedee3] text-[#686872] hover:bg-[#f5f5f6]"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

export function ActionButton({
  children,
  title,
  danger = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition",
        danger
          ? "text-[#c85454] hover:bg-[#fff0f0]"
          : "text-[#414149] hover:bg-[#efeff1]",
        disabled && "cursor-not-allowed opacity-35 hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

export function InformationCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#e1e1e5] bg-[#fafafa] p-4">
      <p className="text-xs font-semibold uppercase text-[#85858e]">{label}</p>

      <p className="mt-2 text-sm font-semibold capitalize text-[#303038]">
        {value}
      </p>
    </div>
  );
}

export function DraftCounter({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <span className="rounded-full border border-[#dedee3] bg-white px-3 py-1 text-xs font-semibold text-[#50505a]">
      {value} {label}
    </span>
  );
}

export function DraftCard({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-[120px] rounded-lg border border-[#e1e1e5] bg-white">
      <div className="border-b border-[#e1e1e5] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#303038]">
          {title} <span className="ml-1 text-xs text-[#85858e]">{count}</span>
        </h3>
      </div>

      <div className="p-4 text-sm text-[#50505a]">{children}</div>
    </section>
  );
}
