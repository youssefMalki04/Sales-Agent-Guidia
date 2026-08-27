"use client";

import { FormEvent, useEffect, useState } from "react";

import { initialSettings, STORAGE_KEY } from "./privacy-data";
import type { PrivacySettings } from "./privacy-types";

export function usePrivacy() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [requestResult, setRequestResult] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSettings({
            ...initialSettings,
            ...(JSON.parse(stored) as PrivacySettings),
          });
        }
      } catch {
        // Keep safe defaults if browser storage cannot be read.
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const update = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const changeRequestEmail = (email: string) => {
    setRequestEmail(email);
    setRequestResult(null);
  };

  const handleDataRequest = (event: FormEvent, action: "export" | "delete") => {
    event.preventDefault();
    if (!requestEmail.trim()) return;

    setRequestResult(
      action === "export"
        ? `Frontend demo: an export was prepared for ${requestEmail}.`
        : `Frontend demo: deletion request created for ${requestEmail}.`,
    );
  };

  return {
    settings,
    saved,
    save,
    update,
    requestEmail,
    requestResult,
    changeRequestEmail,
    handleDataRequest,
  };
}
