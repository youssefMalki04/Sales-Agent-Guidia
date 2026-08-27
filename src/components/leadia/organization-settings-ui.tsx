import { Copy, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import { labelClass } from "./organization-data";

export function FormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#333333]">{label}</p>
      <p className="mt-1 break-all text-sm text-[#777782]">{value}</p>
    </div>
  );
}

export function SettingsCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-[20px] border border-[#e4e6ee] bg-white p-6 shadow-[0_10px_35px_rgba(44,48,75,.04)]">
      <h2 className="text-lg font-bold tracking-[-.02em] text-[#383c4c]">
        {title}
      </h2>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export function CredentialRow({
  actionLabel,
  label,
  onAction,
  onCopy,
  value,
}: {
  actionLabel?: string;
  label: string;
  onAction?: () => void;
  onCopy: () => void;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className={labelClass}>{label}</p>
        {actionLabel ? (
          <button
            className="text-xs font-semibold text-[#55555f] hover:text-[#171717]"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="flex gap-2">
        <div className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-[#e3e5ed] bg-[#f7f8fb] px-3 font-mono text-sm text-[#3d4151]">
          <KeyRound className="mr-2 size-4 text-[#777782]" />
          <span className="truncate">{value}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl"
          onClick={onCopy}
        >
          <Copy className="size-4" />
          Copy
        </Button>
      </div>
    </div>
  );
}
