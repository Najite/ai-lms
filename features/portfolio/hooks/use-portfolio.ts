"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  PortfolioSummaryView,
  PortfolioProject,
  PortfolioArtifact,
  PortfolioCompetency,
  PortfolioAchievement,
  PortfolioHiringSignal,
} from "../types";

/**
 * Hook to fetch complete portfolio summary
 */
export function usePortfolioSummary() {
  const [summary, setSummary] = useState<PortfolioSummaryView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio/summary");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio summary");
      setSummary(json.data || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load portfolio summary");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/portfolio/summary");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio summary");
          setSummary(json.data || null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load portfolio summary");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { summary, isLoading, error, refetch: fetchSummary };
}

/**
 * Hook to fetch portfolio projects
 */
export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio/projects");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio projects");
      setProjects(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load portfolio projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/portfolio/projects");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio projects");
          setProjects(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load portfolio projects");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { projects, isLoading, error, refetch: fetchProjects };
}

/**
 * Hook to fetch portfolio artifacts
 */
export function usePortfolioArtifacts() {
  const [artifacts, setArtifacts] = useState<PortfolioArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtifacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio/artifacts");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio artifacts");
      setArtifacts(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load portfolio artifacts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/portfolio/artifacts");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio artifacts");
          setArtifacts(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load portfolio artifacts");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { artifacts, isLoading, error, refetch: fetchArtifacts };
}

/**
 * Hook to fetch portfolio competencies
 */
export function usePortfolioCompetencies() {
  const [competencies, setCompetencies] = useState<PortfolioCompetency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetencies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio/competencies");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio competencies");
      setCompetencies(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load portfolio competencies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/portfolio/competencies");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio competencies");
          setCompetencies(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load portfolio competencies");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { competencies, isLoading, error, refetch: fetchCompetencies };
}

/**
 * Hook to fetch portfolio achievements
 */
export function usePortfolioAchievements() {
  const [achievements, setAchievements] = useState<PortfolioAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio/achievements");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio achievements");
      setAchievements(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load portfolio achievements");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/portfolio/achievements");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio achievements");
          setAchievements(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load portfolio achievements");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { achievements, isLoading, error, refetch: fetchAchievements };
}

/**
 * Hook to fetch portfolio hiring signals
 */
export function usePortfolioHiringSignals() {
  const [signals, setSignals] = useState<PortfolioHiringSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio/hiring-signals");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio hiring signals");
      setSignals(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load portfolio hiring signals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/portfolio/hiring-signals");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch portfolio hiring signals");
          setSignals(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load portfolio hiring signals");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { signals, isLoading, error, refetch: fetchSignals };
}
