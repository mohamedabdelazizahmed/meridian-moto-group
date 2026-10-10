import React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "apex"
    | "volt"
    | "nomad"
    | "sovereign";
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", icon, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono uppercase tracking-wider font-semibold";

    const variantStyles = {
      default: "bg-moto-surface text-moto-text border border-moto-border",
      success: "bg-moto-volt/20 text-moto-volt border border-moto-volt/40",
      warning: "bg-moto-copper/20 text-moto-copper border border-moto-copper/40",
      danger: "bg-moto-apex/20 text-moto-apex border border-moto-apex/40",
      info: "bg-moto-sovereign/20 text-moto-sovereign border border-moto-sovereign/40",
      apex: "bg-moto-apex/20 text-moto-apex border border-moto-apex/40",
      volt: "bg-moto-volt/20 text-moto-volt border border-moto-volt/40",
      nomad: "bg-moto-nomad/20 text-moto-nomad border border-moto-nomad/40",
      sovereign: "bg-moto-sovereign/20 text-moto-sovereign border border-moto-sovereign/40",
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
