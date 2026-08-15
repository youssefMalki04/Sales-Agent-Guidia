"use client";

import { type SetStateAction, useCallback, useEffect, useState } from "react";

import type { AgentProfile } from "./agent-types";

const STORAGE_KEY = "guidia-agent-profiles-v1";

function normalizeProfiles(value: unknown): AgentProfile[] {
  if (!Array.isArray(value)) return [];
  return value.filter((profile): profile is AgentProfile => Boolean(profile && typeof profile === "object" && "id" in profile && "name" in profile)).map((profile) => ({ ...profile, status: profile.status ?? "draft", integrationStatus: profile.integrationStatus ?? "not_configured" }));
}

export function useAgentProfiles() {
  const [profiles, setProfilesState] = useState<AgentProfile[]>([]);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        setProfilesState(normalizeProfiles(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")));
      } catch {
        setProfilesState([]);
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  const setProfiles = useCallback((action: SetStateAction<AgentProfile[]>) => {
    setProfilesState((current) => {
      const next = typeof action === "function" ? action(current) : action;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetProfiles = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfilesState([]);
  }, []);

  return { profiles, setProfiles, resetProfiles };
}
