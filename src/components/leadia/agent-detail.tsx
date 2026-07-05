import { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FormField } from "./form-field";
import type { SalesAgentApp } from "./types";

export function AgentDetail({
  agent,
  onBack,
  onSave,
  onDelete,
}: {
  agent: SalesAgentApp;
  onBack: () => void;
  onSave: (agent: SalesAgentApp) => void;
  onDelete: (agent: SalesAgentApp) => void;
}) {
  const [draft, setDraft] = useState(agent);
  const [visitorIdentityEnabled, setVisitorIdentityEnabled] = useState(false);

  return (
    <div className="px-5 py-9 sm:px-8 xl:px-14">
      <div className="mx-auto max-w-[970px]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#4f4f58]"
        >
          <ArrowLeft className="size-4" />
          Sales agents
        </button>

        <div className="mt-8 border-b border-[#e5e5e8] pb-8">
          <h2 className="text-3xl font-semibold tracking-[-0.03em]">
            {draft.name}
          </h2>
          <p className="mt-2 text-sm font-semibold text-[#9a9aa3]">
            {draft.slug}
          </p>
        </div>

        <section className="mt-8 rounded-lg border border-[#e5e5e8] bg-white p-8">
          <h3 className="text-lg font-semibold">General & security</h3>
          <div className="mt-6 max-w-[620px] space-y-5">
            <FormField label="Name">
              <Input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
            </FormField>
            <FormField label="Slug">
              <Input
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
              />
            </FormField>
            <FormField label="Description">
              <Input
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            </FormField>
            <FormField label="Base URL">
              <Input
                value={draft.baseUrl}
                onChange={(event) =>
                  setDraft({ ...draft, baseUrl: event.target.value })
                }
              />
            </FormField>
            <FormField label="Allowed domains">
              <Textarea
                value={draft.allowedDomains}
                onChange={(event) =>
                  setDraft({ ...draft, allowedDomains: event.target.value })
                }
                className="min-h-24"
              />
            </FormField>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) =>
                  setDraft({ ...draft, active: event.target.checked })
                }
                className="size-4 accent-[#2463eb]"
              />
              Sales agent active
            </label>
            <Button onClick={() => onSave(draft)}>Save</Button>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-[#e5e5e8] bg-white p-8">
          <h3 className="text-lg font-semibold">Embed credentials</h3>
          <CredentialRow label="Agent ID" value={draft.id} />
          <CredentialRow label="Embed token" value={draft.token} />
          <Button className="mt-5 bg-[#e54d4d] hover:bg-[#d84242]">
            Regenerate token
          </Button>
        </section>

        <section className="mt-8 rounded-lg border border-[#e5e5e8] bg-[#f5f5f6] p-8">
          <h3 className="text-lg font-semibold">Embed endpoint</h3>
          <code className="mt-6 block overflow-x-auto rounded-md bg-white p-4 text-sm">
            GET https://leadia.ai/embed/session?token=&lt;TOKEN&gt;&agent_id=
            {draft.id}
          </code>
          <Button variant="outline" className="mt-5 bg-white">
            Copy template
          </Button>
        </section>

        <section className="mt-8 rounded-lg border border-[#e5e5e8] bg-white p-8">
          <h3 className="text-lg font-semibold">Visitor identity API</h3>
          <label className="mt-6 flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={visitorIdentityEnabled}
              onChange={(event) => setVisitorIdentityEnabled(event.target.checked)}
              className="size-4 accent-[#2463eb]"
            />
            Enable visitor identity API
          </label>
          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_290px]">
            <FormField label="Endpoint URL">
              <Input defaultValue="/api/visitor" />
            </FormField>
            <FormField label="HTTP method">
              <select className="h-10 w-full rounded-lg border border-[#dfdfe3] bg-white px-3 text-sm">
                <option>GET</option>
                <option>POST</option>
              </select>
            </FormField>
          </div>
          <FormField label="Credentials mode">
            <select className="h-10 w-full rounded-lg border border-[#dfdfe3] bg-white px-3 text-sm">
              <option>include</option>
              <option>same-origin</option>
              <option>omit</option>
            </select>
          </FormField>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="Request headers">
              <Textarea defaultValue="{}" className="min-h-36 font-mono" />
            </FormField>
            <FormField label="Request body template">
              <Textarea className="min-h-36 font-mono" />
            </FormField>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="External visitor ID path">
              <Input defaultValue="visitor.id" />
            </FormField>
            <FormField label="Full name path">
              <Input defaultValue="visitor.full_name" />
            </FormField>
            <FormField label="Email path">
              <Input defaultValue="visitor.email" />
            </FormField>
            <FormField label="Company path">
              <Input defaultValue="visitor.company" />
            </FormField>
          </div>
          <Button className="mt-6">Save</Button>
        </section>

        <section className="mt-8 rounded-lg border border-[#f0c3c3] bg-[#fdeaea] p-8">
          <h3 className="text-lg font-semibold">Danger zone</h3>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-[#c05a5a]">
              Once deleted, {draft.name} will be permanently lost.
            </p>
            <Button
              onClick={() => onDelete(draft)}
              className="bg-[#e54d4d] hover:bg-[#d84242]"
            >
              Delete sales agent
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <button className="text-sm font-semibold text-[#4f4f58]">Show</button>
      </div>
      <div className="mt-2 flex gap-2">
        <div className="flex-1 rounded-md border border-[#dfdfe3] bg-[#f5f5f6] px-4 py-3 font-mono text-sm">
          {value}
        </div>
        <Button variant="outline">
          <Copy className="size-4" />
          Copy
        </Button>
      </div>
    </div>
  );
}
