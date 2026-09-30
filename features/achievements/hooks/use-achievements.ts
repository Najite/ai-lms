"use client";

import { useEffect, useCallback } from "react";
import {
  useAchievementStore,
  useXPStore,
} from "../stores/use-achievement-store";
import {
  getAchievementsAction,
  getAchievementCategoriesAction,
  getUserAchievementsAction,
  getUserXPBalanceAction,
  getUserXPTransactionsAction,
} from "../actions/achievement-actions";

/**
 * Hook to fetch and filter achievement catalogue
 */
export function useAchievements() {
  const {
    achievements,
    categories,
    selectedCategorySlug,
    isLoading,
    error,
    setAchievements,
    setCategories,
    setSelectedCategorySlug,
    setLoading,
    setError,
  } = useAchievementStore();

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [achRes, catRes] = await Promise.all([
        getAchievementsAction(),
        getAchievementCategoriesAction(),
      ]);

      if (achRes.success && achRes.data) {
        setAchievements(achRes.data);
      } else {
        setError(achRes.error || "Failed to load achievements.");
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  }, [setAchievements, setCategories, setLoading, setError]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [achRes, catRes] = await Promise.all([
          getAchievementsAction(),
          getAchievementCategoriesAction(),
        ]);

        if (!ignore) {
          if (achRes.success && achRes.data) {
            setAchievements(achRes.data);
          } else {
            setError(achRes.error || "Failed to load achievements.");
          }

          if (catRes.success && catRes.data) {
            setCategories(catRes.data);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load achievements.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [setAchievements, setCategories, setLoading, setError]);

  const filteredAchievements = selectedCategorySlug
    ? achievements.filter((a) => a.category?.slug === selectedCategorySlug)
    : achievements;

  return {
    achievements: filteredAchievements,
    allAchievements: achievements,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    isLoading,
    error,
    refetch: fetchAchievements,
  };
}

/**
 * Hook to fetch user-specific achievement progression and awards
 */
export function useUserAchievements() {
  const {
    userAchievements,
    isLoading,
    error,
    setUserAchievements,
    setLoading,
    setError,
  } = useAchievementStore();

  const fetchUserAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserAchievementsAction();
      if (res.success && res.data) {
        setUserAchievements(res.data);
      } else {
        setError(res.error || "Failed to load user achievements.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load user achievements.");
    } finally {
      setLoading(false);
    }
  }, [setUserAchievements, setLoading, setError]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserAchievementsAction();
        if (!ignore) {
          if (res.success && res.data) {
            setUserAchievements(res.data);
          } else {
            setError(res.error || "Failed to load user achievements.");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load user achievements.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [setUserAchievements, setLoading, setError]);

  const unlockedCount = userAchievements.filter((a) => a.isUnlocked).length;
  const inProgressCount = userAchievements.filter(
    (a) => !a.isUnlocked && a.progressValue > 0
  ).length;

  return {
    userAchievements,
    unlockedCount,
    inProgressCount,
    totalCount: userAchievements.length,
    isLoading,
    error,
    refetch: fetchUserAchievements,
  };
}

/**
 * Hook to fetch user's live XP Balance
 */
export function useXPBalance() {
  const { balance, isLoading, error, setBalance, setLoading, setError } =
    useXPStore();

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserXPBalanceAction();
      if (res.success && res.data) {
        setBalance(res.data);
      } else {
        setError(res.error || "Failed to load XP balance.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load XP balance.");
    } finally {
      setLoading(false);
    }
  }, [setBalance, setLoading, setError]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserXPBalanceAction();
        if (!ignore) {
          if (res.success && res.data) {
            setBalance(res.data);
          } else {
            setError(res.error || "Failed to load XP balance.");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load XP balance.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [setBalance, setLoading, setError]);

  return {
    balance,
    totalXp: balance?.totalXp || 0,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}

/**
 * Hook to fetch user's XP Transaction ledger history
 */
export function useXPTransactions(limit: number = 50) {
  const {
    transactions,
    isLoading,
    error,
    setTransactions,
    setLoading,
    setError,
  } = useXPStore();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserXPTransactionsAction(limit);
      if (res.success && res.data) {
        setTransactions(res.data);
      } else {
        setError(res.error || "Failed to load XP transactions.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load XP transactions.");
    } finally {
      setLoading(false);
    }
  }, [limit, setTransactions, setLoading, setError]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserXPTransactionsAction(limit);
        if (!ignore) {
          if (res.success && res.data) {
            setTransactions(res.data);
          } else {
            setError(res.error || "Failed to load XP transactions.");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load XP transactions.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [limit, setTransactions, setLoading, setError]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}
