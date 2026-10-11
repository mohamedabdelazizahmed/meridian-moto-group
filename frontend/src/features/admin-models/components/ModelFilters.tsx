"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Brand } from "@/types/api";

interface ModelFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  brandId: string;
  onBrandChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  brands: Brand[];
}

export function ModelFilters({
  search,
  onSearchChange,
  brandId,
  onBrandChange,
  status,
  onStatusChange,
  brands,
}: ModelFiltersProps) {
  const brandOptions = [
    { label: "All Marques", value: "All" },
    ...brands.map((b) => ({ label: b.name, value: String(b.id) })),
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
  ];

  return (
    <div className="bg-moto-surface border border-moto-border p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="w-full md:w-80">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search models by name or specs..."
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select
          value={brandId || "All"}
          onChange={(e) => onBrandChange(e.target.value)}
          options={brandOptions}
        />

        <Select
          value={status || "All"}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
        />
      </div>
    </div>
  );
}
