export function dueDateState(value: string, now = Date.now()) {
  const timestamp = Date.parse(value);
  if (!value || !Number.isFinite(timestamp)) return "invalid";
  return timestamp < now ? "past" : "future";
}
