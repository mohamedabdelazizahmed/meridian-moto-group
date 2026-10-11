/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@/types/api";

interface PromotionsTableProps {
  promotions: Promotion[];
  isLoading: boolean;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number | string) => void;
}

export function PromotionsTable({ promotions, isLoading, onEdit, onDelete }: PromotionsTableProps) {
  const columns: Column<Promotion>[] = [
    {
      header: "Campaign",
      accessorKey: "title",
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-12 h-8 object-cover rounded border border-moto-border"
            />
          ) : (
            <div className="w-12 h-8 bg-moto-surface border border-moto-border rounded flex items-center justify-center text-[10px] font-mono text-moto-muted">
              PROMO
            </div>
          )}
          <div>
            <span className="font-bold text-moto-text block">{item.title}</span>
            <span className="text-xs font-mono text-moto-copper uppercase">{item.brand?.name || "Global"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Active Period",
      accessorKey: "starts_at",
      cell: (item) => (
        <span className="font-mono text-xs text-moto-muted">
          {item.starts_at?.substring(0, 10)} → {item.ends_at?.substring(0, 10)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_published",
      cell: (item) => (
        <Badge variant={item.is_published ? "volt" : "default"}>
          {item.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => item.id !== undefined && onDelete(item.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={promotions}
      keyExtractor={(p) => p.id || 0}
      isLoading={isLoading}
      emptyMessage="No promotion campaigns found."
    />
  );
}
