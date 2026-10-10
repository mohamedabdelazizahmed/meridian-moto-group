import React from "react";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ControlProps {
  id?: string;
  error?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      htmlFor: providedHtmlFor,
      error,
      description,
      required = false,
      className,
      children,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const htmlFor = providedHtmlFor || generatedId;
    const descriptionId = description ? `${htmlFor}-description` : undefined;
    const errorId = error ? `${htmlFor}-error` : undefined;

    const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    // Clone child element to automatically wire accessibility and error attributes if it's a valid React element
    const child = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<ControlProps>, {
          id: (children.props as ControlProps).id || htmlFor,
          error: Boolean(error) || (children.props as ControlProps).error,
          "aria-invalid": Boolean(error) || (children.props as ControlProps)["aria-invalid"],
          "aria-describedby": ariaDescribedBy || (children.props as ControlProps)["aria-describedby"],
        })
      : children;

    return (
      <div ref={ref} className={cn("space-y-1.5 w-full", className)}>
        {label && (
          <label
            htmlFor={htmlFor}
            className="block text-xs font-mono uppercase tracking-wider text-moto-muted"
          >
            {label}
            {required && (
              <span className="text-moto-apex ml-1" aria-hidden="true">
                *
              </span>
            )}
            {required && <span className="sr-only">(required)</span>}
          </label>
        )}

        {description && (
          <p id={descriptionId} className="text-xs text-moto-muted/80">
            {description}
          </p>
        )}

        {child}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-mono text-moto-apex mt-1 flex items-center gap-1"
          >
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
