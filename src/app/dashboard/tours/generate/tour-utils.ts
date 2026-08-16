import type { AiDraft, TourSource } from "./tour-types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptySource(index: number): TourSource {
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

export function createDraft(sources: TourSource[]): AiDraft {
  const validSources = sources.filter(
    (source) =>
      source.url.trim() || source.fileName.trim() || source.rawHtml.trim(),
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
        businessGoal:
          "Transform the supplied source into a clear guided workflow.",
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
