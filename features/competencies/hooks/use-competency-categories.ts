"use client";

import { useEffect, useCallback } from "react";
import { useCompetencyStore } from "../stores/use-competency-store";
import { getCompetencyCategoriesAction } from "../actions/competency-actions";

export function useCompetencyCategories() {
  const categories = useCompetencyStore((state) => state.categories);
  const selectedCategorySlug = useCompetencyStore((state) => state.selectedCategorySlug);
  const setSelectedCategorySlug = useCompetencyStore((state) => state.setSelectedCategorySlug);
  const setCategories = useCompetencyStore((state) => state.setCategories);
  const setError = useCompetencyStore((state) => state.setError);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCompetencyCategoriesAction();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories.");
    }
  }, [setCategories, setError]);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  return {
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    refetch: fetchCategories,
  };
}
