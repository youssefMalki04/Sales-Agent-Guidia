"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  GitBranch,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReplayStatus, VideoReplay } from "./replay-types";

import { formatFileSize, initialReplays } from "./replay-data";
import { ActionButton, VideoPreviewModal } from "./replay-modals";
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
