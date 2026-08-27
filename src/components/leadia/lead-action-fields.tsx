import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function ModalFrame({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 px-4 py-20 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[470px] rounded-3xl bg-white p-6 shadow-xl">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-[#686872] hover:bg-[#f4f4f5]"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function FormInput({
  autoFocus,
  defaultValue,
  label,
  name,
  placeholder,
}: {
  autoFocus?: boolean;
  defaultValue?: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold text-[#4f4f59]">
        {label}
      </span>
      <input
        name={name}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
      />
    </label>
  );
}

export function FormSelect({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string;
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold text-[#4f4f59]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-center gap-4 py-3 text-sm">
      <span className="text-[#7b7b85]">{label}</span>
      <span className="truncate text-right font-semibold text-[#303038]">
        {value || "-"}
      </span>
    </div>
  );
}

export function IconButton({
  children,
  danger,
  label,
  onClick,
}: {
  children: ReactNode;
  danger?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-[#55555f] hover:bg-[#f4f4f5]",
        danger && "text-red-500 hover:bg-red-50",
      )}
    >
      {children}
    </button>
  );
}
