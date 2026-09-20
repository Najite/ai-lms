import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0f1012] text-[#f7f8f8] border border-[#23252a] hover:bg-[#1e2023] hover:border-[#2e3038] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        primary:
          "bg-[#5e6ad2] text-white hover:bg-[#6f7be8] border border-[#5e6ad2] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)]",
        secondary:
          "bg-[#08090a] text-[#8a8f98] border border-[#1b1c20] hover:text-[#f7f8f8] hover:bg-[#0f1012] hover:border-[#23252a]",
        ghost:
          "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#16171a]",
        danger:
          "bg-[#4a1515]/20 text-[#eb5757] border border-[#4a1515] hover:bg-[#4a1515]/40",
        outline:
          "bg-transparent text-[#f7f8f8] border border-[#23252a] hover:bg-[#0f1012] hover:border-[#3b3e48]",
        codecademy:
          "bg-[#ffdd40] text-[#000000] font-semibold border border-[#ffdd40] hover:bg-[#ffe566] shadow-[0_2px_0_0_#000000]",
      },
      size: {
        xs: "h-6 px-2 text-xs rounded-[4px] gap-1",
        sm: "h-7 px-2.5 text-xs rounded-[5px] gap-1.5",
        md: "h-8 px-3 text-sm rounded-[6px] gap-2",
        lg: "h-10 px-5 text-sm rounded-[6px] gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
