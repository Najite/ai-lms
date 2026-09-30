"use client";

import { useState, useEffect, useCallback } from "react";
import type { CompetencyGate, UserGateStatusView } from "../types";

/**
 * Hook to fetch all active competency gates
 */
export function useGates() {
  const [gates, setGates] = useState<CompetencyGate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/gates");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch gates");
      setGates(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load gates");
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
        const res = await fetch("/api/gates");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch gates");
          setGates(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load gates");
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

  return { gates, isLoading, error, refetch: fetchGates };
}

/**
 * Hook to fetch user gate overview statuses
 */
export function useUserGatesOverview() {
  const [overview, setOverview] = useState<UserGateStatusView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/users/me/gates");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch user gate overview");
      setOverview(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load user gate overview");
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
        const res = await fetch("/api/users/me/gates");
        const json = await res.json();
        if (!ignore) {
          if (!res.ok) throw new Error(json.error || "Failed to fetch user gate overview");
          setOverview(json.data || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load user gate overview");
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

  return { overview, isLoading, error, refetch: fetchOverview };
}
