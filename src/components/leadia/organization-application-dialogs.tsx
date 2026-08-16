import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type {
  ApplicationForm,
  ApplicationRecord,
  OrganizationRecord,
} from "./organization-data";
import { fieldClass, labelClass, textareaClass } from "./organization-data";
import { DetailRow, FormField } from "./organization-settings";

export function CreateApplicationSheet({
  form,
  open,
  organization,
  onCreate,
  onOpenChange,
  onUpdate,
}: {
  form: ApplicationForm;
  open: boolean;
  organization: OrganizationRecord;
  onCreate: () => void;
  onOpenChange: (open: boolean) => void;
  onUpdate: (field: keyof ApplicationForm, value: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto bg-white p-0 font-sans text-[#292d3b] sm:max-w-[560px]">
        <SheetHeader className="border-b border-[#e8eaf1] bg-gradient-to-br from-[#f7f8ff] to-white px-6 py-6 pr-14 text-left">
          <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Plus className="size-4" />
          </span>
          <SheetTitle className="text-xl font-bold tracking-[-.025em] text-[#303444]">
            New application
          </SheetTitle>
          <SheetDescription className="mt-1 max-w-[430px] text-sm leading-6 text-[#73737c]">
            Unique slug per organization. In production, set the public URL and
            allowed domains.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-6 py-5">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b9ba4]">
                Context
              </p>
              <p className="mt-1 text-sm leading-5 text-[#777782]">
                Select the organization to configure.
              </p>
            </div>
            <div className="space-y-2">
              <label className={labelClass} htmlFor="new-app-organization">
                Organization
              </label>
              <select
                className={fieldClass}
                id="new-app-organization"
                defaultValue={organization.slug}
              >
                <option value={organization.slug}>{organization.name}</option>
              </select>
            </div>
          </div>

          <FormField label="Name">
            <Input
              className={fieldClass}
              id="new-app-name"
              value={form.name}
              onChange={(event) => onUpdate("name", event.target.value)}
            />
          </FormField>
          <FormField label="Slug">
            <Input
              className={fieldClass}
              id="new-app-slug"
              value={form.slug}
              onChange={(event) => onUpdate("slug", event.target.value)}
            />
          </FormField>
          <FormField label="Description (optional)">
            <Input
              className={fieldClass}
              id="new-app-description"
              value={form.description}
              onChange={(event) => onUpdate("description", event.target.value)}
            />
          </FormField>
          <FormField label="Base URL (optional)">
            <Input
              className={fieldClass}
              id="new-app-base-url"
              placeholder="https://www.example.com"
              value={form.baseUrl}
              onChange={(event) => onUpdate("baseUrl", event.target.value)}
            />
          </FormField>
          <FormField label="Allowed domains (widget)">
            <Textarea
              className={textareaClass}
              id="new-app-allowed-domains"
              placeholder={"app.example.com\n*.example.com"}
              value={form.allowedDomains}
              onChange={(event) =>
                onUpdate("allowedDomains", event.target.value)
              }
            />
            <p className="text-xs text-[#777782]">
              One host per line (host only). Wildcard *.yourdomain.com. Empty =
              any origin.
            </p>
          </FormField>
        </div>

        <SheetFooter className="border-t border-[#e8eaf1] bg-[#fafafd] px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            onClick={onCreate}
          >
            Create application
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ApplicationDetailsDialog({
  application,
  open,
  onOpenChange,
  onOpenSettings,
}: {
  application: ApplicationRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSettings: () => void;
}) {
  if (!application) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{`Application "${application.name}"`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <DetailRow label="Application ID" value={application.id} />
          <DetailRow label="Slug" value={application.slug} />
          <DetailRow
            label="Description (optional)"
            value={application.description || "-"}
          />
          <DetailRow
            label="Base URL (optional)"
            value={application.baseUrl || "-"}
          />
          <DetailRow
            label="Allowed domains (widget)"
            value={application.allowedDomains}
          />
          <DetailRow label="Created" value={application.createdAtFull} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#111113] text-white hover:bg-[#2b2b2f]"
            onClick={onOpenSettings}
          >
            Open full record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
