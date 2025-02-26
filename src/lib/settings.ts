import { engines as defaultEngines } from "./engines";

export interface EnginePreferences {
  [key: string]: {
    enabled: boolean;
    order: number;
  };
}

const STORAGE_KEY = "engine-preferences";

export function getEnginePreferences(): EnginePreferences {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Default all engines to enabled with sequential order
    const defaults = defaultEngines.reduce((acc, engine, index) => {
      acc[engine.engine] = {
        enabled: true,
        order: index,
      };
      return acc;
    }, {} as EnginePreferences);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
}

export function saveEnginePreferences(preferences: EnginePreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function getEnabledEngines() {
  const prefs = getEnginePreferences();
  return defaultEngines
    .filter((engine) => prefs[engine.engine]?.enabled)
    .sort((a, b) => {
      const orderA = prefs[a.engine]?.order ?? 0;
      const orderB = prefs[b.engine]?.order ?? 0;
      return orderA - orderB;
    });
}
