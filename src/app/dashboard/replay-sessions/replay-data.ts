import type { ReplayAiDraft as AiDraft, VideoReplay } from "./replay-types";

export const initialReplays: VideoReplay[] = [
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

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Retained for the inline workflow generator when that entry point is enabled.
export function createDraft(replay: VideoReplay): AiDraft {
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
