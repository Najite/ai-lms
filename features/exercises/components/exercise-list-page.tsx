"use client";

import React, { useState } from "react";
import {
  Code2,
  Terminal,
  Search,
} from "lucide-react";
import { ExerciseCard } from "./exercise-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExerciseWithDetails, ExerciseCategory } from "../types";

export interface ExerciseListPageProps {
  exercises: ExerciseWithDetails[];
  categories: ExerciseCategory[];
  totalEvidenceCount: number;
}

export function ExerciseListPage({
  exercises,
  categories,
  totalEvidenceCount,
}: ExerciseListPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exercises.filter((ex) => {
    const matchesCategory =
      !selectedCategory || ex.category?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.competencies.some((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const totalCount = exercises.length;
  const completedCount = exercises.filter((e) => !!e.userCompletion).length;
  const inProgressCount = exercises.filter(
    (e) => !e.userCompletion && !!e.activeAttempt
  ).length;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-card border border-border/70 p-6 md:p-8">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1.5 px-3 py-1 font-semibold text-xs"
            >
              <Code2 className="h-3.5 w-3.5" />
              Practical Assessment Engine
            </Badge>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-mono text-xs"
            >
              Zero-Simulations
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Engineering Exercise Workspace
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Reinforce lesson concepts and demonstrate core engineering competencies through rigorous, automated code verification. Every validated submission produces auditable evidence.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Exercises
              </div>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                {totalCount}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
                Completed
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {completedCount}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
                In Progress
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
                {inProgressCount}
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-primary uppercase tracking-wider">
                Evidence Preserved
              </div>
              <div className="text-2xl font-bold font-mono text-primary mt-0.5">
                {totalEvidenceCount}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="h-8 text-xs font-semibold"
            >
              All Categories ({totalCount})
            </Button>
            {categories.map((cat) => {
              const count = exercises.filter((e) => e.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.slug;
              return (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className="h-8 text-xs font-semibold"
                >
                  {cat.name} ({count})
                </Button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs pl-8 font-mono"
            />
          </div>
        </div>

        {/* Exercise Grid */}
        {filteredExercises.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
            <Terminal className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-bold text-foreground">No Exercises Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
              No exercises match your search and category filter.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
