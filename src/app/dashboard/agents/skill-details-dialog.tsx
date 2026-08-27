import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { SkillPack } from "./skill-types";

export function SkillDetailsDialog({
  skill,
  language,
  onLanguageChange,
  onClose,
}: {
  skill: SkillPack | null;
  language: string;
  onLanguageChange: (language: string) => void;
  onClose: () => void;
}) {
  if (!skill) return null;

  const translation =
    skill.translations.find((item) => item.language === language) ??
    skill.translations[0];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[78vh] max-w-[540px] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-[#ececef] bg-white px-6 py-5">
          <DialogTitle className="pr-8 text-xl">{skill.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {skill.languages.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onLanguageChange(item)}
                className={cn(
                  "h-8 rounded-md border px-3 text-xs font-semibold",
                  language === item
                    ? "border-[#939ae2] bg-[#f5f6ff] text-[#5964d6]"
                    : "border-[#dedee3] bg-white text-[#777780]",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <DetailBlock title="1. Mission and value">
            {translation.mission}
          </DetailBlock>
          <DetailBlock title="2. When to activate this skill">
            {translation.activation}
          </DetailBlock>
          <DetailBlock title="3. Expected capabilities">
            {translation.capabilities}
          </DetailBlock>

          <div className="rounded-lg border border-[#e3e3e7] bg-[#f8f8f9] p-4">
            <p className="text-sm font-semibold text-[#303038]">Focus areas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skill.focusAreas.map((item) => (
                <Badge key={item} variant="outline" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailBlock({ title, children }: { title: string; children: string }) {
  return (
    <section className="rounded-lg border border-[#dedee3] bg-[#f6f6f7] p-4">
      <h3 className="text-sm font-semibold text-[#29292f]">{title}</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#55555f]">
        {children || "No content provided."}
      </p>
    </section>
  );
}
