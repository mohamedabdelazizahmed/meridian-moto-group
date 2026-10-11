"use client";

import { useState } from "react";
import CmsSidebar from "@/components/CmsSidebar";
import CmsHeader from "@/components/CmsHeader";
import CmsFooter from "@/components/CmsFooter";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useListSearchParams } from "@/hooks/useListSearchParams";
import { useModelsList, useCreateModel, useUpdateModel, useDeleteModel } from "@/features/admin-models/hooks";
import { ModelsTable } from "@/features/admin-models/components/ModelsTable";
import { ModelForm } from "@/features/admin-models/components/ModelForm";
import { ModelFilters } from "@/features/admin-models/components/ModelFilters";
import { adminFetch } from "@/lib/api/admin-client";
import { useQuery } from "@tanstack/react-query";
import type { Brand, Motorcycle } from "@/types/api";
import { ModelFormData } from "@/features/admin-models/schema";
import { toFormData } from "@/features/admin-models/api";

export default function CmsModelsPage() {
  const [role, setRole] = useState<"data_entry" | "admin">("admin");
  const { search, setSearch, brand_id, setBrandId, status, setStatus, page, setPage } = useListSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Motorcycle | null>(null);
  const [deletingModel, setDeletingModel] = useState<Motorcycle | null>(null);

  const { data: brandsRes } = useQuery<{ data: Brand[] } | Brand[]>({
    queryKey: ["admin-brands-select"],
    queryFn: async () => await adminFetch<{ data: Brand[] } | Brand[]>("/brands"),
  });
  const brands = Array.isArray(brandsRes) ? brandsRes : brandsRes?.data || [];

  const { data: modelsRes, isLoading, error } = useModelsList({ page, search, brand_id, status });
  const models = modelsRes?.data || [];
  const meta = modelsRes?.meta;

  const createMutation = useCreateModel();
  const updateMutation = useUpdateModel(editingModel?.id || "");
  const deleteMutation = useDeleteModel();

  const handleSubmitForm = (values: ModelFormData) => {
    const fd = toFormData(values);
    if (editingModel) {
      updateMutation.mutate(fd, { onSuccess: () => { setIsModalOpen(false); setEditingModel(null); } });
    } else {
      createMutation.mutate(fd, { onSuccess: () => { setIsModalOpen(false); } });
    }
  };

  return (
    <div className="min-h-screen flex bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      <CmsSidebar currentRole={role} onToggleRole={(r) => setRole(r)} />
      <div className="flex-1 flex flex-col min-w-0">
        <CmsHeader
          title="Models Catalog Management"
          subtitle="Fleet inventory administration, pricing, specifications, and brand scoping."
          role={role}
          userName={role === "admin" ? "Karim Al-Hassan" : "Tariq Al-Mansoor"}
          assignedBrands={brands.map((b) => b.name)}
          actionButton={
            <Button onClick={() => { setEditingModel(null); setIsModalOpen(true); }} variant="primary">
              + Add Model
            </Button>
          }
        />
        <main className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          <ModelFilters search={search} onSearchChange={setSearch} brandId={brand_id} onBrandChange={setBrandId} status={status} onStatusChange={setStatus} brands={brands} />
          {error && <div className="p-4 rounded-lg bg-moto-apex/10 border border-moto-apex/40 text-moto-apex text-xs font-mono">⚠ Failed to load motorcycle models.</div>}
          {isLoading ? (
            <div className="space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-16 w-full" /></div>
          ) : (
            <ModelsTable data={models} isLoading={isLoading} onEdit={(item) => { setEditingModel(item); setIsModalOpen(true); }} onDelete={(item) => setDeletingModel(item)} />
          )}
          {meta && meta.last_page > 1 && <Pagination currentPage={meta.current_page} totalPages={meta.last_page} onPageChange={setPage} />}
        </main>
        <CmsFooter />
      </div>
      <Dialog isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingModel(null); }} title={editingModel ? "Edit Motorcycle Model" : "Add Motorcycle Model"} description="Configure vehicle specifications, pricing, marque ownership, and publishing state.">
        <ModelForm initialData={editingModel} brands={brands} onSubmit={handleSubmitForm} isPending={createMutation.isPending || updateMutation.isPending} onCancel={() => { setIsModalOpen(false); setEditingModel(null); }} />
      </Dialog>
      <Dialog isOpen={Boolean(deletingModel)} onClose={() => setDeletingModel(null)} title="Delete Motorcycle Model" description={`Are you sure you want to delete "${deletingModel?.name}"?`}>
        <div className="space-y-4 pt-2">
          <p className="text-xs text-moto-muted font-mono">This action cannot be undone and will permanently remove the vehicle record and its stored image.</p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
            <Button variant="outline" onClick={() => setDeletingModel(null)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deletingModel?.id !== undefined) {
                  deleteMutation.mutate(deletingModel.id, { onSuccess: () => setDeletingModel(null) });
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Model"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
