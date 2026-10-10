import React from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn("flex items-center justify-between px-4 py-3 bg-moto-surface border border-moto-border rounded-xl", className)}
    >
      <div className="text-xs font-mono text-moto-muted">
        Page <span className="text-moto-text font-bold">{currentPage}</span> of{" "}
        <span className="text-moto-text font-bold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
