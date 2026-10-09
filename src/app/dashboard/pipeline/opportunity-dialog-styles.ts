export const opportunityDialogStyles = {
  content: "flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-xl sm:max-w-[500px]",
  header: "shrink-0 gap-1.5 border-b border-slate-100 px-5 py-5 pr-12 sm:px-6",
  title: "text-lg font-semibold tracking-tight",
  body: "min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6",
  label: "block min-w-0 space-y-1.5 text-xs font-medium text-slate-600",
  field: "h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 shadow-none outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100",
  footer: "mx-0 mb-0 shrink-0 rounded-none border-t border-slate-100 bg-white px-5 py-3 sm:px-6",
  primary: "rounded-lg bg-[#5964d6] text-white shadow-none hover:bg-[#4f5acb]",
} as const;
