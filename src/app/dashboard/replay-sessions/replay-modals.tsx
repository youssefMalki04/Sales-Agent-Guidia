import type React from "react";
import {
  Bot,
  Check,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReplayAiDraft as AiDraft, VideoReplay } from "./replay-types";

export function VideoPreviewModal({
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

export function WorkflowGeneratorModal({
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

export function DraftReview({
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

export function ActionButton({
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
