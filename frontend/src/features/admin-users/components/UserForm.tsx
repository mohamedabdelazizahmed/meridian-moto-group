"use client";

import { useEffect, useState } from "react";
import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "../schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import type { User, Brand } from "@/types/api";
import { Role } from "@/lib/roles";

interface UserFormProps {
  formRef?: React.RefObject<HTMLFormElement | null>;
  initialData?: User | null;
  currentUserId?: number | string;
  brands: Brand[];
  onSubmit: (data: UserFormData) => void;
  isPending: boolean;
  onCancel: () => void;
  setErrorRef?: (setError: UseFormSetError<UserFormData>) => void;
}

export function UserForm({
  formRef,
  initialData,
  currentUserId,
  brands,
  onSubmit,
  isPending,
  onCancel,
  setErrorRef,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isSelf = initialData && currentUserId && String(initialData.id) === String(currentUserId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role === Role.Admin ? Role.Admin : Role.DataEntry,
      brand_ids:
        initialData?.brands
          ?.map((b) => b.id)
          .filter((id): id is number => typeof id === "number") || [],
    },
  });

  useEffect(() => {
    if (setErrorRef) {
      setErrorRef(setError);
    }
  }, [setError, setErrorRef]);

  const selectedRole = watch("role");
  const selectedBrandIds = watch("brand_ids") || [];

  const handleBrandToggle = (brandId: number) => {
    const exists = selectedBrandIds.includes(brandId);
    if (exists) {
      setValue(
        "brand_ids",
        selectedBrandIds.filter((id) => id !== brandId),
        { shouldValidate: true }
      );
    } else {
      setValue("brand_ids", [...selectedBrandIds, brandId], { shouldValidate: true });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Full Name" error={errors.name?.message} required>
        <Input {...register("name")} placeholder="e.g. Samira Vance" />
      </FormField>

      <FormField label="Email Address" error={errors.email?.message} required>
        <Input type="email" {...register("email")} placeholder="samira@meridian.test" />
      </FormField>

      <FormField
        label={initialData ? "New Password (optional)" : "Password"}
        error={errors.password?.message}
        required={!initialData}
        description={
          initialData
            ? "Leave empty to keep current password. Must be at least 8 chars with letters & numbers."
            : "Must be at least 8 characters with letters and numbers."
        }
      >
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder={initialData ? "••••••••" : "SecurePass123"}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-moto-muted hover:text-moto-text font-mono"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </FormField>

      <FormField
        label="Role Clearance"
        error={errors.role?.message}
        required
        description={isSelf ? "Admins cannot change their own role." : undefined}
      >
        <Select
          {...register("role")}
          disabled={Boolean(isSelf)}
          options={[
            { label: "Data Entry Operator", value: Role.DataEntry },
            { label: "Administrator", value: Role.Admin },
          ]}
        />
      </FormField>

      {selectedRole === Role.DataEntry && (
        <FormField
          label="Assigned Marque Brands"
          error={errors.brand_ids?.message}
          required
          description="Select at least one brand for Data Entry scope."
        >
          <div className="grid grid-cols-2 gap-2 mt-1 bg-moto-bg p-3 rounded border border-moto-border">
            {brands.map((brand) => {
              const brandId = brand.id || 0;
              const isChecked = selectedBrandIds.includes(brandId);
              return (
                <label
                  key={brandId}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                    isChecked
                      ? "bg-moto-copper/10 border-moto-copper/50 text-moto-text"
                      : "border-moto-border/60 hover:border-moto-border text-moto-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brandId)}
                    className="rounded border-moto-border text-moto-copper focus:ring-moto-copper"
                  />
                  <span className="text-xs font-medium uppercase tracking-wider">{brand.name}</span>
                </label>
              );
            })}
          </div>
        </FormField>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
