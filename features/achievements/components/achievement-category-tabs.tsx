"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { AchievementCategory } from "../types";

export interface AchievementCategoryTabsProps {
  categories: AchievementCategory[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  totalCount: number;
}

export function AchievementCategoryTabs({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  totalCount,
}: AchievementCategoryTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
      <Button
        size="sm"
        variant={selectedCategorySlug === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
        className="h-8 text-xs font-semibold"
      >
        All Achievements ({totalCount})
      </Button>

      {categories.map((cat) => {
        const isSelected = selectedCategorySlug === cat.slug;
        return (
          <Button
            key={cat.id}
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelectCategory(cat.slug)}
            className="h-8 text-xs font-semibold"
          >
            {cat.name}
          </Button>
        );
      })}
    </div>
  );
}
