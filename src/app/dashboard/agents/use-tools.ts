"use client";

import { useMemo, useState } from "react";

import { initialIntegrations } from "./tool-data";
import type { Integration, ToolPolicy, ToolsSubTab } from "./tool-types";

const TOAST_DURATION_MS = 3000;
const CONNECTION_TEST_DURATION_MS = 1300;

export function useTools() {
  const [subTab, setSubTab] = useState<ToolsSubTab>("integrations");
  const [integrations, setIntegrations] =
    useState<Integration[]>(initialIntegrations);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selectedIntegration = useMemo(
    () =>
      integrations.find(
        (integration) => integration.id === selectedIntegrationId,
      ) ?? null,
    [integrations, selectedIntegrationId],
  );

  const connectedCount = integrations.filter(
    (integration) => integration.configured,
  ).length;
  const activeCount = integrations.filter(
    (integration) => integration.active,
  ).length;

  function updateIntegration(
    id: string,
    updater: (integration: Integration) => Integration,
  ) {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === id ? updater(integration) : integration,
      ),
    );
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }

  function openCredentials(integration: Integration) {
    const emptyValues = integration.credentialFields.reduce<
      Record<string, string>
    >((values, field) => {
      values[field.key] = "";
      return values;
    }, {});

    setCredentials(emptyValues);
    setSelectedIntegrationId(integration.id);
  }

  function closeCredentials() {
    setSelectedIntegrationId(null);
  }

  function setCredentialValue(key: string, value: string) {
    setCredentials((current) => ({ ...current, [key]: value }));
  }

  function saveCredentials() {
    if (!selectedIntegration) return;

    const missingRequiredValue = selectedIntegration.credentialFields.some(
      (field) => !credentials[field.key]?.trim(),
    );

    if (missingRequiredValue) return;

    updateIntegration(selectedIntegration.id, (integration) => ({
      ...integration,
      configured: true,
    }));

    closeCredentials();
    showToast(`${selectedIntegration.name} connected`);
  }

  function toggleIntegration(id: string) {
    updateIntegration(id, (integration) => ({
      ...integration,
      active: !integration.active,
    }));
  }

  function changePolicy(id: string, policy: ToolPolicy) {
    updateIntegration(id, (integration) => ({ ...integration, policy }));
  }

  function testIntegration(id: string) {
    setTestingId(id);

    window.setTimeout(() => {
      setTestingId(null);
      const integration = integrations.find((item) => item.id === id);
      showToast(`${integration?.name ?? "Integration"} connection successful`);
    }, CONNECTION_TEST_DURATION_MS);
  }

  return {
    activeCount,
    changePolicy,
    closeCredentials,
    connectedCount,
    credentials,
    integrations,
    openCredentials,
    saveCredentials,
    selectedIntegration,
    setCredentialValue,
    setSubTab,
    subTab,
    testIntegration,
    testingId,
    toast,
    toggleIntegration,
  };
}
