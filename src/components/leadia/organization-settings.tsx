import { AppWindow, ArrowLeft } from "lucide-react";

import type { ApplicationRecord } from "./organization-data";
import {
  ApplicationDangerZone,
  CurrentUserApiCard,
  GeneralSettingsCard,
  IntegrationSection,
  WidgetCredentialsCard,
} from "./organization-settings-sections";

export { DetailRow, FormField } from "./organization-settings-ui";

export function ApplicationSettings({
  application,
  showToken,
  onBack,
  onCopy,
  onToggleToken,
  onUpdate,
}: {
  application: ApplicationRecord;
  showToken: boolean;
  onBack: () => void;
  onCopy: (value: string) => void;
  onToggleToken: () => void;
  onUpdate: (
    field: keyof Pick<
      ApplicationRecord,
      "name" | "slug" | "description" | "baseUrl" | "allowedDomains" | "active"
    >,
    value: string | boolean,
  ) => void;
}) {
  return (
    <div className="min-h-[calc(100vh-76px)] bg-white px-4 py-7 text-[#292d3b] sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto flex max-w-[980px] flex-col gap-7">
        <button
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#55555f] hover:text-[#171717]"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Applications
        </button>

        <div className="rounded-[22px] border border-[#e2e5f1] bg-gradient-to-br from-[#f5f7ff] to-[#faf6ff] p-6">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5964d6] to-[#8069d9] text-white shadow-lg">
              <AppWindow className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-[-.03em]">
                {application.name}
              </h1>
              <p className="mt-1 text-xs text-[#7d8293]">{application.slug}</p>
            </div>
          </div>
        </div>

        <GeneralSettingsCard application={application} onUpdate={onUpdate} />
        <WidgetCredentialsCard
          application={application}
          showToken={showToken}
          onCopy={onCopy}
          onToggleToken={onToggleToken}
        />
        <IntegrationSection applicationId={application.id} onCopy={onCopy} />
        <CurrentUserApiCard />
        <ApplicationDangerZone name={application.name} />
      </div>
    </div>
  );
}
