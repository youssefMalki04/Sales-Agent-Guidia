"use client";

import {
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  GitBranch,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ReplayAiDraft as AiDraft,
  ReplayStatus,
  VideoReplay,
} from "./replay-types";

/* -------------------------------------------------------------------------- */
/*                               INITIAL DATA                                 */
/* -------------------------------------------------------------------------- */

const initialReplays: VideoReplay[] = [
  {
    id: "replay-1",
    title: "Guidia - Console — 5/22/2026, 12:49:18 PM",
    status: "ready",
    duration: "0:05",
    size: "638.9 KB",
    access: "Public link",
    createdAt: "22/05/2026 11:49:17",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "replay-2",
    title: "Guidia - Console — 20/05/2026 22:42:20",
    status: "ready",
    duration: "0:30",
    size: "4.5 MB",
    access: "Public link",
    createdAt: "20/05/2026 22:42:20",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Retained for the inline workflow generator when that entry point is enabled.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createDraft(replay: VideoReplay): AiDraft {
  const slug = slugify(replay.title);

  const pageId = crypto.randomUUID();

  return {
    replay,

    page: {
      id: pageId,
      title: replay.title,
      key: `${slug}-page`,
    },

    flow: {
      id: crypto.randomUUID(),
      title: replay.title,
      key: `demo-${slug}-recording`,
      description: `Workflow replay: ${replay.title}. Focus on each visible user action, including clicks, forms and navigation, and transform them into guided flow steps.`,
      businessGoal: `Replay the workflow ${replay.title} and transform the visible actions into a guided user journey.`,
      tags: [
        "generated-ai",
        "demo-derived",
        "demo-source-recording",
        slug,
        "from-recording",
      ],
      safetyMode: "guide",
      active: true,
      entryPageId: pageId,
      steps: [replay.title],
    },

    notes: [
      `Source "${replay.title}": video-only input keeps context, but adding screenshots can improve action precision.`,
      `Source "${replay.title}": draft generated from replay metadata.`,
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function VideoReplaysPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [replays, setReplays] = useState<VideoReplay[]>(initialReplays);

  const [statusFilter, setStatusFilter] = useState<"all" | ReplayStatus>("all");

  const [selectedReplay, setSelectedReplay] = useState<VideoReplay | null>(
    null,
  );

  const [isImporting, setIsImporting] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const filteredReplays = useMemo(() => {
    if (statusFilter === "all") {
      return replays;
    }

    return replays.filter((replay) => replay.status === statusFilter);
  }, [replays, statusFilter]);
  const readyReplaysCount = replays.filter(
    (replay) => replay.status === "ready",
  ).length;

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleVideoImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      window.alert("Choisis un fichier vidéo valide.");
      event.target.value = "";
      return;
    }

    setIsImporting(true);

    const url = URL.createObjectURL(file);

    const newReplay: VideoReplay = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      status: "processing",
      duration: "—",
      size: formatFileSize(file.size),
      access: "Local file",
      createdAt: new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date()),
      videoUrl: url,
    };

    setReplays((current) => [newReplay, ...current]);

    window.setTimeout(() => {
      setReplays((current) =>
        current.map((replay) =>
          replay.id === newReplay.id
            ? {
                ...replay,
                status: "ready",
                duration: "0:15",
              }
            : replay,
        ),
      );

      setIsImporting(false);
      showToast("Vidéo importée avec succès.");
    }, 1500);

    event.target.value = "";
  }

  function deleteReplay(replayId: string) {
    const confirmed = window.confirm("Supprimer définitivement cette vidéo ?");

    if (!confirmed) {
      return;
    }

    setReplays((current) => current.filter((replay) => replay.id !== replayId));

    showToast("Vidéo supprimée.");
  }

  function openWorkflowGenerator(replay: VideoReplay) {
    localStorage.setItem(
      "guidia-selected-replay",
      JSON.stringify({
        id: replay.id,
        title: replay.title,
        videoUrl: replay.videoUrl,
      }),
    );

    router.push(
      `/dashboard/tours/generate?replayId=${encodeURIComponent(replay.id)}`,
    );
  }

  function refreshReplays() {
    showToast("Liste des vidéos actualisée.");
  }

  return (
    <main className="min-h-[calc(100vh-70px)] bg-white px-5 py-8 sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px]">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Video className="size-3.5" /> Conversation intelligence
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Replay sessions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review recorded journeys and turn real user behavior into reusable
              qualification flows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <ReplayMetric value={replays.length} label="Sessions" />
            <ReplayMetric value={readyReplaysCount} label="Ready" />
          </div>
        </header>
        <VideoReplayToolbar
          statusFilter={statusFilter}
          isImporting={isImporting}
          onStatusChange={setStatusFilter}
          onImport={handleImportClick}
          onRefresh={refreshReplays}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleVideoImport}
          className="hidden"
        />

        <ReplayTable
          replays={filteredReplays}
          onPreview={setSelectedReplay}
          onGenerate={openWorkflowGenerator}
          onDelete={deleteReplay}
        />
      </div>

      {selectedReplay && (
        <VideoPreviewModal
          replay={selectedReplay}
          onClose={() => setSelectedReplay(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                              TOP TOOLBAR                                   */
/* -------------------------------------------------------------------------- */

function ReplayMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafafd] px-4 py-3">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function VideoReplayToolbar({
  statusFilter,
  isImporting,
  onStatusChange,
  onImport,
  onRefresh,
}: {
  statusFilter: "all" | ReplayStatus;
  isImporting: boolean;
  onStatusChange: (status: "all" | ReplayStatus) => void;
  onImport: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-[#fafafd] p-3">
      <Button
        type="button"
        className="h-10 gap-2 rounded-xl bg-[#5964d6] text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
      >
        <span className="size-3 rounded-full border-2 border-white/80" />
        Record
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onImport}
        disabled={isImporting}
        className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-5 text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
      >
        {isImporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        Import a video
      </Button>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value as "all" | ReplayStatus)
        }
        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none"
      >
        <option value="all">All statuses</option>
        <option value="ready">Ready</option>
        <option value="processing">Processing</option>
        <option value="failed">Failed</option>
      </select>

      <Button
        type="button"
        variant="outline"
        onClick={onRefresh}
        className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-5 text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
      >
        <RefreshCw className="size-4" />
        Refresh
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                TABLE                                       */
/* -------------------------------------------------------------------------- */

function ReplayTable({
  replays,
  onPreview,
  onGenerate,
  onDelete,
}: {
  replays: VideoReplay[];
  onPreview: (replay: VideoReplay) => void;
  onGenerate: (replay: VideoReplay) => void;
  onDelete: (replayId: string) => void;
}) {
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="bg-[#fafafd]">
              <TableHeading>Title</TableHeading>
              <TableHeading>Status</TableHeading>
              <TableHeading>Duration</TableHeading>
              <TableHeading>Size</TableHeading>
              <TableHeading>Access</TableHeading>
              <TableHeading>Created</TableHeading>

              <th className="w-[150px] px-4 py-4" />
            </tr>
          </thead>

          <tbody>
            {replays.map((replay) => (
              <tr
                key={replay.id}
                className="border-b border-slate-100 last:border-b-0 hover:bg-[#fafaff]"
              >
                <td className="max-w-[330px] px-4 py-5">
                  <p className="truncate text-sm font-semibold text-[#303038]">
                    {replay.title}
                  </p>
                </td>

                <td className="px-4 py-5">
                  <StatusBadge status={replay.status} />
                </td>

                <td className="px-4 py-5 text-sm text-[#777780]">
                  {replay.duration}
                </td>

                <td className="px-4 py-5 text-sm text-[#777780]">
                  {replay.size}
                </td>

                <td className="px-4 py-5 text-sm text-[#777780]">
                  {replay.access}
                </td>

                <td className="whitespace-nowrap px-4 py-5 text-sm text-[#777780]">
                  {replay.createdAt}
                </td>

                <td className="px-4 py-5">
                  <div className="flex justify-end gap-1">
                    <ActionButton
                      title="Preview video"
                      onClick={() => onPreview(replay)}
                    >
                      <Eye className="size-4" />
                    </ActionButton>

                    <ActionButton
                      title="Generate workflow (AI)"
                      disabled={replay.status !== "ready"}
                      onClick={() => onGenerate(replay)}
                    >
                      <GitBranch className="size-4" />
                    </ActionButton>

                    <ActionButton
                      title="Delete video"
                      danger
                      onClick={() => onDelete(replay.id)}
                    >
                      <Trash2 className="size-4" />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}

            {replays.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#f1f2ff] text-[#5964d6]">
                    <Video className="size-5" />
                  </span>

                  <p className="mt-3 text-sm font-semibold text-[#303038]">
                    No video replays
                  </p>

                  <p className="mt-1 text-sm text-[#85858e]">
                    Import a video to create your first replay.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e8e8eb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#777780]">
          Showing 1–{replays.length} of {replays.length}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#777780]">Per page</span>

          <select className="h-9 rounded-full border border-[#dedee3] bg-white px-3 text-sm">
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>

          <span className="inline-flex h-9 items-center rounded-full border border-[#dedee3] px-4 text-sm font-semibold">
            1 / 1
          </span>

          <Button variant="outline" disabled className="h-9 rounded-full">
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>

          <Button variant="outline" disabled className="h-9 rounded-full">
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
      {children}
    </th>
  );
}

/* -------------------------------------------------------------------------- */
/*                              STATUS BADGE                                  */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: ReplayStatus }) {
  const label = {
    ready: "Ready",
    processing: "Processing",
    failed: "Failed",
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        status === "ready" && "border-[#a8e3d2] bg-[#e9faf4] text-[#218565]",
        status === "processing" &&
          "border-[#f2d49a] bg-[#fff8e8] text-[#9c681c]",
        status === "failed" && "border-[#f0bbbb] bg-[#fff0f0] text-[#b34e4e]",
      )}
    >
      {status === "processing" && (
        <Loader2 className="mr-1.5 size-3 animate-spin" />
      )}

      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                            PREVIEW MODAL                                   */
/* -------------------------------------------------------------------------- */

function VideoPreviewModal({
  replay,
  onClose,
}: {
  replay: VideoReplay;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full max-w-[850px] overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <ModalHeader
          title={replay.title}
          subtitle="Video replay"
          onClose={onClose}
        />

        <div className="p-5">
          <video
            src={replay.videoUrl}
            controls
            autoPlay
            className="aspect-video w-full rounded-2xl bg-black shadow-sm"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <InformationCard label="Duration" value={replay.duration} />

            <InformationCard label="Size" value={replay.size} />

            <InformationCard label="Status" value={replay.status} />
          </div>
        </div>

        <div className="flex justify-end border-t border-[#e1e1e5] bg-[#fafafa] px-5 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* -------------------------------------------------------------------------- */
/*                         WORKFLOW GENERATOR                                 */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WorkflowGeneratorModal({
  replay,
  draft,
  isAnalyzing,
  onAnalyze,
  onDiscard,
  onValidate,
  onClose,
}: {
  replay: VideoReplay;
  draft: AiDraft | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onDiscard: () => void;
  onValidate: () => void;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      {draft ? (
        <DraftReview
          draft={draft}
          onDiscard={onDiscard}
          onValidate={onValidate}
          onClose={onClose}
        />
      ) : (
        <div
          className="max-h-[92vh] w-full max-w-[1060px] overflow-y-auto rounded-xl bg-[#fbfbfc] shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <ModalHeader
            title="Generate workflow with AI"
            subtitle="Replay linked as AI source"
            onClose={onClose}
          />

          <div className="p-5">
            <div className="rounded-lg border border-[#d8d8de] bg-[#f1f1f2] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white">
                  <Video className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#303038]">
                    Replay linked as AI source — {replay.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#777780]">
                    Click Analyze sources, review the generated draft, then
                    validate it.
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-5 rounded-lg border border-[#dfdfe4] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-[#eafaf4] text-[#36a17d]">
                    <Video className="size-4" />
                  </div>

                  <h2 className="font-semibold text-[#303038]">Sources</h2>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="gap-2 rounded-full"
                >
                  {isAnalyzing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="size-4" />
                  )}
                  Analyze sources
                </Button>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-[#e1e1e5]">
                <div className="border-b border-[#e1e1e5] px-4 py-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-[#5964d6] px-3 py-1.5 text-xs font-semibold text-white">
                    <Video className="size-3.5" />
                    Video
                    <span className="size-1.5 rounded-full bg-[#68d8b6]" />
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <input
                    value={replay.title}
                    readOnly
                    className="h-10 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm font-semibold"
                  />

                  <textarea
                    value={`Workflow replay: ${replay.title}. Focus on each visible user action, including clicks, forms and navigation, and turn them into guided flow steps.`}
                    readOnly
                    className="min-h-20 w-full resize-none rounded-md border border-[#dedee3] bg-white px-3 py-2 text-sm leading-6"
                  />

                  <p className="text-xs text-[#777780]">
                    Video for AI analysis: MP4 or WebM only.
                  </p>

                  <div className="flex gap-2">
                    <span className="rounded-md bg-[#f4f4f5] px-3 py-1.5 text-xs font-semibold">
                      Link
                    </span>

                    <span className="rounded-md px-3 py-1.5 text-xs text-[#85858e]">
                      Upload
                    </span>
                  </div>

                  <div className="flex h-10 items-center gap-2 rounded-md border border-[#dedee3] bg-white px-3 text-sm">
                    <Link2 className="size-4 shrink-0 text-[#777780]" />

                    <span className="truncate text-[#50505a]">
                      {replay.videoUrl}
                    </span>
                  </div>

                  <p className="flex items-center gap-2 text-xs text-[#3e9c7d]">
                    <Check className="size-3.5" />
                    Video bound · preview
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4 gap-2 rounded-full"
              >
                <Plus className="size-4" />
                Add source
              </Button>
            </section>

            <div className="mt-5 flex min-h-[130px] flex-col items-center justify-center rounded-lg border border-[#e1e1e5] bg-[#f3f3f4]">
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-9 animate-spin text-[#303038]" />

                  <p className="mt-3 text-sm font-medium text-[#686872]">
                    AI analysis in progress...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[#85858e]">No preview yet.</p>

                  <Button
                    type="button"
                    onClick={onAnalyze}
                    className="mt-3 gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
                  >
                    <Bot className="size-4" />
                    Analyze sources
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalOverlay>
  );
}

/* -------------------------------------------------------------------------- */
/*                             DRAFT REVIEW                                   */
/* -------------------------------------------------------------------------- */

function DraftReview({
  draft,
  onDiscard,
  onValidate,
  onClose,
}: {
  draft: AiDraft;
  onDiscard: () => void;
  onValidate: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="w-full max-w-[1040px] overflow-hidden rounded-xl bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <ModalHeader
        title="Review AI draft before saving"
        subtitle="Nothing is written to Pages, Actions or Flows until you confirm."
        onClose={onClose}
      />

      <div className="max-h-[72vh] overflow-y-auto p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <DraftCounter label="sources" value={1} />
            <DraftCounter label="pages" value={1} />
            <DraftCounter label="actions" value={0} />
            <DraftCounter label="flows" value={1} />
          </div>

          <p className="text-xs text-[#85858e]">
            Updated:{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date())}
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-[#e1e1e5] px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-[#303038]">
              {draft.replay.title}
            </p>

            <span className="rounded-md bg-[#f0f0f2] px-2 py-1 text-[11px] font-semibold uppercase text-[#55555e]">
              Manual
            </span>

            <span className="text-xs text-[#777780]">video</span>
            <span className="text-xs text-[#777780]">1 step</span>
            <span className="text-xs text-[#777780]">0 screenshots</span>
          </div>
        </div>

        <section className="mt-4 rounded-lg border border-[#e1e1e5] p-4">
          <h3 className="text-sm font-semibold text-[#303038]">Notes</h3>

          <div className="mt-3 space-y-2">
            {draft.notes.map((note) => (
              <p
                key={note}
                className="rounded-md bg-[#f7f7f8] px-3 py-2 text-xs leading-5 text-[#686872]"
              >
                {note}
              </p>
            ))}
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <DraftCard title="Pages" count={1}>
            <p className="font-semibold">{draft.page.title}</p>
            <p className="mt-1 truncate font-mono text-xs text-[#777780]">
              {draft.page.key}
            </p>
          </DraftCard>

          <DraftCard title="Actions" count={0}>
            <p className="text-[#85858e]">Our actions.</p>
          </DraftCard>

          <DraftCard title="Flows" count={1}>
            <p className="font-semibold">{draft.flow.title}</p>
            <p className="mt-1 truncate font-mono text-xs text-[#777780]">
              {draft.flow.key}
            </p>
            <p className="mt-1 text-xs text-[#777780]">
              {draft.flow.steps.length} step
            </p>
          </DraftCard>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-[#e1e1e5] bg-[#fafafa] px-5 py-4">
        <Button type="button" variant="outline" onClick={onDiscard}>
          Discard draft
        </Button>

        <Button
          type="button"
          onClick={onValidate}
          className="gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          <Bot className="size-4" />
          Validate and save to studio
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            SHARED COMPONENTS                               */
/* -------------------------------------------------------------------------- */

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {children}
    </div>
  );
}

function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between border-b border-[#e1e1e5] px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-[#202026]">{title}</h2>

        {subtitle && <p className="mt-1 text-xs text-[#777780]">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex size-9 items-center justify-center rounded-md border border-[#dedee3] text-[#686872] hover:bg-[#f5f5f6]"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

function ActionButton({
  children,
  title,
  danger = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition",
        danger
          ? "text-[#c85454] hover:bg-[#fff0f0]"
          : "text-[#414149] hover:bg-[#efeff1]",
        disabled && "cursor-not-allowed opacity-35 hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

function InformationCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e1e1e5] bg-[#fafafa] p-4">
      <p className="text-xs font-semibold uppercase text-[#85858e]">{label}</p>

      <p className="mt-2 text-sm font-semibold capitalize text-[#303038]">
        {value}
      </p>
    </div>
  );
}

function DraftCounter({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-[#dedee3] bg-white px-3 py-1 text-xs font-semibold text-[#50505a]">
      {value} {label}
    </span>
  );
}

function DraftCard({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-[120px] rounded-lg border border-[#e1e1e5] bg-white">
      <div className="border-b border-[#e1e1e5] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#303038]">
          {title} <span className="ml-1 text-xs text-[#85858e]">{count}</span>
        </h3>
      </div>

      <div className="p-4 text-sm text-[#50505a]">{children}</div>
    </section>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-5 z-[70] flex max-w-[450px] -translate-x-1/2 items-start gap-3 rounded-lg border border-[#b7e7ca] bg-[#eafbef] px-4 py-3 shadow-lg">
      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#27a35f] text-white">
        <Check className="size-3.5" />
      </div>

      <p className="text-sm font-semibold leading-5 text-[#317648]">
        {message}
      </p>
    </div>
  );
}
