import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";

import type { PrivacySettings } from "./privacy-types";
import { Card, Field, Toggle } from "./privacy-ui";

export type UpdatePrivacySetting = <K extends keyof PrivacySettings>(
  key: K,
  value: PrivacySettings[K],
) => void;

export function PrivacySettingsPanels({
  settings,
  onUpdate,
}: {
  settings: PrivacySettings;
  onUpdate: UpdatePrivacySetting;
}) {
  return (
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
          onChange={(value) => onUpdate("requireConsent", value)}
        />
        <label className="mt-5 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7c7c85]">
            Consent message
          </span>
          <textarea
            value={settings.consentText}
            onChange={(event) => onUpdate("consentText", event.target.value)}
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
            onChange={(event) => onUpdate("policyUrl", event.target.value)}
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
            onChange={(value) => onUpdate("functionalCookies", value)}
          />
          <Toggle
            label="Product analytics"
            description="Measure usage and widget conversion after consent."
            checked={settings.analytics}
            onChange={(value) => onUpdate("analytics", value)}
          />
          <Toggle
            label="Anonymize IP addresses"
            description="Remove the final segment before analytics processing."
            checked={settings.anonymizeIp}
            onChange={(value) => onUpdate("anonymizeIp", value)}
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
                onUpdate("conversationRetention", event.target.value)
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
                onUpdate("leadRetention", event.target.value)
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
            onChange={(value) => onUpdate("autoDelete", value)}
          />
        </div>
      </Card>
    </div>
  );
}
