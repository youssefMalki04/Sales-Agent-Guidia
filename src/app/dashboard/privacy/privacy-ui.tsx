import type { ReactNode } from "react";

export function Card({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)] sm:p-6">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
          {icon}
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-[#7b7b84]">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <b className="block text-sm">{label}</b>
        <span className="mt-1 block text-xs leading-5 text-[#85858e]">
          {description}
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#5964d6]" : "bg-[#d7d7dc]"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
        {label}
      </span>
      {children}
    </label>
  );
}
export function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="soft-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]">
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff]">
        {icon}
      </span>
      <div>
        <p className="text-xs text-[#85858e]">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </article>
  );
}
