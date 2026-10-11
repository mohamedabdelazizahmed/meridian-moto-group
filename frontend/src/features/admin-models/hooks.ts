"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api/admin-client";
import { listModels, createModel, updateModel, deleteModel, ListModelParams } from "./api";
import { UseFormSetError } from "react-hook-form";
import { ModelFormData } from "./schema";

export function useModelsList(params?: ListModelParams) {
  return useQuery({
    queryKey: queryKeys.models.list(params as Record<string, unknown>),
    queryFn: () => listModelWithFallback(params),
  });
}

async function listModelWithFallback(params?: ListModelParams) {
  try {
    return await listModels(params);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 403) {
      toast.error("You do not have access to this brand.");
    }
    throw err;
  }
}

export function useCreateModel(setError?: UseFormSetError<ModelFormData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => createModel(fd),
    onSuccess: () => {
      toast.success("Motorcycle model created successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.models.all() });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 422 && err.errors && setError) {
          Object.entries(err.errors).forEach(([field, messages]) => {
            setError(field as keyof ModelFormData, {
              type: "server",
              message: messages?.[0] || "Invalid value",
            });
          });
          toast.error("Validation failed. Please check the form fields.");
        } else if (err.status === 403) {
          toast.error("You do not have access to this brand.");
        } else {
          toast.error(err.message || "Failed to create model.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}

export function useUpdateModel(id: number | string, setError?: UseFormSetError<ModelFormData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => updateModel(id, fd),
    onSuccess: () => {
      toast.success("Motorcycle model updated successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.models.all() });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 422 && err.errors && setError) {
          Object.entries(err.errors).forEach(([field, messages]) => {
            setError(field as keyof ModelFormData, {
              type: "server",
              message: messages?.[0] || "Invalid value",
            });
          });
          toast.error("Validation failed. Please check the form fields.");
        } else if (err.status === 403) {
          toast.error("You do not have access to this brand.");
        } else {
          toast.error(err.message || "Failed to update model.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteModel(id),
    onSuccess: () => {
      toast.success("Motorcycle model deleted successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.models.all() });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 403) {
        toast.error("You do not have access to this brand.");
      } else {
        toast.error("Failed to delete motorcycle model.");
      }
    },
  });
}
