"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// Types
// ============================================================

export interface AppearanceSettings {
  density: "compact" | "comfortable" | "spacious";
  animationsEnabled: boolean;
}

export interface AIEngineSettings {
  weightTrends: number;       // 0-100
  weightReddit: number;       // 0-100
  weightFacebook: number;     // 0-100
  weightAIConfidence: number; // 0-100
  generationMode: "conservative" | "balanced" | "aggressive";
  openAIFallback: boolean;
}

export interface MarketSettings {
  defaultCountry: string;
  defaultPeriod: "now" | "7d" | "30d" | "90d" | "all";
  aiOutputLanguage: "pt" | "en" | "es" | "fr";
  minScoreDisplay: number; // 0-100
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailDigest: boolean;
  scoreAlertThreshold: number; // 0-100, 0 = disabled
  newOpportunityAlert: boolean;
}

export interface AllSettings {
  appearance: AppearanceSettings;
  aiEngine: AIEngineSettings;
  market: MarketSettings;
  notifications: NotificationSettings;
}

// ============================================================
// Defaults
// ============================================================

export const DEFAULT_SETTINGS: AllSettings = {
  appearance: {
    density: "comfortable",
    animationsEnabled: true,
  },
  aiEngine: {
    weightTrends: 30,
    weightReddit: 25,
    weightFacebook: 20,
    weightAIConfidence: 25,
    generationMode: "balanced",
    openAIFallback: false,
  },
  market: {
    defaultCountry: "ALL",
    defaultPeriod: "now",
    aiOutputLanguage: "pt",
    minScoreDisplay: 0,
  },
  notifications: {
    pushEnabled: false,
    emailDigest: false,
    scoreAlertThreshold: 80,
    newOpportunityAlert: true,
  },
};

const STORAGE_KEY = "viralbook-settings";

// ============================================================
// Hook
// ============================================================

export function useSettings() {
  const [settings, setSettingsState] = useState<AllSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AllSettings>;
        setSettingsState((prev) => deepMerge(prev, parsed));
      }
    } catch {
      // Ignore parse errors, use defaults
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage on every change (after initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, loaded]);

  const updateSettings = useCallback(
    <K extends keyof AllSettings>(
      section: K,
      updates: Partial<AllSettings[K]>
    ) => {
      setSettingsState((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...updates },
      }));
    },
    []
  );

  const resetSection = useCallback(
    <K extends keyof AllSettings>(section: K) => {
      setSettingsState((prev) => ({
        ...prev,
        [section]: DEFAULT_SETTINGS[section],
      }));
    },
    []
  );

  const resetAll = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  return { settings, loaded, updateSettings, resetSection, resetAll };
}

// ============================================================
// Utility: deep merge (2-level)
// ============================================================

function deepMerge<T extends Record<string, any>>(
  base: T,
  overrides: Partial<T>
): T {
  const result = { ...base };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const val = overrides[key];
    if (
      val !== undefined &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      val !== null
    ) {
      result[key] = { ...base[key], ...val };
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}
