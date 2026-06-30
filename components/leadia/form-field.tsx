import type { ReactNode } from "react";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#34343b]">{label}</p>
      <p className="mt-1 text-sm text-[#8b8b94]">{value}</p>
    </div>
  );
}
