"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { modelSchema, ModelFormData } from "../schema";
import type { Brand, Motorcycle } from "@/types/api";

interface ModelFormProps {
  initialData?: Motorcycle | null;
  brands: Brand[];
  onSubmit: (data: ModelFormData) => void;
  isPending: boolean;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function ModelForm({ initialData, brands, onSubmit, isPending, onCancel, formRef }: ModelFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema) as unknown as import("react-hook-form").Resolver<ModelFormData>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      brand_id: initialData?.brand?.id || brands[0]?.id || 1,
      price_from: initialData ? Number(initialData.price_from) : 125000,
      engine_cc: initialData?.engine_cc ?? 900,
      power_hp: initialData?.power_hp ?? 180,
      summary: initialData?.summary || "",
      image: initialData?.image_url || null,
      is_featured: initialData?.is_featured ?? false,
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
      <FormField label="Motorcycle Model Name *" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Apex Track 900" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="URL Slug (Optional)" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="apex-track-900" />
        </FormField>

        <FormField label="Marque Brand *" error={errors.brand_id?.message}>
          <Select
            value={brandIdValue}
            onChange={(e) => setValue("brand_id", Number(e.target.value), { shouldValidate: true })}
            options={brandOptions}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Price From (AED) *" error={errors.price_from?.message}>
          <Input type="number" step="0.01" {...register("price_from")} />
        </FormField>

        <FormField label="Engine Displacement (CC) *" error={errors.engine_cc?.message}>
          <Input type="number" {...register("engine_cc")} placeholder="0 for electric" />
        </FormField>

        <FormField label="Power (HP) *" error={errors.power_hp?.message}>
          <Input type="number" {...register("power_hp")} />
        </FormField>
      </div>

      <FormField label="Summary & Description" error={errors.summary?.message}>
        <textarea
          {...register("summary")}
          rows={3}
          className="w-full bg-moto-bg border border-moto-border rounded px-3 py-2 text-sm text-moto-text focus:border-moto-copper focus:outline-none font-mono"
          placeholder="High-performance flagship track machine..."
        />
      </FormField>

      <FormField label="Vehicle Image">
        <ImageUpload
          value={imageValue}
          onChange={(file) => setValue("image", file, { shouldValidate: true })}
          error={errors.image?.message as string}
        />
      </FormField>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-xs font-mono text-moto-text cursor-pointer">
          <input type="checkbox" {...register("is_featured")} className="accent-moto-copper w-4 h-4 rounded" />
          <span>Featured Model</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-mono text-moto-text cursor-pointer">
          <input type="checkbox" {...register("is_published")} className="accent-moto-copper w-4 h-4 rounded" />
          <span>Published</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Model" : "Create Model"}
        </Button>
      </div>
    </form>
  );
}
