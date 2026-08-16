import type { ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export function DeviceButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-lg transition ${
        active
          ? "bg-[#5964d6] text-white shadow-sm"
          : "text-slate-400 hover:bg-[#f1f2ff] hover:text-[#5964d6]"
      }`}
    >
      {icon}
    </button>
  );
}
