"use client";

import { useMemo, useState } from "react";

import { initialForm, platformSkills } from "./skill-data";
import type { SkillForm, SkillPack, SkillSource } from "./skill-types";

type SkillFilter = "all" | SkillSource;

export function useSkills() {
  const [filter, setFilter] = useState<SkillFilter>("all");
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState<SkillPack[]>(platformSkills);
  const [selectedSkill, setSelectedSkill] = useState<SkillPack | null>(null);
  const [detailLanguage, setDetailLanguage] = useState("EN");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState<SkillForm>(initialForm);

  const filteredSkills = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesSource = filter === "all" || skill.source === filter;
      const matchesQuery =
        !normalizedQuery ||
        skill.label.toLowerCase().includes(normalizedQuery) ||
        skill.key.toLowerCase().includes(normalizedQuery) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesSource && matchesQuery;
    });
  }, [filter, query, skills]);

  const platformCount = skills.filter(
    (skill) => skill.source === "platform",
  ).length;
  const customCount = skills.filter(
    (skill) => skill.source === "custom",
  ).length;

  const canContinue =
    wizardStep === 1
      ? form.label.trim().length > 1
      : wizardStep === 2
        ? form.mission.trim().length > 10
        : true;

  function openDetails(skill: SkillPack) {
    setSelectedSkill(skill);
    setDetailLanguage(
      skill.languages.includes("EN") ? "EN" : skill.languages[0],
    );
  }

  function closeDetails() {
    setSelectedSkill(null);
  }

  function openWizard() {
    setForm(initialForm);
    setWizardStep(1);
    setWizardOpen(true);
  }

  function closeWizard() {
    setWizardOpen(false);
    setWizardStep(1);
    setForm(initialForm);
  }

  function previousWizardStep() {
    setWizardStep((current) => Math.max(1, current - 1));
  }

  function nextWizardStep() {
    setWizardStep((current) => Math.min(5, current + 1));
  }

  function createSkill() {
    const focusAreas = form.focusAreasText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const skill: SkillPack = {
      id: `custom-${Date.now()}`,
      key:
        form.key.trim() ||
        form.label
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      label: form.label.trim(),
      source: "custom",
      packType: form.packType,
      executionMode: form.executionMode,
      languages: ["FR", "EN"],
      tags: focusAreas.slice(0, 4),
      focusAreas,
      accent: "violet",
      translations: [
        {
          language: "FR",
          mission: form.mission.trim(),
          activation: form.activation.trim(),
          capabilities: form.capabilities.trim(),
        },
        {
          language: "EN",
          mission: form.mission.trim(),
          activation: form.activation.trim(),
          capabilities: form.capabilities.trim(),
        },
      ],
    };

    setSkills((current) => [current[0], skill, ...current.slice(1)]);
    closeWizard();
  }

  function deleteSkill(id: string) {
    setSkills((current) => current.filter((skill) => skill.id !== id));
  }

  return {
    canContinue,
    closeDetails,
    closeWizard,
    createSkill,
    customCount,
    deleteSkill,
    detailLanguage,
    filter,
    filteredSkills,
    form,
    nextWizardStep,
    openDetails,
    openWizard,
    platformCount,
    previousWizardStep,
    query,
    selectedSkill,
    setDetailLanguage,
    setFilter,
    setForm,
    setQuery,
    wizardOpen,
    wizardStep,
  };
}
