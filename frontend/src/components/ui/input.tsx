import React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-moto-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-moto-bg border rounded px-4 py-3 text-sm text-moto-text placeholder:text-moto-muted/60 focus:outline-none transition-colors",
            error
              ? "border-moto-apex focus:border-moto-apex"
              : "border-moto-border focus:border-moto-copper",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-moto-muted">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
