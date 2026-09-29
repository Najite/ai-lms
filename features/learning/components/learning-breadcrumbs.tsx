import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface LearningBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function LearningBreadcrumbs({ items, className }: LearningBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-xs md:text-sm text-muted-foreground", className)}
    >
      <Link
        href="/learning-paths"
        className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Academy</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-foreground truncate max-w-[200px] md:max-w-[300px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors truncate max-w-[150px] md:max-w-[220px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
