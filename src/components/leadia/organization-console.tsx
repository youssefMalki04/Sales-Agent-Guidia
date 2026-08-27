"use client";

import { useState } from "react";
import {
  Activity,
  AppWindow,
  Building2,
  CheckCircle2,
  Grid2X2,
  Plus,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  ActiveTab,
  ApplicationForm,
  ApplicationRecord,
  OrganizationRecord,
} from "./organization-data";
import {
  defaultApplicationForm,
  initialOrganization,
} from "./organization-data";
import { ApplicationSettings } from "./organization-settings";
import {
  ApplicationDetailsDialog,
  CreateApplicationSheet,
} from "./organization-application-dialogs";
import {
  ApplicationsPanel,
  EmptyOrganization,
  OrganizationActionDialog,
  OrganizationCard,
  OrganizationDialog,
  OrganizationStat,
  TabButton,
} from "./organization-console-sections";

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
