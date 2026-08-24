import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WorkspaceCard() {
  return (
    <div className="mt-7">
      <article className="w-full max-w-[420px] overflow-hidden rounded-lg border border-[#e5e5e8] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="h-[6px] bg-[#173f8a]" />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[#2463eb] text-lg font-semibold text-white">
                L
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-[-0.01em] text-[#202026]">
                  Leadia Sales Workspace
                </h2>
                <p className="mt-1 text-sm font-medium text-[#9a9aa3]">
                  sales-ai-agent
                </p>
              </div>
            </div>

            <span className="mt-[62px] shrink-0 text-sm font-medium text-[#8e8e96]">
              6/30/2026
            </span>
          </div>

          <div className="mt-4 border-t border-[#e6e6e9]" />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="h-9 rounded-md border-[#dfdfe3]">
              <Eye className="size-4 text-[#777780]" />
              View details
            </Button>
            <Button variant="outline" className="h-9 rounded-md border-[#dfdfe3]">
              <Pencil className="size-4 text-[#777780]" />
              Edit
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-md border-[#f0dba5] bg-[#fff8e8] px-4 text-sm font-semibold text-[#c28c2a] hover:bg-[#fff4d9]"
            >
              Disable
            </Button>
            <Button className="h-9 rounded-md bg-[#e54d4d] px-4 text-sm font-semibold text-white hover:bg-[#d84242]">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
