import { Download, Eye, FileText, Search, Trash2 } from "lucide-react";
import type { FormEvent } from "react";

import type { PrivacySettings } from "./privacy-types";

type PrivacySidebarProps = {
  settings: PrivacySettings;
  requestEmail: string;
  requestResult: string | null;
  onRequestEmailChange: (email: string) => void;
  onDataRequest: (event: FormEvent, action: "export" | "delete") => void;
};

export function PrivacySidebar({
  settings,
  requestEmail,
  requestResult,
  onRequestEmailChange,
  onDataRequest,
}: PrivacySidebarProps) {
  return (
    <aside className="space-y-5">
      <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
            <Eye className="size-4" />
          </span>
          <h2 className="font-semibold">Widget preview</h2>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-[#5964d6] px-4 py-3 text-sm font-semibold text-white">
            Leadia Sales Assistant
          </div>
          <div className="space-y-4 p-4">
            <p className="rounded-xl bg-[#f2f2f4] p-3 text-xs leading-5 text-[#55555e]">
              Bonjour ! Avant de continuer, veuillez consulter notre politique
              de confidentialité.
            </p>
            {settings.requireConsent ? (
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs leading-5 text-[#62626b]">
                  {settings.consentText}
                </p>
                <a
                  href={settings.policyUrl || "#"}
                  className="mt-2 inline-block text-xs font-semibold text-[#5964d6]"
                >
                  Privacy policy
                </a>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="h-8 rounded-lg border text-xs font-semibold">
                    Decline
                  </button>
                  <button className="h-8 rounded-lg bg-[#5964d6] text-xs font-semibold text-white">
                    Accept
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#85858e]">
                Consent prompt is disabled.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
            <FileText className="size-4" />
          </span>
          <h2 className="font-semibold">Visitor data request</h2>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#777780]">
          Search by email to prepare an access or deletion request.
        </p>
        <form className="mt-4">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
            <input
              type="email"
              value={requestEmail}
              onChange={(event) => onRequestEmailChange(event.target.value)}
              placeholder="visitor@example.com"
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#939ae2]"
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="submit"
              onClick={(event) => onDataRequest(event, "export")}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#5964d6]"
            >
              <Download className="size-4" />
              Export
            </button>
            <button
              type="submit"
              onClick={(event) => onDataRequest(event, "delete")}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200 text-xs font-semibold text-red-700"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        </form>
        {requestResult ? (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-medium leading-5 text-emerald-700">
            {requestResult}
          </p>
        ) : null}
      </section>
    </aside>
  );
}
