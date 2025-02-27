/**
 * Interface for search engine definition
 */
export interface Engine {
  /** Unique identifier for the search engine */
  engine: string;

  /** Path to the light mode icon */
  image: string;

  /** Optional path to the dark mode icon */
  darkImage?: string;

  /** URL template for search, use {searchTerm} placeholder for the query */
  url: string;

  /** Optional additional information about the search engine */
  notes?: string;
}

/**
 * Interface for engine preferences in user settings
 */
export interface EnginePreferences {
  [key: string]: {
    /** Whether the engine is enabled */
    enabled: boolean;

    /** Order position (lower numbers appear first) */
    order: number;
  };
}

/**
 * Theme type definitions
 */
export type Theme = "light" | "dark" | "system";
