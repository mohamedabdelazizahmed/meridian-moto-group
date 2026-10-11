import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UseFormSetError } from "react-hook-form";
import { listPromotions, createPromotion, updatePromotion, deletePromotion, toFormData } from "./api";
import { PromotionFormData } from "./schema";
import { ApiError } from "@/lib/api/admin-client";

export function usePromotions() {
  return useQuery({
    queryKey: ["admin-promotions"],
    queryFn: listPromotions,
  });
}

export function useCreatePromotion(setError?: UseFormSetError<PromotionFormData>, onSuccessCb?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: PromotionFormData) => createPromotion(toFormData(values)),
    onSuccess: () => {
      toast.success("Promotion campaign created successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      if (onSuccessCb) onSuccessCb();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.errors && setError) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          if (messages && messages[0]) {
            setError(field as keyof PromotionFormData, {
              type: "server",
              message: messages[0],
            });
          }
        });
        toast.error("Please correct the validation errors in the form.");
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to create promotion.");
      }
    },
  });
}

export function useUpdatePromotion(id: number | string, setError?: UseFormSetError<PromotionFormData>, onSuccessCb?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: PromotionFormData) => updatePromotion(id, toFormData(values)),
    onSuccess: () => {
      toast.success("Promotion campaign updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      if (onSuccessCb) onSuccessCb();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.errors && setError) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          if (messages && messages[0]) {
            setError(field as keyof PromotionFormData, {
              type: "server",
              message: messages[0],
            });
          }
        });
        toast.error("Please correct the validation errors in the form.");
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to update promotion.");
      }
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deletePromotion(id),
    onSuccess: () => {
      toast.success("Promotion campaign deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 403) {
        toast.error("You do not have permission to delete promotions for this brand.");
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to delete promotion.");
      }
    },
  });
}
