"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { AiDraft, ReplayStorage, TourSource } from "./tour-types";
import { createDraft, createEmptySource } from "./tour-utils";
import { DraftReviewModal, Toast } from "./tour-ui";
import { TourWorkspace } from "./tour-workspace";

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
        <TourWorkspace
          sources={sources}
          replayId={replayId}
          isLoadingReplay={isLoadingReplay}
          isAnalyzing={isAnalyzing}
          hasDraft={Boolean(draft)}
          pageCount={pageCount}
          flowCount={flowCount}
          onOpenFlows={() =>
            router.push("/dashboard/qualification-flows?tab=flows")
          }
          onAnalyze={analyzeSources}
          onAddSource={addSource}
          onUpdateSource={updateSource}
          onRemoveSource={removeSource}
        />

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
