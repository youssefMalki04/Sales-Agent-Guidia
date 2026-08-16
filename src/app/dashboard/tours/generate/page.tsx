"use client";

import {
  GitBranch,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Video,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiDraft, ReplayStorage, TourSource } from "./tour-types";
import { createDraft, createEmptySource } from "./tour-utils";
import { Counter, DraftReviewModal, SourceCard, Toast } from "./tour-ui";

export default function GenerateTourPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}
    >
      <GenerateTourContent />
    </Suspense>
  );
}

function GenerateTourContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const replayId = searchParams.get("replayId");

  const [sources, setSources] = useState<TourSource[]>([createEmptySource(1)]);
  const [isLoadingReplay, setIsLoadingReplay] = useState(Boolean(replayId));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [draft, setDraft] = useState<AiDraft | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const pageCount = useMemo(() => {
    try {
      const pages = JSON.parse(localStorage.getItem("guidia-pages") ?? "[]");
      return 12 + pages.length;
    } catch {
      return 12;
    }
    // Re-read persisted counts after a draft is accepted or discarded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const flowCount = useMemo(() => {
    try {
      const flows = JSON.parse(localStorage.getItem("guidia-flows") ?? "[]");
      return 10 + flows.length;
    } catch {
      return 10;
    }
    // Re-read persisted counts after a draft is accepted or discarded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  useEffect(() => {
    if (!replayId) {
      return;
    }

    const loadReplay = window.setTimeout(() => {
      try {
        const storedReplay = localStorage.getItem("guidia-selected-replay");

        if (!storedReplay) {
          setIsLoadingReplay(false);
          return;
        }

        const replay = JSON.parse(storedReplay) as ReplayStorage;

        if (replay.id !== replayId) {
          setIsLoadingReplay(false);
          return;
        }

        setSources([
          {
            id: crypto.randomUUID(),
            title: replay.title,
            description: `Workflow replay: ${replay.title}. Focus on each visible user action, including clicks, forms and navigation, and turn them into guided flow steps.`,
            type: "video",
            inputMode: "link",
            url: replay.videoUrl,
            fileName: "",
            rawHtml: "",
          },
        ]);
      } catch (error) {
        console.error("Impossible de charger la vidéo :", error);
      } finally {
        setIsLoadingReplay(false);
      }
    }, 0);

    return () => window.clearTimeout(loadReplay);
  }, [replayId]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3500);
  }

  function updateSource(sourceId: string, updates: Partial<TourSource>) {
    setSources((current) =>
      current.map((source) =>
        source.id === sourceId ? { ...source, ...updates } : source,
      ),
    );
  }

  function addSource() {
    setSources((current) => [
      ...current,
      createEmptySource(current.length + 1),
    ]);
  }

  function removeSource(sourceId: string) {
    setSources((current) => {
      if (current.length === 1) {
        return current;
      }
      return current.filter((source) => source.id !== sourceId);
    });
  }

  function analyzeSources() {
    const hasContent = sources.some(
      (source) =>
        source.url.trim() || source.fileName.trim() || source.rawHtml.trim(),
    );

    if (!hasContent) {
      window.alert(
        "Ajoute une vidéo, une image, une URL ou du HTML avant l’analyse.",
      );
      return;
    }

    setIsAnalyzing(true);
    window.setTimeout(() => {
      setDraft(createDraft(sources));
      setIsAnalyzing(false);
    }, 1800);
  }

  function discardDraft() {
    setDraft(null);
  }

  function validateDraft() {
    if (!draft) {
      return;
    }

    try {
      const savedPages = JSON.parse(
        localStorage.getItem("guidia-pages") ?? "[]",
      );
      const savedFlows = JSON.parse(
        localStorage.getItem("guidia-flows") ?? "[]",
      );

      localStorage.setItem(
        "guidia-pages",
        JSON.stringify([...savedPages, ...draft.pages]),
      );
      localStorage.setItem(
        "guidia-flows",
        JSON.stringify([...savedFlows, ...draft.flows]),
      );
      localStorage.removeItem("guidia-selected-replay");

      showToast(
        `Workflow sauvegardé : ${draft.pages.length} page, 0 action et ${draft.flows.length} flow.`,
      );
      setDraft(null);

      window.setTimeout(() => {
        router.push("/dashboard/qualification-flows?tab=flows");
      }, 900);
    } catch (error) {
      console.error(error);
      window.alert("Impossible de sauvegarder le workflow.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fbfbfc] px-5 py-7 sm:px-8 xl:px-14">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e6e7eb] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
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
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push("/dashboard/qualification-flows?tab=flows")
              }
            >
              <GitBranch className="mr-2 size-4" />
              Open flows
            </Button>
            <Button type="button" onClick={analyzeSources}>
              <Sparkles className="mr-2 size-4" />
              Analyze sources
            </Button>
          </div>
        </div>

        {replayId && (
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
        )}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#17171a]">
                  Sources
                </h2>
                <p className="text-sm text-[#62626b]">
                  Upload a video, link an image, or paste HTML evidence.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={addSource}>
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
                  onUpdate={(updates) => updateSource(source.id, updates)}
                  onDelete={() => removeSource(source.id)}
                />
              ))}
            </div>
          </section>

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
              ) : draft ? (
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
        </div>

        {draft && (
          <DraftReviewModal
            draft={draft}
            sources={sources}
            onDiscard={discardDraft}
            onValidate={validateDraft}
          />
        )}

        {toast && <Toast message={toast} />}
      </div>
    </main>
  );
}
