"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CmsSidebar from "@/components/CmsSidebar";
import CmsHeader from "@/components/CmsHeader";
import CmsFooter from "@/components/CmsFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataTable, Column } from "@/components/ui/data-table";
import { adminFetch } from "@/lib/api/admin-client";

interface BrandRecord {
  id: number;
  name: string;
  slug: string;
  segment?: string;
  description?: string;
}

export default function CmsBrandsPage() {
  const [role, setRole] = useState<"data_entry" | "admin">("admin");
  const queryClient = useQueryClient();

  // Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandRecord | null>(null);
  const [deletingBrandId, setDeletingBrandId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [segment, setSegment] = useState("");
  const [description, setDescription] = useState("");

  const { data: brands = [], isLoading, error } = useQuery<BrandRecord[]>({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const res = await adminFetch<{ data: BrandRecord[] } | BrandRecord[]>("/brands");
      return Array.isArray(res) ? res : res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { name: string; segment: string; description: string }) => {
      if (editingBrand) {
        return await adminFetch(`/brands/${editingBrand.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        return await adminFetch(`/brands`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      toast.success(editingBrand ? "Brand updated successfully." : "Brand created successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to save brand.";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await adminFetch(`/brands/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Brand deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      setDeletingBrandId(null);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete brand.";
      toast.error(message);
    },
  });

  const resetForm = () => {
    setEditingBrand(null);
    setName("");
    setSegment("");
    setDescription("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (brand: BrandRecord) => {
    setEditingBrand(brand);
    setName(brand.name);
    setSegment(brand.segment || "");
    setDescription(brand.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ name, segment, description });
  };

  const columns: Column<BrandRecord>[] = [
    {
      header: "Marque Name",
      accessorKey: "name",
      cell: (item) => <span className="font-bold text-moto-text">{item.name}</span>,
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
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeletingBrandId(item.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      <CmsSidebar currentRole={role} onToggleRole={(r) => setRole(r)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CmsHeader
          title="Marque Brands Management"
          subtitle="Manage motorcycle manufacturers, performance segments, and brand clearance clearances."
          role={role}
          userName="Karim Al-Hassan"
          assignedBrands={["Apex", "Volt", "Nomad", "Sovereign"]}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-wider uppercase font-barlow">
                Manufacturer Directory ({brands.length})
              </h2>
              <p className="text-xs text-moto-muted mt-0.5">
                Authorized luxury motorcycle marques under Meridian Moto Group.
              </p>
            </div>
            <Button onClick={openAddModal} variant="primary">
              + Add Marque Brand
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-moto-apex/10 border border-moto-apex/40 text-moto-apex text-xs font-mono">
              ⚠ Failed to load brands from API. Please verify backend service status.
            </div>
          )}

          {/* Table */}
          <DataTable
            data={brands}
            columns={columns}
            keyExtractor={(b) => b.id}
            isLoading={isLoading}
            emptyMessage="No marque brands registered in the enterprise catalog."
          />
        </main>

        <CmsFooter />
      </div>

      {/* Add / Edit Brand Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? "Edit Marque Brand" : "Register New Marque Brand"}
        description="Configure manufacturer specifications and brand profile."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Marque Name *" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Racing"
              required
            />
          </FormField>

          <FormField label="Segment / Category" description="e.g. Circuit, EV, Touring, Cruiser">
            <Input
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              placeholder="Circuit"
            />
          </FormField>

          <FormField label="Description">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-performance track machines..."
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-moto-border">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
              {editingBrand ? "Save Changes" : "Create Brand"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deletingBrandId !== null}
        onClose={() => setDeletingBrandId(null)}
        title="Confirm Brand Deletion"
        description="Are you sure you want to delete this marque? Associated models may be affected."
      >
        <div className="space-y-4">
          <p className="text-xs text-moto-muted">
            This action cannot be undone. Please confirm permanent deletion.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-moto-border">
            <Button variant="outline" onClick={() => setDeletingBrandId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => deletingBrandId && deleteMutation.mutate(deletingBrandId)}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
