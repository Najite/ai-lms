import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AuthCardProps {
  title: string;
  description: string;
  badgeText?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, description, badgeText, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-80" />
        <CardHeader className="space-y-2 pb-6 text-center">
          <div className="flex justify-center mb-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
                AI Academy
              </span>
            </Link>
          </div>
          {badgeText && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider px-2 py-0.5 border-primary/20 text-primary">
                {badgeText}
              </Badge>
            </div>
          )}
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
        {footer && <CardFooter className="flex flex-col space-y-2 pt-2 text-center text-xs text-muted-foreground border-t border-border/40 mt-4">{footer}</CardFooter>}
      </Card>
    </div>
  );
}
