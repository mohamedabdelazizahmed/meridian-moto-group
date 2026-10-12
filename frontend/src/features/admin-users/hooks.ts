"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api/admin-client";
import { listUsers, createUser, updateUser, deleteUser, ListUserParams } from "./api";
import { UseFormSetError } from "react-hook-form";
import { UserFormData } from "./schema";

export function useUsersList(params?: ListUserParams) {
  return useQuery({
    queryKey: [...queryKeys.users.all(), "list", params],
    queryFn: () => listUsersWithFallback(params),
  });
}

async function listUsersWithFallback(params?: ListUserParams) {
  try {
    return await listUsers(params);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 403) {
      toast.error("You do not have permission to view users.");
    }
    throw err;
  }
}

export function useCreateUser(setError?: UseFormSetError<UserFormData>, onSuccessCb?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      toast.success("User account created successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      if (onSuccessCb) onSuccessCb();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 422 && err.errors && setError) {
          Object.entries(err.errors).forEach(([field, messages]) => {
            setError(field as keyof UserFormData, {
              type: "server",
              message: messages?.[0] || "Invalid value",
            });
          });
          toast.error("Validation failed. Please check the form fields.");
        } else if (err.status === 403) {
          toast.error("You do not have permission to create users.");
        } else {
          toast.error(err.message || "Failed to create user.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}

export function useUpdateUser(id: number | string, setError?: UseFormSetError<UserFormData>, onSuccessCb?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormData) => updateUser(id, data),
    onSuccess: () => {
      toast.success("User account updated successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      if (onSuccessCb) onSuccessCb();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 422 && err.errors && setError) {
          Object.entries(err.errors).forEach(([field, messages]) => {
            setError(field as keyof UserFormData, {
              type: "server",
              message: messages?.[0] || "Invalid value",
            });
          });
          toast.error("Validation failed. Please check the form fields.");
        } else if (err.status === 403) {
          toast.error("You do not have permission to update users.");
        } else {
          toast.error(err.message || "Failed to update user.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteUser(id),
    onSuccess: () => {
      toast.success("User account deleted successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          toast.error(err.message || "Cannot perform this deletion.");
        } else if (err.status === 403) {
          toast.error("You do not have permission to delete users.");
        } else {
          toast.error(err.message || "Failed to delete user.");
        }
      } else {
        toast.error("Failed to delete user.");
      }
    },
  });
}
