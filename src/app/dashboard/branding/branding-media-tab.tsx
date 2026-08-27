"use client";

import type React from "react";
import type { ChangeEvent } from "react";
import { FileImage, FileText, Link2, Video, X } from "lucide-react";
import { Button, Input } from "./branding-controls";
import type { Asset } from "./branding-data";

export function MediaTab({
  assets,
  setAssets,
  externalLink,
  setExternalLink,
  handleFiles,
}: {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  externalLink: string;
  setExternalLink: (v: string) => void;
  handleFiles: (e: ChangeEvent<HTMLInputElement>, kind: Asset["kind"]) => void;
}) {
  const cards = [
    ["pdf", FileText, "Upload PDF", ".pdf"],
    ["video", Video, "Upload video", "video/*"],
    ["image", FileImage, "Upload image", "image/*"],
  ] as const;
  return (
    <div className="min-h-[650px] bg-[#fafafd] p-6">
      <p className="mb-5 text-sm text-zinc-500">
        Upload PDFs, videos, images and links your AI agent can show visitors
        during a sales conversation.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([kind, Icon, title, accept]) => (
          <label
            key={kind}
            className="soft-lift cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <input
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e, kind)}
            />
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
              <Icon className="size-5" />
            </span>
            <span className="mt-4 block font-semibold">{title}</span>
            <span className="mt-1 block text-xs text-zinc-500">{accept}</span>
          </label>
        ))}
        <div className="soft-lift rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#5964d6] text-white">
            <Link2 className="size-5" />
          </span>
          <h3 className="mt-4 font-semibold">Add link or external demo</h3>
          <div className="mt-4 flex gap-2">
            <Input
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
            />
            <Button
              onClick={() => {
                const v = externalLink.trim();
                if (!v) return;
                setAssets((a) => [
                  ...a,
                  { id: `${v}-${Date.now()}`, kind: "link", name: v },
                ]);
                setExternalLink("");
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      {assets.length ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg border bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.name}</p>
                <p className="text-xs uppercase text-zinc-400">{a.kind}</p>
              </div>
              <button
                onClick={() => setAssets((x) => x.filter((y) => y.id !== a.id))}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-14 text-center text-sm text-zinc-500">
          No assets yet. Start by uploading a brochure PDF or pasting a YouTube
          link.
        </div>
      )}
    </div>
  );
}
