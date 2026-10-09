export function paginateLeads<T>(rows: T[], pageValue?: string, sizeValue?: string) {
  const size = sizeValue === "50" ? 50 : 25;
  const requested = Number(pageValue);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const page = Math.min(pages, Number.isSafeInteger(requested) && requested > 0 ? requested : 1);
  const start = (page - 1) * size;
  return { rows: rows.slice(start, start + size), page, pages, size, total: rows.length, from: rows.length ? start + 1 : 0, to: Math.min(start + size, rows.length) };
}
