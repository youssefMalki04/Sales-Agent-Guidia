"use client";

import { useState } from "react";
import { Activity, Building2, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { OrganizationRecord } from "./organization-data";
import { fieldClass } from "./organization-data";
import { DetailRow, FormField } from "./organization-settings";

export function EmptyOrganization({ onRestore }: { onRestore: () => void }) {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dfe2eb] bg-[#fafafd] p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Building2 className="size-6" />
      </span>
      <h2 className="mt-5 text-base font-bold text-[#3b3f50]">
        No organization in this workspace
      </h2>
      <p className="mt-2 max-w-md text-xs leading-5 text-[#858a9a]">
        The local demo organization was removed. Restore the sample workspace to
        continue the presentation.
      </p>
      <Button
        onClick={onRestore}
        className="mt-5 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
      >
        <RefreshCw className="size-4" />
        Restore sample workspace
      </Button>
    </section>
  );
}

export function OrganizationDialog({
  organization,
  open,
  onOpenChange,
  onSave,
}: {
  organization: OrganizationRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (organization: OrganizationRecord) => void;
}) {
  const [draft, setDraft] = useState(organization);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[22px] border-[#e2e4ed] p-0 sm:max-w-[520px]">
        <DialogHeader className="border-b border-[#e8eaf1] bg-gradient-to-br from-[#f6f7ff] to-white px-6 py-6">
          <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Building2 className="size-4" />
          </span>
          <DialogTitle className="text-xl font-bold tracking-[-.025em]">
            Organization details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 px-6 py-5">
          <FormField label="Organization name">
            <Input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                  initial:
                    event.target.value.trim().charAt(0).toUpperCase() ||
                    current.initial,
                }))
              }
              className={fieldClass}
            />
          </FormField>
          <FormField label="Workspace slug">
            <Input
              value={draft.slug}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  slug: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </FormField>
          <div className="grid gap-3 rounded-xl bg-[#f7f8fb] p-4 sm:grid-cols-2">
            <DetailRow label="Created" value={draft.createdAt} />
            <DetailRow
              label="Environment"
              value={draft.active ? "Production · Active" : "Paused · Disabled"}
            />
          </div>
        </div>
        <DialogFooter className="border-t border-[#e8eaf1] bg-[#fafafd] px-6 py-4">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrganizationActionDialog({
  organization,
  action,
  open,
  onOpenChange,
  onConfirm,
}: {
  organization: OrganizationRecord;
  action: "disable" | "delete";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const deleting = action === "delete";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[22px] border-[#e5e6ed] sm:max-w-[460px]">
        <DialogHeader>
          <span
            className={`mb-2 flex size-11 items-center justify-center rounded-xl ${deleting ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
          >
            {deleting ? (
              <Trash2 className="size-5" />
            ) : (
              <Activity className="size-5" />
            )}
          </span>
          <DialogTitle>
            {deleting
              ? "Delete organization?"
              : organization.active
                ? "Disable organization?"
                : "Enable organization?"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-[#74798a]">
          {deleting
            ? `This removes ${organization.name} and its local demo applications. You can restore the sample workspace afterwards.`
            : organization.active
              ? "Applications will remain configured, but the workspace will be marked as paused."
              : "The workspace and its applications will become active again."}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={deleting ? "destructive" : "default"}
            className={
              deleting
                ? "rounded-xl"
                : "rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            }
            onClick={onConfirm}
          >
            {deleting
              ? "Delete organization"
              : organization.active
                ? "Disable"
                : "Enable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
