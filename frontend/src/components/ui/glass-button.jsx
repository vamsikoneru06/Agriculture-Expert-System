import * as React from "react";
import { cva } from "class-variance-authority";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const glassButtonVariants = cva(
  "glass-button relative cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm:      "text-sm font-medium",
        lg:      "text-lg font-medium",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { size: "default" },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none",
  {
    variants: {
      size: {
        default: "px-6 py-3",
        sm:      "px-4 py-2",
        lg:      "px-8 py-3.5",
        icon:    "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: { size: "default" },
  }
);

const GlassButton = React.forwardRef(
  ({ className, children, size, contentClassName, disabled, ...props }, ref) => {
    return (
      <div className={cn("glass-button-wrap cursor-pointer rounded-full", disabled && "opacity-40 cursor-not-allowed pointer-events-none", className)}>
        <button
          className={cn(glassButtonVariants({ size }))}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow rounded-full" />
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
