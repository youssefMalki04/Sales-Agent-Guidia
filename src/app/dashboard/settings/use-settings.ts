"use client";

import { useEffect, useMemo, useState } from "react";

import { defaults, STORAGE_KEY } from "./settings-data";
import type { ScoringRule } from "./settings-types";

export function useSettings() {
  const [rules, setRules] = useState<ScoringRule[]>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = window.setTimeout(() => {
      try {
        const value = localStorage.getItem(STORAGE_KEY);
        if (value) setRules(JSON.parse(value));
      } catch {
        // Keep the default scoring rules when local storage is unavailable.
      }
    }, 0);

    return () => window.clearTimeout(load);
  }, []);

  const total = useMemo(
    () => rules.reduce((sum, rule) => sum + rule.points, 0),
    [rules],
  );

  const updateRule = (id: string, points: number) => {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, points: Math.max(0, points) } : rule,
      ),
    );
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const reset = () => {
    setRules(defaults);
    setSaved(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { rules, total, saved, updateRule, save, reset };
}
