import { ArrowDownRight, ArrowUpRight, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)] sm:p-6">
      <div>
        <h2 className="font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
export function Change({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`flex items-center gap-1 text-[11px] font-bold ${positive ? "text-emerald-600" : "text-indigo-600"}`}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {Math.abs(value)}%
    </span>
  );
}
export function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
export function Recommendation({
  title,
  text,
  impact,
}: {
  title: string;
  text: string;
  impact: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-[#fafafd] p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
          <Lightbulb className="size-4" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase text-[#5964d6] ring-1 ring-[#e1e4f8]">
              {impact}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#707079]">{text}</p>
        </div>
      </div>
    </article>
  );
}
