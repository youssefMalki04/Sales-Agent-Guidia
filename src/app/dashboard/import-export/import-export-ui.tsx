import type { ReactNode } from "react";

export function Validation({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "red" | "amber";
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className={`rounded-lg p-3 ${styles[tone]}`}>
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase">{label}</p>
    </div>
  );
}
export function Tip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <p>{text}</p>
    </div>
  );
}
