"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { promotionSchema, PromotionFormData } from "../schema";
import type { Brand, Promotion } from "@/types/api";

interface PromotionFormProps {
  initialData?: Promotion | null;
  brands: Brand[];
  onSubmit: (data: PromotionFormData) => void;
  isPending: boolean;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function PromotionForm({ initialData, brands, onSubmit, isPending, onCancel, formRef }: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema) as unknown as import("react-hook-form").Resolver<PromotionFormData>,
    defaultValues: {
      brand_id: initialData?.brand?.id || brands[0]?.id || 1,
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: initialData?.image_url || null,
      starts_at: initialData?.starts_at ? initialData.starts_at.substring(0, 10) : "",
      ends_at: initialData?.ends_at ? initialData.ends_at.substring(0, 10) : "",
      is_published: initialData?.is_published ?? true,
    },
  });

  const imageValue = useWatch({ control, name: "image" });
  const brandIdValue = useWatch({ control, name: "brand_id" });

  const brandOptions = brands.map((b) => ({
    label: b.name,
    value: b.id || 0,
  }));

  return (
    <form ref={formRef} onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Marque Brand *" error={errors.brand_id?.message}>
          <Select
            value={brandIdValue || 1}
            onChange={(e) => setValue("brand_id", Number(e.target.value), { shouldValidate: true })}
            options={brandOptions}
          />
        </FormField>

        <FormField label="Campaign Title *" error={errors.title?.message}>
          <Input {...register("title")} placeholder="e.g. Ramadan Track Special" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Start Date *" error={errors.starts_at?.message}>
          <Input type="date" {...register("starts_at")} />
        </FormField>

        <FormField label="End Date *" error={errors.ends_at?.message}>
          <Input type="date" {...register("ends_at")} />
        </FormField>
      </div>

      <FormField label="Campaign Description & Details" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full bg-moto-bg border border-moto-border rounded px-3 py-2 text-sm text-moto-text focus:border-moto-copper focus:outline-none font-mono"
          placeholder="Special promotional pricing and track day inclusion..."
        />
      </FormField>

      <FormField label="Campaign Banner Image">
        <ImageUpload
          value={imageValue as File | string | null | undefined}
          onChange={(file) => setValue("image", file, { shouldValidate: true })}
          error={errors.image?.message as string}
        />
      </FormField>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-xs font-mono text-moto-text cursor-pointer">
          <input type="checkbox" {...register("is_published")} className="accent-moto-copper w-4 h-4 rounded" />
          <span>Published Campaign</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Campaign" : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}
