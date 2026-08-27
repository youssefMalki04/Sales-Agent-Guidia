import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailField, DrawerHeader } from "./flow-drawer-components";
import type { QualificationFlow as Flow, TourPage } from "./flow-types";

export function FlowDetailsDrawer({
  flow,
  pages,
  onClose,
  onEdit,
}: {
  flow: Flow;
  pages: TourPage[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const entryPages = pages.filter((page) =>
    flow.entryPageIds.includes(page.id),
  );

  return (
    <>
      <DrawerHeader title={flow.title} subtitle="View" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <DetailField label="Key">
          <span className="font-mono text-sm">{flow.key}</span>
        </DetailField>

        <DetailField label="Description">{flow.description || "—"}</DetailField>

        <DetailField label="Business goal">
          {flow.businessGoal || "—"}
        </DetailField>

        <DetailField label="Tags">
          {flow.tags.length ? flow.tags.join(", ") : "—"}
        </DetailField>

        <DetailField label="Safety mode">
          <span className="capitalize">{flow.safetyMode}</span>
        </DetailField>

        <DetailField label="Flow active">
          {flow.active ? <Check className="size-4" /> : "No"}
        </DetailField>

        <DetailField label="Entry pages">
          {entryPages.length ? (
            <div className="space-y-1">
              {entryPages.map((page) => (
                <p key={page.id}>{page.title}</p>
              ))}
            </div>
          ) : (
            "—"
          )}
        </DetailField>

        <DetailField label="Flow steps" last>
          {flow.steps.length ? (
            <ol className="space-y-1">
              {flow.steps.map((step, index) => (
                <li key={step.id}>
                  {index + 1}. {step.title}
                </li>
              ))}
            </ol>
          ) : (
            "—"
          )}
        </DetailField>
      </div>

      <div className="flex items-center justify-between border-t border-[#e1e1e5] bg-[#fafafa] px-6 py-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>

        <Button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          Edit
        </Button>
      </div>
    </>
  );
}
