import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { SkillPack } from "./skill-types";

export function SkillCard({
  skill,
  onDetails,
  onDelete,
}: {
  skill: SkillPack;
  onDetails: () => void;
  onDelete: () => void;
}) {
  const accent = skillAccents[skill.accent];
  const translation =
    skill.translations.find((item) => item.language === "EN") ??
    skill.translations[0];

  return (
    <article
      className={cn(
        "soft-lift flex min-h-[292px] flex-col rounded-3xl border p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        accent.shell,
      )}
    >
      <div className="flex flex-1 flex-col rounded-2xl border border-white/80 bg-white/90 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-base font-semibold text-[#222228]">
            {skill.label}
          </h2>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
              accent.badge,
            )}
          >
            {skill.source}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={cn("uppercase", accent.soft)}>
            {skill.packType}
          </Badge>
          <Badge variant="outline" className={cn("uppercase", accent.soft)}>
            {skill.executionMode}
          </Badge>
          {skill.languages.slice(0, 3).map((language) => (
            <Badge key={language} variant="outline" className="bg-white">
              {language}
            </Badge>
          ))}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#4f4f58]">
          <span className="font-semibold">1. Mission and value </span>
          {translation.mission}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {skill.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={cn(
                "truncate rounded-md border px-3 py-2 text-xs font-semibold",
                accent.soft,
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant={skill.source === "custom" ? "default" : "outline"}
          onClick={onDetails}
          className={cn(
            "h-9 flex-1",
            skill.source === "custom"
              ? "rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              : "rounded-xl border-slate-200 bg-white text-[#5964d6] hover:bg-[#f5f6ff]",
          )}
        >
          {skill.source === "custom" ? "Edit" : "Details"}
        </Button>

        {skill.source === "custom" ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete ${skill.label}`}
            className="h-9 w-10 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>
    </article>
  );
}

const skillAccents = {
  red: {
    shell: "border-rose-200 bg-rose-50/50",
    badge: "bg-rose-600 text-white",
    soft: "border-rose-200 bg-rose-50 text-rose-800",
  },
  green: {
    shell: "border-emerald-200 bg-emerald-50/50",
    badge: "bg-emerald-600 text-white",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  yellow: {
    shell: "border-amber-200 bg-amber-50/50",
    badge: "bg-amber-600 text-white",
    soft: "border-amber-200 bg-amber-50 text-amber-800",
  },
  cyan: {
    shell: "border-cyan-200 bg-cyan-50/50",
    badge: "bg-cyan-600 text-white",
    soft: "border-cyan-200 bg-cyan-50 text-cyan-800",
  },
  neutral: {
    shell: "border-[#e1e1e5] bg-[#fafafa]",
    badge: "bg-[#ececef] text-[#44444c]",
    soft: "border-[#dedee3] bg-white text-[#55555e]",
  },
  violet: {
    shell: "border-[#cfd3ed] bg-[#f5f6ff]",
    badge: "bg-[#5964d6] text-white",
    soft: "border-[#cfd3ed] bg-[#f1f2ff] text-[#5964d6]",
  },
};
