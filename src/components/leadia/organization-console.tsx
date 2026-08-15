"use client";

import { useState } from "react";
import {
  Activity,
  AppWindow,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Copy,
  Grid2X2,
  KeyRound,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

type ActiveTab = "organizations" | "applications";

type OrganizationRecord = {
  name: string;
  slug: string;
  initial: string;
  createdAt: string;
  active: boolean;
};

type ApplicationRecord = {
  id: string;
  token: string;
  name: string;
  slug: string;
  description: string;
  baseUrl: string;
  publicUrl: string;
  allowedDomains: string;
  createdAt: string;
  createdAtFull: string;
  active: boolean;
};

type ApplicationForm = Pick<
  ApplicationRecord,
  "name" | "slug" | "description" | "baseUrl" | "allowedDomains"
>;

const initialOrganization: OrganizationRecord = {
  name: "yosra's prod",
  slug: "yosra-s-prod",
  initial: "Y",
  createdAt: "6/15/2026",
  active: true,
};

const defaultApplicationForm: ApplicationForm = {
  name: "Lynara ERP",
  slug: "lynara-erp",
  description: "",
  baseUrl: "https://lynara.ai",
  allowedDomains: "*.guidia.dev",
};

const fieldClass =
  "h-11 w-full rounded-xl border border-[#dfe2eb] bg-white px-3 text-sm font-normal text-[#343849] shadow-none outline-none transition placeholder:text-[#a0a4b2] focus:border-[#8991df] focus:ring-3 focus:ring-[#5964d6]/10";
const textareaClass =
  "min-h-[104px] w-full resize-y rounded-xl border border-[#dfe2eb] bg-white px-3 py-2.5 text-sm font-normal leading-5 text-[#343849] shadow-none outline-none transition placeholder:text-[#a0a4b2] focus:border-[#8991df] focus:ring-3 focus:ring-[#5964d6]/10";
const labelClass = "text-xs font-bold leading-none text-[#555a6b]";

export function OrganizationConsole() {
  const [organization, setOrganization] = useState<OrganizationRecord | null>(
    initialOrganization,
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("organizations");
  const [application, setApplication] = useState<ApplicationRecord | null>(
    null,
  );
  const [form, setForm] = useState<ApplicationForm>(defaultApplicationForm);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false);
  const [organizationAction, setOrganizationAction] = useState<
    "disable" | "delete" | null
  >(null);

  function updateForm(field: keyof ApplicationForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateApplication(
    field: keyof Pick<
      ApplicationRecord,
      "name" | "slug" | "description" | "baseUrl" | "allowedDomains" | "active"
    >,
    value: string | boolean,
  ) {
    setApplication((current) =>
      current ? { ...current, [field]: value } : current,
    );
  }

  function createApplication() {
    const nextApplication: ApplicationRecord = {
      ...form,
      id: "f80cfbdd-f364-49c6-9fb8-176d411576c3",
      token: "eyJhbGci_KPnR_zuc",
      publicUrl: form.baseUrl.replace(/^https?:\/\//, "") || "lynara.ai",
      createdAt: "6/15/2026",
      createdAtFull: "Jun 15, 2026, 1:06 PM",
      active: true,
    };

    setApplication(nextApplication);
    setActiveTab("applications");
    setIsCreateOpen(false);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3200);
  }

  function openSettings() {
    setIsDetailsOpen(false);
    setIsSettingsOpen(true);
  }

  function copyText(value: string) {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(value);
    }
  }

  if (isSettingsOpen && application) {
    return (
      <ApplicationSettings
        application={application}
        showToken={showToken}
        onBack={() => setIsSettingsOpen(false)}
        onCopy={copyText}
        onToggleToken={() => setShowToken((current) => !current)}
        onUpdate={updateApplication}
      />
    );
  }

  return (
    <div className="soft-page-enter relative min-h-[calc(100vh-76px)] bg-white px-4 py-7 text-[#292d3b] sm:px-8 sm:py-9 xl:px-10">
      {showToast ? (
        <div className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-xl">
          <CheckCircle2 className="size-5" />
          Application created.
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#626cd1]">
              <Building2 className="size-3" />
              Workspace control
            </span>
            <h1 className="mt-4 text-[32px] font-bold tracking-[-.045em] text-[#282c3a] sm:text-[36px]">
              Your organization
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777d8f]">
              Manage your workspace, applications and public access from one
              calm place.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${organization?.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#e0e2e9] bg-[#f5f5f7] text-[#777b8b]"}`}
          >
            <span
              className={`size-2 rounded-full ${organization?.active ? "soft-status-pulse bg-emerald-500" : "bg-[#aeb1bd]"}`}
            />
            {organization?.active
              ? "Workspace active"
              : "Workspace unavailable"}
          </div>
        </header>

        <section className="soft-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <OrganizationStat
            icon={<Building2 className="size-4" />}
            label="Organizations"
            value={organization ? "1" : "0"}
            tone="indigo"
          />
          <OrganizationStat
            icon={<AppWindow className="size-4" />}
            label="Applications"
            value={application ? "1" : "0"}
            tone="violet"
          />
          <OrganizationStat
            icon={<UsersRound className="size-4" />}
            label="Team members"
            value="4"
            tone="green"
          />
          <OrganizationStat
            icon={<Activity className="size-4" />}
            label="Current plan"
            value="Starter"
            tone="amber"
          />
        </section>

        <div className="rounded-[18px] border border-[#e5e7ef] bg-[#fafafd] p-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1">
              <TabButton
                active={activeTab === "organizations"}
                icon={<Building2 className="size-5" />}
                label="Organizations"
                onClick={() => setActiveTab("organizations")}
              />
              <TabButton
                active={activeTab === "applications"}
                icon={<Grid2X2 className="size-5" />}
                label="Applications"
                onClick={() => setActiveTab("applications")}
              />
            </div>
            {activeTab === "applications" ? (
              <Button
                className="h-10 w-full rounded-xl bg-[#5964d6] px-4 text-white shadow-[0_7px_16px_rgba(89,100,214,.18)] hover:bg-[#4f5acb] sm:w-auto"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="size-4" />
                New application
              </Button>
            ) : (
              <span className="hidden rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#878b9b] shadow-sm sm:inline-flex">
                {organization ? "1 workspace" : "No workspace"}
              </span>
            )}
          </div>
        </div>

        {activeTab === "organizations" ? (
          organization ? (
            <OrganizationCard
              organization={organization}
              applicationCount={application ? 1 : 0}
              onDetails={() => setIsOrganizationOpen(true)}
              onToggle={() => setOrganizationAction("disable")}
              onDelete={() => setOrganizationAction("delete")}
            />
          ) : (
            <EmptyOrganization
              onRestore={() => setOrganization(initialOrganization)}
            />
          )
        ) : (
          <ApplicationsPanel
            application={application}
            onCreate={() => setIsCreateOpen(true)}
            onDetails={() => setIsDetailsOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
            onToggleActive={() =>
              updateApplication("active", !application?.active)
            }
            onDelete={() => setApplication(null)}
          />
        )}
      </div>

      {organization ? (
        <CreateApplicationSheet
          form={form}
          open={isCreateOpen}
          organization={organization}
          onCreate={createApplication}
          onOpenChange={setIsCreateOpen}
          onUpdate={updateForm}
        />
      ) : null}

      <ApplicationDetailsDialog
        application={application}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onOpenSettings={openSettings}
      />
      {organization ? (
        <OrganizationDialog
          key={`${organization.slug}-${isOrganizationOpen}`}
          organization={organization}
          open={isOrganizationOpen}
          onOpenChange={setIsOrganizationOpen}
          onSave={setOrganization}
        />
      ) : null}
      {organization && organizationAction ? (
        <OrganizationActionDialog
          organization={organization}
          action={organizationAction}
          open
          onOpenChange={(open) => !open && setOrganizationAction(null)}
          onConfirm={() => {
            if (organizationAction === "delete") {
              setOrganization(null);
              setApplication(null);
            } else {
              setOrganization((current) =>
                current ? { ...current, active: !current.active } : current,
              );
            }
            setOrganizationAction(null);
          }}
        />
      ) : null}
    </div>
  );
}

function EmptyOrganization({ onRestore }: { onRestore: () => void }) {
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

function OrganizationDialog({
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

function OrganizationActionDialog({
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

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition sm:flex-none",
        active
          ? "bg-white text-[#5964d6] shadow-sm ring-1 ring-[#e6e8f2]"
          : "text-[#74798b] hover:bg-white/70 hover:text-[#3e4354]",
      )}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function OrganizationCard({
  organization,
  applicationCount,
  onDetails,
  onToggle,
  onDelete,
}: {
  organization: OrganizationRecord;
  applicationCount: number;
  onDetails: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
      <section className="soft-lift relative overflow-hidden rounded-[24px] border border-[#e2e5f1] bg-gradient-to-br from-[#f7f8ff] via-white to-[#faf6ff] p-6 shadow-[0_18px_55px_rgba(48,53,88,.07)] sm:p-7">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-[#e5e7ff]/60 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#5964d6] to-[#8069d9] text-base font-bold text-white shadow-[0_10px_25px_rgba(89,100,214,.24)]">
                {organization.initial}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-[-.025em] text-[#303444]">
                    {organization.name}
                  </h2>
                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${organization.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#dedfe5] bg-[#f3f3f5] text-[#757987]"}`}
                  >
                    {organization.active ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-[#858a9b]">
                  {organization.slug}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Organization actions"
                  className="flex size-9 items-center justify-center rounded-xl border border-[#e1e3ec] bg-white text-[#777c8d] shadow-sm"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDetails}>
                  View & edit details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggle}>
                  {organization.active
                    ? "Disable organization"
                    : "Enable organization"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                  Delete organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-7 grid gap-3 border-t border-[#e7e9f1] pt-5 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a0a4b2]">
                Created
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#555a6b]">
                {organization.createdAt}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a0a4b2]">
                Applications
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#555a6b]">
                {applicationCount} of 5
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a0a4b2]">
                Environment
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#555a6b]">
                <span
                  className={`size-2 rounded-full ${organization.active ? "soft-status-pulse bg-emerald-500" : "bg-[#aaaeba]"}`}
                />
                {organization.active ? "Production" : "Paused"}
              </p>
            </div>
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <section className="rounded-[20px] border border-[#e4e6ee] bg-white p-5 shadow-[0_10px_35px_rgba(44,48,75,.04)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3b3f4f]">
              Recent activity
            </h3>
            <span className="soft-status-pulse size-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-4 space-y-4">
            <ActivityItem
              title="Workspace reviewed"
              detail="Just now"
              tone="indigo"
            />
            <ActivityItem
              title={
                applicationCount
                  ? "Application connected"
                  : "Organization created"
              }
              detail={applicationCount ? "Lynara ERP" : organization.createdAt}
              tone="violet"
            />
            <ActivityItem
              title="Security settings verified"
              detail="Production ready"
              tone="green"
            />
          </div>
        </section>
      </aside>
    </div>
  );
}

function ActivityItem({
  title,
  detail,
  tone,
}: {
  title: string;
  detail: string;
  tone: "indigo" | "violet" | "green";
}) {
  const tones = {
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    green: "bg-emerald-500",
  };
  return (
    <div className="flex gap-3">
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${tones[tone]}`} />
      <div>
        <p className="text-xs font-semibold text-[#555a6b]">{title}</p>
        <p className="mt-1 text-[10px] text-[#999dab]">{detail}</p>
      </div>
    </div>
  );
}

function OrganizationStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "indigo" | "violet" | "green" | "amber";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <article className="soft-lift flex items-center gap-3 rounded-2xl border border-[#e7e9f1] bg-white p-4 shadow-[0_8px_24px_rgba(45,49,76,.035)]">
      <span
        className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#989cab]">
          {label}
        </p>
        <p className="mt-1 text-lg font-bold text-[#383c4c]">{value}</p>
      </div>
    </article>
  );
}

function ApplicationsPanel({
  application,
  onCreate,
  onDelete,
  onDetails,
  onSettings,
  onToggleActive,
}: {
  application: ApplicationRecord | null;
  onCreate: () => void;
  onDelete: () => void;
  onDetails: () => void;
  onSettings: () => void;
  onToggleActive: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-[-.02em] text-[#343849]">
            Workspace applications
          </h2>
          <p className="mt-1 text-xs text-[#858a9a]">
            Public applications connected to this organization.
          </p>
        </div>
        <span className="rounded-full bg-[#f2f3f8] px-3 py-1.5 text-[10px] font-bold text-[#757a8c]">
          {application ? "1" : "0"} / 5 used
        </span>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e4e6ee] bg-white shadow-[0_12px_40px_rgba(44,48,75,.045)]">
        {application ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-[#eceef3] bg-[#fafafd] text-[10px] uppercase tracking-[.1em] text-[#8c91a1]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Slug</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 font-semibold">Public URL</th>
                  <th className="px-5 py-4 font-semibold">Allowed domains</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eeeeef] last:border-0 hover:bg-[#fcfcfe]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <AppWindow className="size-4" />
                      </span>
                      <span className="font-semibold text-[#3b3f50]">
                        {application.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.slug}
                  </td>
                  <td className="px-5 py-4">
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-bold uppercase text-emerald-700 hover:bg-emerald-50">
                      {application.active ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.createdAt}
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.publicUrl}
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.allowedDomains}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-xl border-[#e1e3eb]"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={onDetails}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onSettings}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onToggleActive}>
                          Disable
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={onDelete}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef0ff] to-[#f5efff] text-[#6570d5]">
              <AppWindow className="size-6" />
            </span>
            <h3 className="mt-5 text-sm font-bold text-[#3b3f4f]">
              No application yet
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-5 text-[#858a9a]">
              Create your first application to connect a website and start
              configuring the AI experience.
            </p>
            <Button
              className="mt-5 rounded-xl bg-[#5964d6] text-white shadow-sm hover:bg-[#4f5acb]"
              onClick={onCreate}
            >
              <Plus className="size-4" />
              New application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateApplicationSheet({
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

function ApplicationDetailsDialog({
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

function ApplicationSettings({
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
  const tokenValue = showToken ? application.token : "eyJhbGci...KPnR_zuc";

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
                onChange={(event) =>
                  onUpdate("description", event.target.value)
                }
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
                onChange={(event) =>
                  onUpdate("allowedDomains", event.target.value)
                }
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

        <SettingsCard title="Widget credentials">
          <p className="text-sm text-[#777782]">
            Server-signed token. Never commit this secret; store it in your
            database and inject it at HTML render time from your backend.
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

        <section className="rounded-[20px] border border-[#e4e6ee] bg-[#f8f8fb] p-6">
          <h2 className="text-lg font-semibold">Integration</h2>
          <p className="mt-2 text-sm text-[#777782]">
            Sample bootstrap call - adjust the URL to your API deployment.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-md border border-[#e5e5e7] bg-white px-4 py-3 text-sm text-[#333333]">
            GET
            https://guidia.dev/widget/bootstrap?token=&lt;TOKEN&gt;&amp;app_id=
            {application.id}
          </pre>
          <button
            className="mt-5 text-sm font-semibold text-[#55555f] hover:text-[#171717]"
            type="button"
            onClick={() =>
              onCopy(
                `GET https://guidia.dev/widget/bootstrap?token=<TOKEN>&app_id=${application.id}`,
              )
            }
          >
            Copy template (without token)
          </button>
        </section>

        <SettingsCard title="Current user API">
          <p className="text-sm text-[#777782]">
            Configure an endpoint on your app domain that the widget calls in
            the browser to resolve the signed-in user for conversations.
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
            Headers and body must be valid JSON. Leave body empty for GET
            requests.
          </p>
          <Button className="w-fit rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]">
            Save
          </Button>
        </SettingsCard>

        <section className="rounded-[20px] border border-red-100 bg-[#fffafa] p-6 text-red-700">
          <h2 className="text-lg font-semibold">Danger zone</h2>
          <p className="mt-2 text-sm text-red-700/80">
            Deleting an app also removes all related resources. This cannot be
            undone.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold">
              Once deleted, the application {application.name} and all of its
              content will be permanently lost.
            </p>
            <Button variant="destructive">Delete application</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function FormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#333333]">{label}</p>
      <p className="mt-1 break-all text-sm text-[#777782]">{value}</p>
    </div>
  );
}

function SettingsCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-[20px] border border-[#e4e6ee] bg-white p-6 shadow-[0_10px_35px_rgba(44,48,75,.04)]">
      <h2 className="text-lg font-bold tracking-[-.02em] text-[#383c4c]">
        {title}
      </h2>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function CredentialRow({
  actionLabel,
  label,
  onAction,
  onCopy,
  value,
}: {
  actionLabel?: string;
  label: string;
  onAction?: () => void;
  onCopy: () => void;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className={labelClass}>{label}</p>
        {actionLabel ? (
          <button
            className="text-xs font-semibold text-[#55555f] hover:text-[#171717]"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="flex gap-2">
        <div className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-[#e3e5ed] bg-[#f7f8fb] px-3 font-mono text-sm text-[#3d4151]">
          <KeyRound className="mr-2 size-4 text-[#777782]" />
          <span className="truncate">{value}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl"
          onClick={onCopy}
        >
          <Copy className="size-4" />
          Copy
        </Button>
      </div>
    </div>
  );
}
