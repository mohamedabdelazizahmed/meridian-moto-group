"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import CmsSidebar from "@/components/CmsSidebar";
import CmsHeader from "@/components/CmsHeader";
import CmsFooter from "@/components/CmsFooter";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from "@/features/admin-promotions/hooks";
import { PromotionForm } from "@/features/admin-promotions/components/PromotionForm";
import { PromotionsTable } from "@/features/admin-promotions/components/PromotionsTable";
import { listBrands } from "@/features/admin-brands/api";
import type { Promotion, Brand } from "@/types/api";

export default function CmsPromotionsPage() {
  const [role, setRole] = useState<"data_entry" | "admin">("admin");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const { data: promotions = [], isLoading: isLoadingPromos } = usePromotions();
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["admin-brands"],
    queryFn: listBrands,
  });

  const { mutate: createPromo, isPending: isCreating } = useCreatePromotion(
    undefined,
    () => {
      setIsModalOpen(false);
      setEditingPromo(null);
    }
  );

  const { mutate: updatePromo, isPending: isUpdating } = useUpdatePromotion(
    editingPromo?.id || "",
    undefined,
    () => {
      setIsModalOpen(false);
      setEditingPromo(null);
    }
  );

  const { mutate: deletePromo, isPending: isDeleting } = useDeletePromotion();

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: import("@/features/admin-promotions/schema").PromotionFormData) => {
    if (editingPromo) {
      updatePromo(data);
    } else {
      createPromo(data);
    }
  };

  return (
    <div className="min-h-screen bg-moto-bg text-moto-text flex">
      <CmsSidebar role={role} onRoleChange={setRole} />

      <div className="flex-1 flex flex-col min-w-0">
        <CmsHeader title="Promotions & Campaigns Management" role={role} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-wider font-barlow uppercase text-moto-text">Promotions</h1>
              <p className="text-xs text-moto-muted mt-1">Manage promotional campaigns, track discounts, and seasonal offers.</p>
            </div>
            <Button variant="primary" onClick={handleOpenAdd}>
              + Add Promotion Campaign
            </Button>
          </div>

          <PromotionsTable
            promotions={promotions}
            isLoading={isLoadingPromos}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeletingId(id)}
          />

          {/* Create / Edit Modal */}
          <Dialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingPromo ? `Edit Promotion: ${editingPromo.title}` : "Create New Promotion Campaign"}
          >
            <PromotionForm
              formRef={formRef}
              initialData={editingPromo}
              brands={brands}
              onSubmit={handleFormSubmit}
              isPending={isCreating || isUpdating}
              onCancel={() => setIsModalOpen(false)}
            />
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            isOpen={deletingId !== null}
            onClose={() => setDeletingId(null)}
            title="Confirm Promotion Deletion"
          >
            <div className="space-y-4">
              <p className="text-sm text-moto-muted">
                Are you sure you want to delete this promotion campaign? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
                <Button variant="outline" onClick={() => setDeletingId(null)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (deletingId !== null) {
                      deletePromo(deletingId, {
                        onSuccess: () => setDeletingId(null),
                      });
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Promotion"}
                </Button>
              </div>
            </div>
          </Dialog>
        </main>

        <CmsFooter />
      </div>
    </div>
  );
}
