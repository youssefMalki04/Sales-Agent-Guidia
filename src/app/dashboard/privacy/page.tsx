"use client";

import {
  Check,
  Clock3,
  Download,
  Eye,
  FileText,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { initialSettings, logs, STORAGE_KEY } from "./privacy-data";
import type { PrivacySettings } from "./privacy-types";
import { Card, Field, Stat, Toggle } from "./privacy-ui";

export default function PrivacyPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [requestResult, setRequestResult] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored)
          setSettings({
            ...initialSettings,
            ...(JSON.parse(stored) as PrivacySettings),
          });
      } catch {
        // Keep safe defaults if browser storage cannot be read.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function update<K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function handleDataRequest(event: FormEvent, action: "export" | "delete") {
    event.preventDefault();
    if (!requestEmail.trim()) return;
    setRequestResult(
      action === "export"
        ? `Frontend demo: an export was prepared for ${requestEmail}.`
        : `Frontend demo: deletion request created for ${requestEmail}.`,
    );
  }

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
          <div className="space-y-5">
            <Card
              icon={<ShieldCheck className="size-5" />}
              title="Widget consent"
              description="Ask permission before collecting personal information."
            >
              <Toggle
                label="Require visitor consent"
                description="Display the consent message before contact details are collected."
                checked={settings.requireConsent}
                onChange={(value) => update("requireConsent", value)}
              />
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
                  Consent message
                </span>
                <textarea
                  value={settings.consentText}
                  onChange={(event) =>
                    update("consentText", event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
                />
              </label>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
                  Privacy policy URL
                </span>
                <input
                  type="url"
                  value={settings.policyUrl}
                  onChange={(event) => update("policyUrl", event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
                />
              </label>
            </Card>

            <Card
              icon={<LockKeyhole className="size-5" />}
              title="Tracking permissions"
              description="Choose the minimum data required for the visitor experience."
            >
              <div className="divide-y divide-[#eeeeF1]">
                <Toggle
                  label="Functional storage"
                  description="Remember the chat session and visitor preferences."
                  checked={settings.functionalCookies}
                  onChange={(value) => update("functionalCookies", value)}
                />
                <Toggle
                  label="Product analytics"
                  description="Measure usage and widget conversion after consent."
                  checked={settings.analytics}
                  onChange={(value) => update("analytics", value)}
                />
                <Toggle
                  label="Anonymize IP addresses"
                  description="Remove the final segment before analytics processing."
                  checked={settings.anonymizeIp}
                  onChange={(value) => update("anonymizeIp", value)}
                />
              </div>
            </Card>

            <Card
              icon={<Clock3 className="size-5" />}
              title="Data retention"
              description="Automatically remove records that are no longer required."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Conversations">
                  <select
                    value={settings.conversationRetention}
                    onChange={(event) =>
                      update("conversationRetention", event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                  </select>
                </Field>
                <Field label="Qualified leads">
                  <select
                    value={settings.leadRetention}
                    onChange={(event) =>
                      update("leadRetention", event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="730">2 years</option>
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Toggle
                  label="Automatic deletion"
                  description="Permanently delete expired records according to these periods."
                  checked={settings.autoDelete}
                  onChange={(value) => update("autoDelete", value)}
                />
              </div>
            </Card>
          </div>

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
                    Bonjour ! Avant de continuer, veuillez consulter notre
                    politique de confidentialité.
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
                Search by email to simulate an access or deletion request.
              </p>
              <form className="mt-4">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
                  <input
                    type="email"
                    value={requestEmail}
                    onChange={(event) => {
                      setRequestEmail(event.target.value);
                      setRequestResult(null);
                    }}
                    placeholder="visitor@example.com"
                    className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#939ae2]"
                  />
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="submit"
                    onClick={(event) => handleDataRequest(event, "export")}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#5964d6]"
                  >
                    <Download className="size-4" />
                    Export
                  </button>
                  <button
                    type="submit"
                    onClick={(event) => handleDataRequest(event, "delete")}
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
        </section>

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
                    <td className="px-4 py-4 text-sm text-[#686872]">
                      {log.date}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {log.version}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
