import { AlertTriangle } from "lucide-react";

import type { LeadObjection } from "@/types/lead";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<LeadObjection["category"], string> = {
  price: "Prix",
  security: "Securite",
  integration: "Integration",
  competitor: "Concurrence",
  timing: "Timing",
  human_request: "Demande humaine",
};

const STATUS_LABELS: Record<LeadObjection["status"], string> = {
  detected: "Detectee",
  answered: "Traitee",
  needs_follow_up: "A suivre",
  resolved: "Resolue",
};

const STATUS_STYLES: Record<LeadObjection["status"], string> = {
  detected: "border-amber-200 bg-amber-50 text-amber-700",
  answered: "border-blue-200 bg-blue-50 text-blue-700",
  needs_follow_up: "border-red-200 bg-red-50 text-red-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

type LeadObjectionsListProps = {
  objections?: LeadObjection[] | null;
  className?: string;
};

export function LeadObjectionsList({ objections, className }: LeadObjectionsListProps) {
  if (!objections || objections.length === 0) {
    return (
      <div className={cn("rounded-md border border-dashed p-4 text-sm text-muted-foreground", className)}>
        Aucune objection detectee.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {objections.map((objection, index) => (
        <div
          key={`${objection.category}-${objection.status}-${objection.evidence ?? index}`}
          className="rounded-md border bg-card p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <AlertTriangle className="size-4 text-muted-foreground" aria-hidden="true" />
            <Badge variant="outline">{CATEGORY_LABELS[objection.category]}</Badge>
            <Badge
              variant="outline"
              className={STATUS_STYLES[objection.status]}
            >
              {STATUS_LABELS[objection.status]}
            </Badge>
          </div>

          {objection.evidence ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {objection.evidence}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
