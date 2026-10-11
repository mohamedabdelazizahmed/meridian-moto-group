import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { listBrands, createBrand, updateBrand, deleteBrand, toFormData } from "./api";
import { BrandFormData } from "./schema";
import { ApiError } from "@/lib/api/admin-client";

export function useBrandsQuery() {
  return useQuery({
    queryKey: ["admin-brands"],
    queryFn: listBrands,
  });
}

export function useCreateBrand(setError?: UseFormSetError<BrandFormData>, onSuccessCb?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: BrandFormData) => createBrand(toFormData(values)),
    onSuccess: () => {
      toast.success("Marque brand registered successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      onSuccessCb?.();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.errors && setError) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          setError(field as keyof BrandFormData, { message: messages[0] });
        });
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to create brand.");
      }
    },
  });
}

export function useUpdateBrand(id: number | string, setError?: UseFormSetError<BrandFormData>, onSuccessCb?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: BrandFormData) => updateBrand(id, toFormData(values)),
    onSuccess: () => {
      toast.success("Marque brand updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      onSuccessCb?.();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.errors && setError) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          setError(field as keyof BrandFormData, { message: messages[0] });
        });
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to update brand.");
      }
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteBrand(id),
    onSuccess: () => {
      toast.success("Marque brand deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete brand.");
    },
  });
}
