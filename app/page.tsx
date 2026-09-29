import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { UserMenu } from "@/features/auth";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-card">
      {/* Navigation Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-base font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
            {siteConfig.shortName}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full space-y-8 my-auto">
          <div className="text-center space-y-3">
            <Badge variant="success" className="px-3 py-1 text-xs">
              Learning Domain Active • Phase 003
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {siteConfig.name}
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Master specification-driven engineering, context architecture, and agentic workflows through structured learning paths, modules, and lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Learning Paths</CardTitle>
                <CardDescription className="text-xs">Curated Tracks & Modules</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Structured multi-module paths covering AI-native paradigms, SDD, and agentic execution.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Interactive Studio</CardTitle>
                <CardDescription className="text-xs">Lesson Viewer & Traversal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Rich markdown reader, code snippets, adjacent lesson navigation, and bidirectional progress.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Real-Time Progress</CardTitle>
                <CardDescription className="text-xs">Dynamic Progress Engine</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Automated progress calculation across lessons, modules, and entire learning paths with RLS.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button variant="default" size="lg" asChild className="gap-2 shadow-lg shadow-primary/20">
              <Link href="/learning-paths">Browse Learning Paths</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="gap-2">
              <Link href="/exercises">Practice Exercises</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/competencies">Competencies Matrix</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
