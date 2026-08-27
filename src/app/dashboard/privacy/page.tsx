"use client";

import {
  Check,
  Clock3,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import {
  ConsentLog,
  PrivacySettingsPanels,
  PrivacySidebar,
} from "./privacy-panels";
import { Stat } from "./privacy-ui";
import { usePrivacy } from "./use-privacy";

export default function PrivacyPage() {
  const {
    settings,
    saved,
    save,
    update,
    requestEmail,
    requestResult,
    changeRequestEmail,
    handleDataRequest,
  } = usePrivacy();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-12">
      <div className="soft-page-enter mx-auto max-w-[1300px] space-y-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Trust center
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Privacy & GDPR
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Configure visitor consent, tracking permissions and responsible
              data retention.
            </p>
          </div>
          <button
            type="button"
            onClick={save}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] transition hover:bg-[#4f5acb]"
          >
            <Check className="size-4" />
            {saved ? "Saved" : "Save changes"}
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <Stat
            icon={<ShieldCheck className="size-5 text-emerald-600" />}
            label="Consent rate"
            value="82%"
          />
          <Stat
            icon={<UserRoundCheck className="size-5 text-indigo-600" />}
            label="Recorded consents"
            value="1,284"
          />
          <Stat
            icon={<Clock3 className="size-5 text-violet-600" />}
            label="Default retention"
            value={`${settings.conversationRetention} days`}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_430px]">
          <PrivacySettingsPanels settings={settings} onUpdate={update} />
          <PrivacySidebar
            settings={settings}
            requestEmail={requestEmail}
            requestResult={requestResult}
            onRequestEmailChange={changeRequestEmail}
            onDataRequest={handleDataRequest}
          />
        </section>

        <ConsentLog />
      </div>
    </main>
  );
}
