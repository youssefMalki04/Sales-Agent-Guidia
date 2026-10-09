// Conservative matching: do not treat different commercial actions as equal.
export function normalizeTaskTitle(title: string) {
  return title.normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function sameTaskTitle(first: string, second: string) {
  const normalized = normalizeTaskTitle(first);
  return normalized.length > 0 && normalized === normalizeTaskTitle(second);
}
