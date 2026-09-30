"use client";

import React, { useState } from "react";
import { Search, Terminal } from "lucide-react";
import { AchievementCard } from "./achievement-card";
import { AchievementCategoryTabs } from "./achievement-category-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserAchievementView, AchievementCategory } from "../types";

export interface AchievementProgressListProps {
  userAchievements: UserAchievementView[];
  categories: AchievementCategory[];
  isLoading?: boolean;
}

export function AchievementProgressList({
  userAchievements,
  categories,
  isLoading = false,
}: AchievementProgressListProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnlocked, setFilterUnlocked] = useState<"all" | "unlocked" | "locked">("all");

  const filtered = userAchievements.filter((item) => {
    const matchesCategory =
      !selectedCategorySlug ||
      item.achievement.category?.slug === selectedCategorySlug;

    const matchesSearch =
      !searchQuery ||
      item.achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.achievement.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterUnlocked === "all" ||
      (filterUnlocked === "unlocked" && item.isUnlocked) ||
      (filterUnlocked === "locked" && !item.isUnlocked);

    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <AchievementCategoryTabs
        categories={categories}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategory={setSelectedCategorySlug}
        totalCount={userAchievements.length}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filterUnlocked === "all" ? "default" : "ghost"}
            onClick={() => setFilterUnlocked("all")}
            className="h-8 text-xs font-mono"
          >
            All ({userAchievements.length})
          </Button>
          <Button
            size="sm"
            variant={filterUnlocked === "unlocked" ? "default" : "ghost"}
            onClick={() => setFilterUnlocked("unlocked")}
            className="h-8 text-xs font-mono text-emerald-400"
          >
            Unlocked ({userAchievements.filter((u) => u.isUnlocked).length})
          </Button>
          <Button
            size="sm"
            variant={filterUnlocked === "locked" ? "default" : "ghost"}
            onClick={() => setFilterUnlocked("locked")}
            className="h-8 text-xs font-mono text-muted-foreground"
          >
            Locked ({userAchievements.filter((u) => !u.isUnlocked).length})
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs pl-8 font-mono"
          />
        </div>
      </div>

      {/* Achievement Grid */}
      {isLoading ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
          <p className="text-xs text-muted-foreground font-mono">Loading achievements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
          <Terminal className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-bold text-foreground">No Achievements Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            No achievements match your filter or search criteria.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedCategorySlug(null);
              setSearchQuery("");
              setFilterUnlocked("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <AchievementCard key={item.achievement.id} userAchievement={item} />
          ))}
        </div>
      )}
    </div>
  );
}
