import type React from "react";

import { cn } from "@/lib/utils";

import type { SkillForm } from "./skill-types";

export function TranslationSummary({
  language,
  form,
}: {
  language: string;
  form: SkillForm;
}) {
  return (
    <div className="rounded-lg border border-[#e1e1e5] bg-white p-4">
      <p className="text-sm font-semibold">{language}</p>
      <p className="mt-3 text-sm leading-6 text-[#5f5f68]">
        {form.mission || "Missing translation"}
      </p>
      {form.activation ? (
        <p className="mt-2 text-sm leading-6 text-[#5f5f68]">
          {form.activation}
        </p>
      ) : null}
      {form.capabilities ? (
        <p className="mt-2 text-sm leading-6 text-[#5f5f68]">
          {form.capabilities}
        </p>
      ) : null}
    </div>
  );
}

export function ChoiceCard({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left transition",
        active
          ? "border-[#939ae2] bg-[#f5f6ff] text-[#5964d6] shadow-[inset_0_0_0_1px_#939ae2]"
          : "border-[#dfdfe3] bg-white hover:bg-[#f8f8f9]",
      )}
    >
      <p className="font-mono text-sm font-semibold text-[#28282e]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-[#777780]">{description}</p>
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ececef] py-3 text-sm">
      <span className="text-[#7b7b85]">{label}</span>
      <span className="text-right font-mono font-semibold text-[#303038]">
        {value}
      </span>
    </div>
  );
}
