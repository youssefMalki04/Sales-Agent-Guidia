const MAX_SUMMARY_SENTENCES = 5;
const MAX_SUMMARY_LENGTH = 900;

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitSentences(value: string) {
  const matches = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
}

export function normalizeSalesSummary(summary: string | null | undefined) {
  if (typeof summary !== "string") {
    return null;
  }

  const normalized = compactWhitespace(summary);

  if (normalized.length === 0) {
    return null;
  }

  const sentences = splitSentences(normalized).slice(0, MAX_SUMMARY_SENTENCES);
  const limitedBySentence = sentences.length > 0 ? sentences.join(" ") : normalized;

  if (limitedBySentence.length <= MAX_SUMMARY_LENGTH) {
    return limitedBySentence;
  }

  return `${limitedBySentence.slice(0, MAX_SUMMARY_LENGTH).trimEnd()}...`;
}
