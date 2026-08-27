import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AiDraft, TourSource } from "./tour-types";

type DraftReviewModalProps = {
  draft: AiDraft;
  sources: TourSource[];
  onDiscard: () => void;
  onValidate: () => void;
};

export function DraftReviewModal({
  draft,
  sources,
  onDiscard,
  onValidate,
}: DraftReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-[#e6e7eb] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#17171a]">
              Review AI draft before saving
            </h3>
            <p className="mt-1 text-sm text-[#62626b]">
              Nothing is written to Pages or Flows until you confirm.
            </p>
          </div>
          <div className="rounded-full bg-[#f4f4f5] px-3 py-1 text-sm font-semibold text-[#4d4f59]">
            {sources[0]?.title || "Draft"}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#e6e7eb] bg-[#fbfbfc] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#17171a]">
              <Check className="size-4 text-[#16a34a]" />
              Notes
            </div>
            <ul className="space-y-2 text-sm text-[#4d4f59]">
              {draft.notes.map((note) => (
                <li key={note} className="rounded-lg bg-white px-3 py-2">
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e6e7eb] bg-[#fbfbfc] p-4">
              <div className="mb-2 text-sm font-semibold text-[#17171a]">
                Pages
              </div>
              <ul className="space-y-2 text-sm text-[#4d4f59]">
                {draft.pages.map((page) => (
                  <li key={page.id} className="rounded-lg bg-white px-3 py-2">
                    {page.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#e6e7eb] bg-[#fbfbfc] p-4">
              <div className="mb-2 text-sm font-semibold text-[#17171a]">
                Flows
              </div>
              <ul className="space-y-2 text-sm text-[#4d4f59]">
                {draft.flows.map((flow) => (
                  <li key={flow.id} className="rounded-lg bg-white px-3 py-2">
                    {flow.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onDiscard}>
            Discard draft
          </Button>
          <Button type="button" onClick={onValidate}>
            Validate and save to studio
          </Button>
        </div>
      </div>
    </div>
  );
}
