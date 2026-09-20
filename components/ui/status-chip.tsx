import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center font-mono font-medium rounded-[4px] border select-none transition-colors",
  {
    variants: {
      status: {
        passed: "bg-[#4cb782]/10 text-[#4cb782] border-[#1b4332]",
        evaluating: "bg-[#5e6ad2]/10 text-[#6f7be8] border-[#2d3154]",
        brand: "bg-[#5e6ad2]/10 text-[#6f7be8] border-[#2d3154]",
        needs_revision: "bg-[#eb5757]/10 text-[#eb5757] border-[#4a1515]",
        pending: "bg-[#e5993e]/10 text-[#e5993e] border-[#4a3000]",
        offline: "bg-[#16171a] text-[#8a8f98] border-[#23252a]",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5 gap-1.5",
        md: "text-xs px-2 py-0.5 gap-2",
      },
    },
    defaultVariants: {
      status: "passed",
      size: "sm",
    },
  }
);

const dotColors = {
  passed: "bg-[#4cb782]",
  evaluating: "bg-[#6f7be8] animate-pulse",
  brand: "bg-[#6f7be8]",
  needs_revision: "bg-[#eb5757]",
  pending: "bg-[#e5993e] animate-pulse",
  offline: "bg-[#565961]",
};

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  status?: "passed" | "evaluating" | "brand" | "needs_revision" | "pending" | "offline";
  label: string;
  showDot?: boolean;
}

export function StatusChip({
  className,
  status = "passed",
  size = "sm",
  label,
  showDot = true,
  ...props
}: StatusChipProps) {
  return (
    <span
      className={cn(chipVariants({ status, size, className }))}
      {...props}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[status])}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </span>
  );
}
