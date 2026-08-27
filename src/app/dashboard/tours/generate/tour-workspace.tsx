import {
  GitBranch,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TourSource } from "./tour-types";
import { Counter, SourceCard } from "./tour-ui";

type TourWorkspaceProps = {
  sources: TourSource[];
  replayId: string | null;
  isLoadingReplay: boolean;
  isAnalyzing: boolean;
  hasDraft: boolean;
  pageCount: number;
  flowCount: number;
  onOpenFlows: () => void;
  onAnalyze: () => void;
  onAddSource: () => void;
  onUpdateSource: (sourceId: string, updates: Partial<TourSource>) => void;
  onRemoveSource: (sourceId: string) => void;
};

export function TourWorkspace({
  sources,
  replayId,
  isLoadingReplay,
  isAnalyzing,
  hasDraft,
  pageCount,
  flowCount,
  onOpenFlows,
  onAnalyze,
  onAddSource,
  onUpdateSource,
  onRemoveSource,
}: TourWorkspaceProps) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e6e7eb] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-[#62626b]">
            <Sparkles className="size-4 text-[#6c63ff]" />
            Generate with AI
          </div>
          <h1 className="text-2xl font-semibold text-[#17171a]">
            Create a guided workflow from a replay or source
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={onOpenFlows}>
            <GitBranch className="mr-2 size-4" />
            Open flows
          </Button>
          <Button type="button" onClick={onAnalyze}>
            <Sparkles className="mr-2 size-4" />
            Analyze sources
          </Button>
        </div>
      </header>

      {replayId ? (
        <div className="rounded-2xl border border-[#e6e7eb] bg-[#f7f7fb] p-4 text-sm text-[#4d4f59]">
          <div className="flex items-center gap-2 font-semibold text-[#17171a]">
            <Video className="size-4" />
            Replay linked as AI source
          </div>
          <p className="mt-1">
            {isLoadingReplay
              ? "Loading replay video…"
              : "The replay is ready. Review the source details, then analyze it to generate the draft."}
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <SourcesPanel
          sources={sources}
          onAddSource={onAddSource}
          onUpdateSource={onUpdateSource}
          onRemoveSource={onRemoveSource}
        />
        <DraftStatus
          isAnalyzing={isAnalyzing}
          hasDraft={hasDraft}
          pageCount={pageCount}
          flowCount={flowCount}
        />
      </div>
    </>
  );
}

function SourcesPanel({
  sources,
  onAddSource,
  onUpdateSource,
  onRemoveSource,
}: Pick<
  TourWorkspaceProps,
  "sources" | "onAddSource" | "onUpdateSource" | "onRemoveSource"
>) {
  return (
    <section className="rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#17171a]">Sources</h2>
          <p className="text-sm text-[#62626b]">
            Upload a video, link an image, or paste HTML evidence.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onAddSource}>
          <Plus className="mr-2 size-4" />
          Add source
        </Button>
      </div>

      <div className="space-y-4">
        {sources.map((source, index) => (
          <SourceCard
            key={source.id}
            source={source}
            index={index}
            onUpdate={(updates) => onUpdateSource(source.id, updates)}
            onDelete={() => onRemoveSource(source.id)}
          />
        ))}
      </div>
    </section>
  );
}

function DraftStatus({
  isAnalyzing,
  hasDraft,
  pageCount,
  flowCount,
}: Pick<
  TourWorkspaceProps,
  "isAnalyzing" | "hasDraft" | "pageCount" | "flowCount"
>) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#17171a]">
          <RefreshCw className="size-4" />
          Draft insights
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Counter value={pageCount} label="pages" />
          <Counter value={flowCount} label="flows" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#17171a]">
          <Loader2
            className={cn("size-4", isAnalyzing ? "animate-spin" : "")}
          />
          Status
        </div>
        {isAnalyzing ? (
          <div className="rounded-xl bg-[#f7f7fb] p-4 text-sm text-[#4d4f59]">
            Source analysis in progress…
          </div>
        ) : hasDraft ? (
          <div className="rounded-xl bg-[#f0fff4] p-4 text-sm text-[#22643d]">
            A draft is ready. Review it before validation.
          </div>
        ) : (
          <div className="rounded-xl bg-[#f7f7fb] p-4 text-sm text-[#4d4f59]">
            No preview yet. Use Analyze sources to generate a draft.
          </div>
        )}
      </div>
    </section>
  );
}
