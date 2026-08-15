import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5964d6]">
          <span className="h-px w-7 bg-[#5964d6]" />
          {eyebrow}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

const tones = {
  brand: "bg-[#f1f2ff] text-[#5964d6]",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
};

export function DashboardMetric({
  label,
  value,
  icon,
  tone = "brand",
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <article className="soft-lift flex items-center gap-4 border-t-2 border-t-[#dfe2fa] bg-white px-1 py-4">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          tones[tone],
        )}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold tracking-[-0.025em] text-slate-900">
          {value}
        </p>
      </div>
    </article>
  );
}
