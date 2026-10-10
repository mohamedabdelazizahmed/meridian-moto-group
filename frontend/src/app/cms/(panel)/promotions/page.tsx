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

interface PromotionRecord {
  id: number;
  title: string;
  subtitle?: string;
  code?: string;
  discount_label?: string;
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
}

export default function CmsPromotionsPage() {
  const [role, setRole] = useState<"data_entry" | "admin">("admin");
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionRecord | null>(null);
  const [deletingPromoId, setDeletingPromoId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [code, setCode] = useState("");
  const [discountLabel, setDiscountLabel] = useState("");

  const { data: promotions = [], isLoading, error } = useQuery<PromotionRecord[]>({
    queryKey: ["admin-promotions"],
    queryFn: async () => {
      const res = await adminFetch<{ data: PromotionRecord[] } | PromotionRecord[]>("/promotions");
      return Array.isArray(res) ? res : res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { title: string; subtitle: string; code: string; discount_label: string }) => {
      if (editingPromo) {
        return await adminFetch(`/promotions/${editingPromo.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        return await adminFetch(`/promotions`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      toast.success(editingPromo ? "Promotion updated successfully." : "Promotion created successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save promotion.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await adminFetch(`/promotions/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Promotion deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      setDeletingPromoId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete promotion.");
    },
  });

  const resetForm = () => {
    setEditingPromo(null);
    setTitle("");
    setSubtitle("");
    setCode("");
    setDiscountLabel("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (promo: PromotionRecord) => {
    setEditingPromo(promo);
    setTitle(promo.title);
    setSubtitle(promo.subtitle || "");
    setCode(promo.code || "");
    setDiscountLabel(promo.discount_label || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ title, subtitle, code, discount_label: discountLabel });
  };

  const columns: Column<PromotionRecord>[] = [
    {
      header: "Campaign Title",
      accessorKey: "title",
      cell: (item) => <span className="font-bold text-moto-text">{item.title}</span>,
    },
    {
      header: "Promo Code",
      accessorKey: "code",
      cell: (item) => <span className="font-mono text-xs text-moto-copper">{item.code || "N/A"}</span>,
    },
    {
      header: "Discount",
      accessorKey: "discount_label",
      cell: (item) => (
        <Badge variant="volt">
          {item.discount_label || "Special Offer"}
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
          <Button variant="danger" size="sm" onClick={() => setDeletingPromoId(item.id)}>
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
          title="Promotions & Campaigns"
          subtitle="Manage VIP track-side promotional offers, discount codes, and seasonal campaigns."
          role={role}
          userName="Karim Al-Hassan"
          assignedBrands={["Apex", "Volt", "Nomad", "Sovereign"]}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-wider uppercase font-barlow">
                Active Campaigns ({promotions.length})
              </h2>
              <p className="text-xs text-moto-muted mt-0.5">
                Exclusive concierge promotions across GCC flagship ateliers.
              </p>
            </div>
            <Button onClick={openAddModal} variant="primary">
              + Create Promotion
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-moto-apex/10 border border-moto-apex/40 text-moto-apex text-xs font-mono">
              ⚠ Failed to load promotions from API. Please verify backend service status.
            </div>
          )}

          <DataTable
            data={promotions}
            columns={columns}
            keyExtractor={(p) => p.id}
            isLoading={isLoading}
            emptyMessage="No promotional campaigns currently active."
          />
        </main>

        <CmsFooter />
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromo ? "Edit Promotion" : "Create New Promotion"}
        description="Configure discount incentives and voucher codes."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Campaign Title *" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Track Day Privilege"
              required
            />
          </FormField>

          <FormField label="Subtitle">
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Complimentary track-side coaching"
            />
          </FormField>

          <FormField label="Promo Code">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="APEX2026"
            />
          </FormField>

          <FormField label="Discount Label">
            <Input
              value={discountLabel}
              onChange={(e) => setDiscountLabel(e.target.value)}
              placeholder="15% Off Track Experience"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-moto-border">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
              {editingPromo ? "Save Changes" : "Create Campaign"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={deletingPromoId !== null}
        onClose={() => setDeletingPromoId(null)}
        title="Confirm Promotion Deletion"
        description="Are you sure you want to delete this promotional campaign?"
      >
        <div className="space-y-4">
          <p className="text-xs text-moto-muted">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-moto-border">
            <Button variant="outline" onClick={() => setDeletingPromoId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => deletingPromoId && deleteMutation.mutate(deletingPromoId)}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
