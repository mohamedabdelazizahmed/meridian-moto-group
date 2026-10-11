/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/types/api";

interface BrandsTableProps {
  data: Brand[];
  isLoading: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (id: number) => void;
}

export function BrandsTable({ data, isLoading, onEdit, onDelete }: BrandsTableProps) {
  const columns: Column<Brand>[] = [
    {
      header: "Logo",
      accessorKey: "logo_url",
      cell: (item) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-moto-border bg-moto-surface flex items-center justify-center">
          {item.logo_url ? (
            <img src={item.logo_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-mono text-moto-muted">LOGO</span>
          )}
        </div>
      ),
    },
    {
      header: "Marque Name",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <span className="font-bold text-moto-text">{item.name}</span>
          {item.tagline && <p className="text-[11px] text-moto-muted truncate max-w-xs">{item.tagline}</p>}
        </div>
      ),
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (item) => <span className="font-mono text-xs text-moto-muted">{item.slug}</span>,
    },
    {
      header: "Segment",
      accessorKey: "segment",
      cell: (item) => (
        <Badge variant="volt">
          {item.segment || "General"}
        </Badge>
      ),
    },
    {
      header: "Accent",
      accessorKey: "accent_color",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-moto-border inline-block"
            style={{ backgroundColor: item.accent_color || "#C8873A" }}
          />
          <span className="font-mono text-xs">{item.accent_color || "#C8873A"}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: (item) => (
        <Badge variant={item.is_active !== false ? "success" : "danger"}>
          {item.is_active !== false ? "Active" : "Inactive"}
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
      data={data}
      columns={columns}
      keyExtractor={(b) => b.id || 0}
      isLoading={isLoading}
      emptyMessage="No marque brands registered in the enterprise catalog."
    />
  );
}
