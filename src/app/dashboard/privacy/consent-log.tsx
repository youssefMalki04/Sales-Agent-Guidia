import { logs } from "./privacy-data";

export function ConsentLog() {
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold">Consent log</h2>
        <p className="mt-1 text-xs text-[#85858e]">
          Frontend sample of auditable visitor choices.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b bg-[#fafafd] text-[11px] uppercase text-[#85858e]">
              <th className="px-5 py-3">Visitor</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Consent version</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-100 last:border-0 hover:bg-[#fafaff]"
              >
                <td className="px-5 py-4 text-sm font-semibold">
                  {log.visitor}
                </td>
                <td className="px-4 py-4 text-sm text-[#686872]">
                  {log.country}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${log.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-[#686872]">{log.date}</td>
                <td className="px-4 py-4 text-sm font-semibold">
                  {log.version}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
