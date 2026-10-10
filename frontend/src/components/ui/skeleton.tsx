import React from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, style, ...props }, ref) => {
    const variantStyles = {
      text: "h-4 w-full rounded",
      circular: "rounded-full",
      rectangular: "rounded-md",
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          width: width,
          height: height,
          ...style,
        }}
        className={cn(
          "animate-pulse bg-moto-surface border border-moto-border/40 motion-reduce:animate-none",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
