import React from "react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./skeleton";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No records found.",
  isLoading = false,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-moto-border bg-moto-surface shadow-xl", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-moto-border bg-moto-bg/50 text-moto-muted font-mono text-xs uppercase tracking-wider">
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={cn("px-6 py-4 font-semibold", col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-moto-border text-sm text-moto-text">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, rowIndex) => (
              <tr key={`skeleton-row-${rowIndex}`}>
                {columns.map((_, colIndex) => (
                  <td key={`skeleton-col-${colIndex}`} className="px-6 py-4">
                    <Skeleton variant="text" className="h-5 w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-moto-muted font-mono text-xs"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const key = keyExtractor(item);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors",
                    onRowClick ? "cursor-pointer hover:bg-moto-border/20" : ""
                  )}
                >
                  {columns.map((col, colIndex) => {
                    const value = col.accessorKey ? item[col.accessorKey] : undefined;
                    return (
                      <td key={colIndex} className={cn("px-6 py-4", col.className)}>
                        {col.cell ? col.cell(item) : (value as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
