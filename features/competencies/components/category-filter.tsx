import React from "react";
import type { CompetencyCategory } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CategoryFilterProps {
  categories: CompetencyCategory[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant={selectedCategorySlug === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className="rounded-full text-xs h-8 px-4"
      >
        All Categories
      </Button>

      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selectedCategorySlug === cat.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(cat.slug)}
          className="rounded-full text-xs h-8 px-4"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
