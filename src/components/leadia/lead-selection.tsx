"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

const Selection = createContext<{ ids: string[]; selected: string[]; setSelected: (ids: string[]) => void } | null>(null);
export function LeadSelection({ ids, children }: { ids: string[]; children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download(format: string) {
    if (!selected.length || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/import-export?" + new URLSearchParams({ format, ids: selected.join(",") }));
      if (!response.ok) throw new Error((await response.json()).error || "Export failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url; link.download = "leadia-selected-leads." + format;
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(url);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Export failed"); }
    finally { setBusy(false); }
  }
  return <Selection.Provider value={{ ids, selected, setSelected }}>
    {selected.length > 0 ? <div className="flex flex-wrap items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
      <span role="status">{selected.length} selected on this page</span>
      <button disabled={busy} onClick={() => void download("csv")} className="rounded-md px-2 py-1 font-semibold hover:bg-indigo-100 disabled:opacity-50">Export CSV</button>
      <button disabled={busy} onClick={() => void download("xls")} className="rounded-md px-2 py-1 font-semibold hover:bg-indigo-100 disabled:opacity-50">Export Excel</button>
      <button disabled={busy} onClick={() => setSelected([])} className="px-2 py-1">Clear selection</button>
      {busy ? <span>Exporting…</span> : null}
      {error ? <p role="alert" className="w-full text-red-700">{error}</p> : null}
    </div> : null}
    {children}
  </Selection.Provider>;
}
export function LeadSelectionCheckbox({ id, label }: { id?: string; label: string }) {
  const state = useContext(Selection);
  if (!state) return null;
  const checked = id ? state.selected.includes(id) : state.ids.length > 0 && state.selected.length === state.ids.length;
  return <input type="checkbox" aria-label={label} checked={checked}
    ref={(node) => { if (node) node.indeterminate = !id && state.selected.length > 0 && !checked; }}
    onChange={(event) => state.setSelected(id ? event.target.checked ? [...state.selected, id] : state.selected.filter(value => value !== id) : event.target.checked ? state.ids : [])}
    className="size-4 cursor-pointer accent-[#5964d6]" />;
}
