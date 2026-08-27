import { ChevronLeft, ChevronRight, Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { TraceStatus, TraceType } from "./memory-data";

export function MemoryMetric({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: typeof Database;
}) {
  return (
    <div className="min-w-20 rounded-2xl border border-white bg-white/80 px-3 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-[#5964d6]" />
        <p className="text-lg font-semibold text-slate-950">{value}</p>
      </div>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

export function ConfigGroup({
  title,
  values,
  onChange,
}: {
  title: string;
  values: Record<TraceType, boolean>;
  onChange: (type: TraceType, checked: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafafd] p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {(Object.keys(values) as TraceType[]).map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm capitalize"
          >
            <input
              type="checkbox"
              checked={values[type]}
              onChange={(e) => onChange(type, e.target.checked)}
              className="accent-[#5964d6]"
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
}

export function NumberField({
  label,
  value,
  step,
  helper,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  helper?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl border border-slate-100 bg-[#fafafd] p-5">
      <span className="text-sm font-semibold">{label}</span>
      <Input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 rounded-xl border-slate-200 bg-white"
      />
      {helper ? <p className="mt-2 text-xs text-[#8a8a93]">{helper}</p> : null}
    </label>
  );
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  onPageChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#ececef] bg-[#fafafa] px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex items-center gap-2 text-sm text-[#777780]">
        <span>Per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 rounded-md border border-[#dedee3] bg-white px-3"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <Badge variant="outline" className="h-9 bg-white px-4">
        {page} / {totalPages}
      </Badge>
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

export function TypeBadge({ type }: { type: TraceType }) {
  const styles: Record<TraceType, string> = {
    pitfall: "border-amber-200 bg-amber-50 text-amber-700",
    summary: "border-[#dedee3] bg-[#f4f4f5] text-[#55555f]",
    selector: "border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]",
    strategy: "border-cyan-200 bg-cyan-50 text-cyan-700",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full", styles[type])}>
      {type}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: TraceStatus }) {
  const styles: Record<TraceStatus, string> = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    promoted: "border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full", styles[status])}>
      {status}
    </Badge>
  );
}
