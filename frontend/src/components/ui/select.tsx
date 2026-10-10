import React from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error = false, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-moto-bg border rounded px-4 py-3 text-sm text-moto-text focus:outline-none transition-colors appearance-none cursor-pointer",
            error
              ? "border-moto-apex focus:border-moto-apex"
              : "border-moto-border focus:border-moto-copper",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-moto-surface text-moto-text">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow indicator */}
        <div className="absolute right-3.5 flex items-center pointer-events-none text-moto-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
