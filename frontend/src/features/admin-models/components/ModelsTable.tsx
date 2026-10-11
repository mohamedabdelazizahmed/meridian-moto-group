"use client";

import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Motorcycle } from "@/types/api";

interface ModelsTableProps {
  data: Motorcycle[];
  isLoading: boolean;
  onEdit: (item: Motorcycle) => void;
  onDelete: (item: Motorcycle) => void;
}

export function ModelsTable({ data, isLoading, onEdit, onDelete }: ModelsTableProps) {
  const getBrandBadgeVariant = (brandName?: string): "apex" | "volt" | "nomad" | "sovereign" | "default" => {
    switch (brandName?.toLowerCase()) {
      case "apex":
        return "apex";
      case "volt":
        return "volt";
      case "nomad":
        return "nomad";
      case "sovereign":
        return "sovereign";
      default:
        return "default";
    }
  };

  const columns: Column<Motorcycle>[] = [
    {
      header: "Vehicle",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded bg-moto-surface border border-moto-border overflow-hidden shrink-0">
            {item.image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-moto-muted">
                IMG
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-moto-text flex items-center gap-2">
              <span>{item.name}</span>
              {item.is_featured && (
                <span className="text-[10px] bg-moto-copper/20 text-moto-copper px-1.5 py-0.5 rounded font-mono">
                  Featured
                </span>
              )}
            </div>
            <div className="text-xs font-mono text-moto-muted">{item.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Marque",
      accessorKey: "brand",
      cell: (item) => {
        const brandName = item.brand?.name || "Unknown";
        return (
          <Badge variant={getBrandBadgeVariant(brandName)}>
            {brandName}
          </Badge>
        );
      },
    },
    {
      header: "Specifications",
      accessorKey: "engine_cc",
      cell: (item) => (
        <div className="text-xs font-mono space-y-0.5">
          <div>{(item.engine_cc ?? 0) === 0 ? "Electric" : `${item.engine_cc}cc`} • {item.power_hp} HP</div>
          <div className="text-moto-muted font-normal">From {Number(item.price_from).toLocaleString()} AED</div>
        </div>
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
          <Button variant="danger" size="sm" onClick={() => onDelete(item)}>
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
      keyExtractor={(item) => String(item.id || item.slug)}
      isLoading={isLoading}
      emptyMessage="No motorcycle models registered in the catalog."
    />
  );
}
