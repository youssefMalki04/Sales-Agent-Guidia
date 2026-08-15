"use client";

import {
  Check,
  FileCode2,
  FileImage,
  FileVideo2,
  GitBranch,
  ImageIcon,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";
import {
  ChangeEvent,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SourceType = "video" | "image" | "html";
type InputMode = "link" | "upload" | "paste";

type TourSource = {
  id: string;
  title: string;
  description: string;
  type: SourceType;
  inputMode: InputMode;
  url: string;
  fileName: string;
  rawHtml: string;
};

type ReplayStorage = {
  id: string;
  title: string;
  videoUrl: string;
};

type GeneratedPage = {
  id: string;
  title: string;
  key: string;
};

type GeneratedFlow = {
  id: string;
  title: string;
  key: string;
  description: string;
  businessGoal: string;
  safetyMode: "guide" | "confirm" | "auto";
  active: boolean;
  steps: string[];
};

type AiDraft = {
  pages: GeneratedPage[];
  actions: [];
  flows: GeneratedFlow[];
  notes: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEmptySource(index: number): TourSource {
  return {
    id: crypto.randomUUID(),
    title: `Source ${index}`,
    description: "",
    type: "video",
    inputMode: "upload",
    url: "",
    fileName: "",
    rawHtml: "",
  };
}

function createDraft(sources: TourSource[]): AiDraft {
  const validSources = sources.filter(
    (source) => source.url.trim() || source.fileName.trim() || source.rawHtml.trim(),
  );

  const sourceToUse = validSources[0] ?? sources[0];
  const title = sourceToUse?.title || "Generated workflow";
  const slug = slugify(title);

  return {
    pages: [
      {
        id: crypto.randomUUID(),
        title,
        key: `${slug}-page`,
      },
    ],
    actions: [],
    flows: [
      {
        id: crypto.randomUUID(),
        title,
        key: `demo-${slug}-recording`,
        description: `Workflow generated from "${title}". Focus on visible actions, forms, clicks and navigation.`,
        businessGoal: "Transform the supplied source into a clear guided workflow.",
        safetyMode: "guide",
        active: true,
        steps: [title],
      },
    ],
    notes: [
      `Source "${title}" has been analyzed.`,
      sourceToUse?.type === "video"
        ? "Video input preserves the global context. Screenshots can improve selector precision."
        : "The supplied source was converted into a workflow draft.",
    ],
  };
}

export default function GenerateTourPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
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
    setSources((current) => current.map((source) => (source.id === sourceId ? { ...source, ...updates } : source)));
  }

  function addSource() {
    setSources((current) => [...current, createEmptySource(current.length + 1)]);
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
    const hasContent = sources.some((source) => source.url.trim() || source.fileName.trim() || source.rawHtml.trim());

    if (!hasContent) {
      window.alert("Ajoute une vidéo, une image, une URL ou du HTML avant l’analyse.");
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
      const savedPages = JSON.parse(localStorage.getItem("guidia-pages") ?? "[]");
      const savedFlows = JSON.parse(localStorage.getItem("guidia-flows") ?? "[]");

      localStorage.setItem("guidia-pages", JSON.stringify([...savedPages, ...draft.pages]));
      localStorage.setItem("guidia-flows", JSON.stringify([...savedFlows, ...draft.flows]));
      localStorage.removeItem("guidia-selected-replay");

      showToast(`Workflow sauvegardé : ${draft.pages.length} page, 0 action et ${draft.flows.length} flow.`);
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
            <h1 className="text-2xl font-semibold text-[#17171a]">Create a guided workflow from a replay or source</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/qualification-flows?tab=flows")}>
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
              {isLoadingReplay ? "Loading replay video…" : "The replay is ready. Review the source details, then analyze it to generate the draft."}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-2xl border border-[#e6e7eb] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#17171a]">Sources</h2>
                <p className="text-sm text-[#62626b]">Upload a video, link an image, or paste HTML evidence.</p>
              </div>
              <Button type="button" variant="outline" onClick={addSource}>
                <Plus className="mr-2 size-4" />
                Add source
              </Button>
            </div>

            <div className="space-y-4">
              {sources.map((source, index) => (
                <SourceCard key={source.id} source={source} index={index} onUpdate={(updates) => updateSource(source.id, updates)} onDelete={() => removeSource(source.id)} />
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
                <Loader2 className={cn("size-4", isAnalyzing ? "animate-spin" : "")} />
                Status
              </div>
              {isAnalyzing ? (
                <div className="rounded-xl bg-[#f7f7fb] p-4 text-sm text-[#4d4f59]">Source analysis in progress…</div>
              ) : draft ? (
                <div className="rounded-xl bg-[#f0fff4] p-4 text-sm text-[#22643d]">A draft is ready. Review it before validation.</div>
              ) : (
                <div className="rounded-xl bg-[#f7f7fb] p-4 text-sm text-[#4d4f59]">No preview yet. Use Analyze sources to generate a draft.</div>
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

type SourceCardProps = {
  source: TourSource;
  index: number;
  onUpdate: (updates: Partial<TourSource>) => void;
  onDelete: () => void;
};

function SourceCard({ source, index, onUpdate, onDelete }: SourceCardProps) {
  return (
    <div className="rounded-2xl border border-[#e6e7eb] bg-[#fcfcfd] p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#17171a]">
          {source.type === "video" ? <FileVideo2 className="size-4" /> : source.type === "image" ? <FileImage className="size-4" /> : <FileCode2 className="size-4" />}
          {source.title || `Source ${index + 1}`}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <SourceTypeButton label="Video" active={source.type === "video"} icon={<Video className="size-4" />} onClick={() => onUpdate({ type: "video", inputMode: "upload" })} />
        <SourceTypeButton label="Image" active={source.type === "image"} icon={<ImageIcon className="size-4" />} onClick={() => onUpdate({ type: "image", inputMode: "link" })} />
        <SourceTypeButton label="HTML" active={source.type === "html"} icon={<FileCode2 className="size-4" />} onClick={() => onUpdate({ type: "html", inputMode: "link" })} />
      </div>

      <div className="space-y-3">
        <input
          value={source.title}
          onChange={(event) => onUpdate({ title: event.target.value })}
          placeholder={`Source ${index + 1}`}
          className="h-10 w-full rounded-lg border border-[#dedee3] bg-white px-3 text-sm font-medium outline-none focus:border-[#94949d]"
        />

        <textarea
          value={source.description}
          onChange={(event) => onUpdate({ description: event.target.value })}
          placeholder="Describe this source: what workflow does it show? What should the AI focus on?"
          className="min-h-24 w-full resize-y rounded-lg border border-[#dedee3] bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-[#94949d]"
        />

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onUpdate({ inputMode: "link" })} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", source.inputMode === "link" ? "border-[#d8d8dd] bg-white text-[#24242a]" : "border-transparent bg-[#f3f3f4] text-[#85858e]")}>
            Link
          </button>
          <button type="button" onClick={() => onUpdate({ inputMode: source.type === "html" ? "paste" : "upload" })} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", source.inputMode === (source.type === "html" ? "paste" : "upload") ? "border-[#d8d8dd] bg-white text-[#24242a]" : "border-transparent bg-[#f3f3f4] text-[#85858e]")}>
            {source.type === "html" ? "Paste" : "Upload"}
          </button>
        </div>

        {source.type === "video" && (
          <>
            {source.inputMode === "link" ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#dedee3] bg-white px-3 py-2">
                <Link2 className="size-4 text-[#62626b]" />
                <input value={source.url} onChange={(event) => onUpdate({ url: event.target.value })} placeholder="https://..." className="w-full bg-transparent text-sm outline-none" />
              </div>
            ) : (
              <FileUploader accept="video/mp4,video/webm,video/quicktime" label="Upload a replay or clip" fileName={source.fileName} onFile={(file) => onUpdate({ fileName: file.name, url: URL.createObjectURL(file) })} />
            )}
          </>
        )}

        {source.type === "image" && (
          <>
            {source.inputMode === "link" ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#dedee3] bg-white px-3 py-2">
                <Link2 className="size-4 text-[#62626b]" />
                <input value={source.url} onChange={(event) => onUpdate({ url: event.target.value })} placeholder="https://..." className="w-full bg-transparent text-sm outline-none" />
              </div>
            ) : (
              <FileUploader accept="image/*" label="Upload an image" fileName={source.fileName} onFile={(file) => onUpdate({ fileName: file.name, url: URL.createObjectURL(file) })} />
            )}
          </>
        )}

        {source.type === "html" && (
          <>
            {source.inputMode === "paste" ? (
              <textarea value={source.rawHtml} onChange={(event) => onUpdate({ rawHtml: event.target.value })} placeholder="Paste HTML here..." className="min-h-32 w-full resize-y rounded-lg border border-[#dedee3] bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#94949d]" />
            ) : (
              <FileUploader accept=".html,text/html" label="Upload an HTML file" fileName={source.fileName} onFile={(file) => onUpdate({ fileName: file.name, rawHtml: "" })} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

type SourceTypeButtonProps = {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
};

function SourceTypeButton({ label, active, icon, onClick }: SourceTypeButtonProps) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold", active ? "border-[#17171a] bg-[#17171a] text-white" : "border-[#dedee3] bg-white text-[#4d4f59]")}>
      {icon}
      {label}
    </button>
  );
}

type FileUploaderProps = {
  accept: string;
  label: string;
  fileName: string;
  onFile: (file: File) => void;
};

function FileUploader({ accept, label, fileName, onFile }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    onFile(file);
    event.target.value = "";
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-12 w-full items-center justify-between rounded-lg border border-dashed border-[#dedee3] bg-[#f4f4f5] px-4 text-left text-sm text-[#4d4f59]">
        <span>{label}</span>
        <span className="font-medium text-[#17171a]">{fileName || "No file selected"}</span>
      </button>
    </>
  );
}

type DraftReviewModalProps = {
  draft: AiDraft;
  sources: TourSource[];
  onDiscard: () => void;
  onValidate: () => void;
};

function DraftReviewModal({ draft, sources, onDiscard, onValidate }: DraftReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-[#e6e7eb] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#17171a]">Review AI draft before saving</h3>
            <p className="mt-1 text-sm text-[#62626b]">Nothing is written to Pages or Flows until you confirm.</p>
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
              <div className="mb-2 text-sm font-semibold text-[#17171a]">Pages</div>
              <ul className="space-y-2 text-sm text-[#4d4f59]">
                {draft.pages.map((page) => (
                  <li key={page.id} className="rounded-lg bg-white px-3 py-2">
                    {page.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#e6e7eb] bg-[#fbfbfc] p-4">
              <div className="mb-2 text-sm font-semibold text-[#17171a]">Flows</div>
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

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-[#e6e7eb] bg-[#fbfbfc] p-3 text-sm text-[#4d4f59]">
      <div className="text-2xl font-semibold text-[#17171a]">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] rounded-full bg-[#17171a] px-4 py-2 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
