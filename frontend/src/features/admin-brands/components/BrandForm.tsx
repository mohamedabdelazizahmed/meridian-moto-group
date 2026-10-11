"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { brandSchema, BrandFormData } from "../schema";
import type { Brand } from "@/types/api";

interface BrandFormProps {
  initialData?: Brand | null;
  onSubmit: (data: BrandFormData) => void;
  isPending: boolean;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function BrandForm({ initialData, onSubmit, isPending, onCancel, formRef }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema) as unknown as import("react-hook-form").Resolver<BrandFormData>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      segment: initialData?.segment || "",
      tagline: initialData?.tagline || "",
      description: initialData?.description || "",
      accent_color: initialData?.accent_color || "#C8873A",
      logo: initialData?.logo_url || null,
      hero_image: initialData?.hero_image_url || null,
      is_active: initialData?.is_active ?? true,
    },
  });

  const logoValue = useWatch({ control, name: "logo" });
  const heroImageValue = useWatch({ control, name: "hero_image" });
  const accentColorValue = useWatch({ control, name: "accent_color" });

  return (
    <form ref={formRef} onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      <FormField label="Marque Name *" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Apex Racing" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="URL Slug (Optional)" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="apex-racing" />
        </FormField>

        <FormField label="Segment / Category *" error={errors.segment?.message}>
          <Input {...register("segment")} placeholder="Circuit & Track" />
        </FormField>
      </div>

      <FormField label="Tagline" error={errors.tagline?.message}>
        <Input {...register("tagline")} placeholder="Engineering Pure Adrenaline" />
      </FormField>

      <FormField label="Accent Color (#RRGGBB) *" error={errors.accent_color?.message}>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accentColorValue || "#C8873A"}
            onChange={(e) => setValue("accent_color", e.target.value, { shouldValidate: true })}
            className="w-10 h-10 rounded border border-moto-border bg-moto-surface cursor-pointer"
          />
          <Input {...register("accent_color")} placeholder="#C8873A" className="font-mono" />
        </div>
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full bg-moto-bg border border-moto-border rounded px-3 py-2 text-sm text-moto-text focus:border-moto-copper focus:outline-none font-mono"
          placeholder="High-performance motorcycle manufacturer..."
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Brand Logo" error={errors.logo?.message as string}>
          <ImageUpload
            value={logoValue}
            onChange={(file) => setValue("logo", file, { shouldValidate: true })}
          />
        </FormField>

        <FormField label="Hero Image" error={errors.hero_image?.message as string}>
          <ImageUpload
            value={heroImageValue}
            onChange={(file) => setValue("hero_image", file, { shouldValidate: true })}
          />
        </FormField>
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-xs font-mono text-moto-text cursor-pointer">
          <input type="checkbox" {...register("is_active")} className="accent-moto-copper w-4 h-4 rounded" />
          <span>Active Marque</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-moto-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Brand"}
        </Button>
      </div>
    </form>
  );
}
