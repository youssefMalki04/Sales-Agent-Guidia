"use client";

import {
  Check,
  FileCode2,
  FileImage,
  FileVideo2,
  ImageIcon,
  Link2,
  Trash2,
  Video,
} from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AiDraft, TourSource } from "./tour-types";

type SourceCardProps = {
  source: TourSource;
  index: number;
  onUpdate: (updates: Partial<TourSource>) => void;
  onDelete: () => void;
};

export function SourceCard({
  source,
  index,
  onUpdate,
  onDelete,
}: SourceCardProps) {
  return (
    <div className="rounded-2xl border border-[#e6e7eb] bg-[#fcfcfd] p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#17171a]">
          {source.type === "video" ? (
            <FileVideo2 className="size-4" />
          ) : source.type === "image" ? (
            <FileImage className="size-4" />
          ) : (
            <FileCode2 className="size-4" />
          )}
          {source.title || `Source ${index + 1}`}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <SourceTypeButton
          label="Video"
          active={source.type === "video"}
          icon={<Video className="size-4" />}
          onClick={() => onUpdate({ type: "video", inputMode: "upload" })}
        />
        <SourceTypeButton
          label="Image"
          active={source.type === "image"}
          icon={<ImageIcon className="size-4" />}
          onClick={() => onUpdate({ type: "image", inputMode: "link" })}
        />
        <SourceTypeButton
          label="HTML"
          active={source.type === "html"}
          icon={<FileCode2 className="size-4" />}
          onClick={() => onUpdate({ type: "html", inputMode: "link" })}
        />
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
          <button
            type="button"
            onClick={() => onUpdate({ inputMode: "link" })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              source.inputMode === "link"
                ? "border-[#d8d8dd] bg-white text-[#24242a]"
                : "border-transparent bg-[#f3f3f4] text-[#85858e]",
            )}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdate({
                inputMode: source.type === "html" ? "paste" : "upload",
              })
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              source.inputMode === (source.type === "html" ? "paste" : "upload")
                ? "border-[#d8d8dd] bg-white text-[#24242a]"
                : "border-transparent bg-[#f3f3f4] text-[#85858e]",
            )}
          >
            {source.type === "html" ? "Paste" : "Upload"}
          </button>
        </div>

        {source.type === "video" && (
          <>
            {source.inputMode === "link" ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#dedee3] bg-white px-3 py-2">
                <Link2 className="size-4 text-[#62626b]" />
                <input
                  value={source.url}
                  onChange={(event) => onUpdate({ url: event.target.value })}
                  placeholder="https://..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            ) : (
              <FileUploader
                accept="video/mp4,video/webm,video/quicktime"
                label="Upload a replay or clip"
                fileName={source.fileName}
                onFile={(file) =>
                  onUpdate({
                    fileName: file.name,
                    url: URL.createObjectURL(file),
                  })
                }
              />
            )}
          </>
        )}

        {source.type === "image" && (
          <>
            {source.inputMode === "link" ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#dedee3] bg-white px-3 py-2">
                <Link2 className="size-4 text-[#62626b]" />
                <input
                  value={source.url}
                  onChange={(event) => onUpdate({ url: event.target.value })}
                  placeholder="https://..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            ) : (
              <FileUploader
                accept="image/*"
                label="Upload an image"
                fileName={source.fileName}
                onFile={(file) =>
                  onUpdate({
                    fileName: file.name,
                    url: URL.createObjectURL(file),
                  })
                }
              />
            )}
          </>
        )}

        {source.type === "html" && (
          <>
            {source.inputMode === "paste" ? (
              <textarea
                value={source.rawHtml}
                onChange={(event) => onUpdate({ rawHtml: event.target.value })}
                placeholder="Paste HTML here..."
                className="min-h-32 w-full resize-y rounded-lg border border-[#dedee3] bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#94949d]"
              />
            ) : (
              <FileUploader
                accept=".html,text/html"
                label="Upload an HTML file"
                fileName={source.fileName}
                onFile={(file) =>
                  onUpdate({ fileName: file.name, rawHtml: "" })
                }
              />
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
  icon: ReactNode;
  onClick: () => void;
};

export function SourceTypeButton({
  label,
  active,
  icon,
  onClick,
}: SourceTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
        active
          ? "border-[#17171a] bg-[#17171a] text-white"
          : "border-[#dedee3] bg-white text-[#4d4f59]",
      )}
    >
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

export function FileUploader({
  accept,
  label,
  fileName,
  onFile,
}: FileUploaderProps) {
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
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex min-h-12 w-full items-center justify-between rounded-lg border border-dashed border-[#dedee3] bg-[#f4f4f5] px-4 text-left text-sm text-[#4d4f59]"
      >
        <span>{label}</span>
        <span className="font-medium text-[#17171a]">
          {fileName || "No file selected"}
        </span>
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

export function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-[#e6e7eb] bg-[#fbfbfc] p-3 text-sm text-[#4d4f59]">
      <div className="text-2xl font-semibold text-[#17171a]">{value}</div>
      <div>{label}</div>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] rounded-full bg-[#17171a] px-4 py-2 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
