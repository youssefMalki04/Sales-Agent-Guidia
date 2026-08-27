"use client";

import { useState } from "react";

import {
  salesAgentForm as salesForm,
  supportAgentForm as supportForm,
} from "./agent-presets";
import type {
  AgentBlueprintTab,
  AgentDetailTab,
  AgentForm,
  AgentProfile,
  AgentTemplate,
} from "./agent-types";
import { useAgentProfiles } from "./use-agent-profiles";

export function useAgentStudio() {
  const { profiles, setProfiles, resetProfiles } = useAgentProfiles();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [blueprintTab, setBlueprintTab] =
    useState<AgentBlueprintTab>("context");
  const [form, setForm] = useState<AgentForm>(supportForm);
  const [selected, setSelected] = useState<AgentProfile | null>(null);
  const [detailTab, setDetailTab] = useState<AgentDetailTab>("overview");
  const [quickView, setQuickView] = useState<AgentProfile | null>(null);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testProfile, setTestProfile] = useState<AgentProfile | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const openWizard = (template: AgentTemplate = "support") => {
    setForm(template === "support" ? supportForm : salesForm);
    setStep(1);
    setBlueprintTab("context");
    setEditingId(null);
    setWizardOpen(true);
  };

  const editProfile = (profile: AgentProfile) => {
    setForm(profile);
    setEditingId(profile.id);
    setStep(2);
    setWizardOpen(true);
  };

  const saveAgent = () => {
    const now = new Date().toLocaleString("fr-FR");

    if (editingId) {
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === editingId
            ? { ...profile, ...form, updatedAt: now }
            : profile,
        ),
      );
      showNotice(`Profile “${form.name}” updated.`);
      setEditingId(null);
      setWizardOpen(false);
      return;
    }

    const profile: AgentProfile = {
      ...form,
      id: crypto.randomUUID(),
      status: "draft",
      integrationStatus: "not_configured",
      isDefault: profiles.length === 0,
      createdAt: now,
      updatedAt: now,
    };
    setProfiles((current) => [...current, profile]);
    showNotice(`Profile “${profile.name}” created.`);
    setWizardOpen(false);
  };

  const resetDemo = () => {
    if (!window.confirm("Reset all frontend demo agents?")) return;
    resetProfiles();
    showNotice("Demo agents reset.");
  };

  const cloneProfile = (profile: AgentProfile) => {
    const now = new Date().toLocaleString("fr-FR");
    setProfiles((current) => [
      ...current,
      {
        ...profile,
        id: crypto.randomUUID(),
        name: `${profile.name} copy`,
        status: "draft",
        integrationStatus: "not_configured",
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  };

  const makeDefault = (profile: AgentProfile) => {
    setProfiles((current) =>
      current.map((item) => ({
        ...item,
        isDefault: item.id === profile.id,
      })),
    );
  };

  const deleteProfile = (profile: AgentProfile) => {
    if (!window.confirm(`Delete “${profile.name}”?`)) return;

    setProfiles((current) => current.filter((item) => item.id !== profile.id));
    showNotice(`Profile “${profile.name}” deleted.`);
  };

  const changeStatus = (profile: AgentProfile) => {
    const status = profile.status === "published" ? "paused" : "published";
    setProfiles((current) =>
      current.map((item) =>
        item.id === profile.id
          ? {
              ...item,
              status,
              updatedAt: new Date().toLocaleString("fr-FR"),
            }
          : item,
      ),
    );
    showNotice(`Profile “${profile.name}” ${status}.`);
  };

  const closeDetails = () => {
    setSelected(null);
    setDetailTab("overview");
  };

  const openQuickViewProfile = () => {
    if (quickView) setSelected(quickView);
    setQuickView(null);
  };

  return {
    profiles,
    wizardOpen,
    setWizardOpen,
    step,
    setStep,
    blueprintTab,
    setBlueprintTab,
    form,
    setForm,
    selected,
    setSelected,
    detailTab,
    setDetailTab,
    quickView,
    setQuickView,
    notice,
    testProfile,
    setTestProfile,
    openWizard,
    editProfile,
    saveAgent,
    resetDemo,
    cloneProfile,
    makeDefault,
    deleteProfile,
    changeStatus,
    closeDetails,
    openQuickViewProfile,
  };
}
