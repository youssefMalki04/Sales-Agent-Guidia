import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { ApplicationRecord } from "./organization-data";
import { fieldClass, textareaClass } from "./organization-data";
import {
  CredentialRow,
  FormField,
  SettingsCard,
} from "./organization-settings-ui";

type UpdateApplication = (
  field: keyof Pick<
    ApplicationRecord,
    "name" | "slug" | "description" | "baseUrl" | "allowedDomains" | "active"
  >,
  value: string | boolean,
) => void;

export function GeneralSettingsCard({
  application,
  onUpdate,
}: {
  application: ApplicationRecord;
  onUpdate: UpdateApplication;
}) {
  return (
    <SettingsCard title="General & security">
      <div className="grid gap-5">
        <FormField label="Name">
          <Input
            value={application.name}
            onChange={(event) => onUpdate("name", event.target.value)}
          />
        </FormField>
        <FormField label="Slug">
          <Input
            value={application.slug}
            onChange={(event) => onUpdate("slug", event.target.value)}
          />
        </FormField>
        <FormField label="Description">
          <Input
            value={application.description}
            onChange={(event) => onUpdate("description", event.target.value)}
          />
        </FormField>
        <FormField label="Base URL">
          <Input
            value={application.baseUrl}
            onChange={(event) => onUpdate("baseUrl", event.target.value)}
          />
        </FormField>
        <FormField label="Allowed domains (widget)">
          <Textarea
            className="min-h-24"
            value={application.allowedDomains}
            onChange={(event) => onUpdate("allowedDomains", event.target.value)}
          />
          <p className="text-xs text-[#777782]">
            The widget checks Origin / Referer. Empty list = any origin
            (development only).
          </p>
        </FormField>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            checked={application.active}
            className="size-4 accent-[#2563eb]"
            type="checkbox"
            onChange={(event) => onUpdate("active", event.target.checked)}
          />
          Application active
        </label>
        <Button className="w-fit rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]">
          Save
        </Button>
      </div>
    </SettingsCard>
  );
}

export function WidgetCredentialsCard({
  application,
  showToken,
  onCopy,
  onToggleToken,
}: {
  application: ApplicationRecord;
  showToken: boolean;
  onCopy: (value: string) => void;
  onToggleToken: () => void;
}) {
  const tokenValue = showToken ? application.token : "eyJhbGci...KPnR_zuc";

  return (
    <SettingsCard title="Widget credentials">
      <p className="text-sm text-[#777782]">
        Server-signed token. Never commit this secret; store it in your database
        and inject it at HTML render time from your backend.
      </p>
      <CredentialRow
        label="Application ID (public)"
        value={application.id}
        onCopy={() => onCopy(application.id)}
      />
      <CredentialRow
        actionLabel={showToken ? "Hide" : "Show"}
        label="Widget token (secret)"
        value={tokenValue}
        onAction={onToggleToken}
        onCopy={() => onCopy(application.token)}
      />
      <Button className="w-fit bg-red-500 text-white hover:bg-red-600">
        <RefreshCw className="size-4" />
        Regenerate token
      </Button>
    </SettingsCard>
  );
}

export function IntegrationSection({
  applicationId,
  onCopy,
}: {
  applicationId: string;
  onCopy: (value: string) => void;
}) {
  return (
    <section className="rounded-[20px] border border-[#e4e6ee] bg-[#f8f8fb] p-6">
      <h2 className="text-lg font-semibold">Integration</h2>
      <p className="mt-2 text-sm text-[#777782]">
        Sample bootstrap call - adjust the URL to your API deployment.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-md border border-[#e5e5e7] bg-white px-4 py-3 text-sm text-[#333333]">
        GET https://guidia.dev/widget/bootstrap?token=&lt;TOKEN&gt;&amp;app_id=
        {applicationId}
      </pre>
      <button
        className="mt-5 text-sm font-semibold text-[#55555f] hover:text-[#171717]"
        type="button"
        onClick={() =>
          onCopy(
            `GET https://guidia.dev/widget/bootstrap?token=<TOKEN>&app_id=${applicationId}`,
          )
        }
      >
        Copy template (without token)
      </button>
    </section>
  );
}

export function CurrentUserApiCard() {
  return (
    <SettingsCard title="Current user API">
      <p className="text-sm text-[#777782]">
        Configure an endpoint on your app domain that the widget calls in the
        browser to resolve the signed-in user for conversations.
      </p>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input className="size-4 accent-[#2563eb]" type="checkbox" />
        Enable current user API
      </label>
      <div className="grid gap-5 lg:grid-cols-[1fr_290px]">
        <FormField label="Endpoint URL">
          <Input defaultValue="/api/current-user" />
        </FormField>
        <FormField label="HTTP method">
          <select className={fieldClass} defaultValue="GET">
            <option>GET</option>
            <option>POST</option>
          </select>
        </FormField>
      </div>
      <FormField label="Credentials mode">
        <select className={fieldClass} defaultValue="include">
          <option>include</option>
          <option>same-origin</option>
          <option>omit</option>
        </select>
      </FormField>
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Request headers (JSON)">
          <textarea className={textareaClass} defaultValue="{}" />
        </FormField>
        <FormField label="Request body template (JSON, POST only)">
          <textarea className={textareaClass} />
        </FormField>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="External user ID path">
          <Input defaultValue="user.id" />
        </FormField>
        <FormField label="Full name path">
          <Input defaultValue="user.full_name" />
        </FormField>
        <FormField label="Email path">
          <Input defaultValue="user.email" />
        </FormField>
        <FormField label="Role path">
          <Input defaultValue="user.role" />
        </FormField>
      </div>
      <p className="text-sm text-[#777782]">
        Headers and body must be valid JSON. Leave body empty for GET requests.
      </p>
      <Button className="w-fit rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]">
        Save
      </Button>
    </SettingsCard>
  );
}

export function ApplicationDangerZone({ name }: { name: string }) {
  return (
    <section className="rounded-[20px] border border-red-100 bg-[#fffafa] p-6 text-red-700">
      <h2 className="text-lg font-semibold">Danger zone</h2>
      <p className="mt-2 text-sm text-red-700/80">
        Deleting an app also removes all related resources. This cannot be
        undone.
      </p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold">
          Once deleted, the application {name} and all of its content will be
          permanently lost.
        </p>
        <Button variant="destructive">Delete application</Button>
      </div>
    </section>
  );
}
