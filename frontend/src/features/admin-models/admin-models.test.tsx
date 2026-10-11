import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { modelSchema } from "./schema";
import { toFormData } from "./api";
import { ModelsTable } from "./components/ModelsTable";
import { ModelForm } from "./components/ModelForm";
import type { Motorcycle, Brand } from "@/types/api";

describe("Admin Models Feature", () => {
  describe("schema.ts", () => {
    it("validates valid model payload successfully", () => {
      const valid = {
        name: "Apex RS 900",
        slug: "apex-rs-900",
        brand_id: 1,
        price_from: 148000,
        engine_cc: 900,
        power_hp: 214,
        summary: "Flagship track machine",
        is_featured: true,
        is_published: true,
      };
      const result = modelSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails on negative price", () => {
      const invalid = {
        name: "Apex RS 900",
        brand_id: 1,
        price_from: -100,
        engine_cc: 900,
        power_hp: 214,
      };
      const result = modelSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails on engine_cc too large (> 10000)", () => {
      const invalid = {
        name: "Apex RS 900",
        brand_id: 1,
        price_from: 1000,
        engine_cc: 10001,
        power_hp: 214,
      };
      const result = modelSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails on invalid slug characters", () => {
      const invalid = {
        name: "Apex RS 900",
        slug: "Apex RS 900!",
        brand_id: 1,
        price_from: 1000,
        engine_cc: 900,
        power_hp: 214,
      };
      const result = modelSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("api.ts toFormData", () => {
    it("serializes values into FormData correctly", () => {
      const values = {
        name: "Volt Pulse",
        slug: "volt-pulse",
        brand_id: 2,
        price_from: 75000,
        engine_cc: 0,
        power_hp: 100,
        summary: "Electric EV",
        is_featured: false,
        is_published: true,
      };
      const fd = toFormData(values);
      expect(fd.get("name")).toBe("Volt Pulse");
      expect(fd.get("engine_cc")).toBe("0");
      expect(fd.get("is_featured")).toBe("0");
      expect(fd.get("is_published")).toBe("1");
    });
  });

  describe("ModelsTable component", () => {
    const mockBrands: Brand[] = [
      { id: 1, name: "Apex", slug: "apex", segment: "Track" },
    ];
    const mockModels: Motorcycle[] = [
      {
        id: 1,
        name: "Apex RS 900",
        slug: "apex-rs-900",
        price_from: 148000,
        engine_cc: 900,
        power_hp: 214,
        summary: "Track",
        is_featured: true,
        is_published: true,
        brand: mockBrands[0],
      },
      {
        id: 2,
        name: "Volt Pulse",
        slug: "volt-pulse",
        price_from: 75000,
        engine_cc: 0,
        power_hp: 100,
        summary: "EV",
        is_featured: false,
        is_published: false,
        brand: { id: 2, name: "Volt", slug: "volt", segment: "Electric" },
      },
    ];

    it("renders motorcycle models and displays Electric for 0 cc", () => {
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      render(
        <ModelsTable data={mockModels} isLoading={false} onEdit={handleEdit} onDelete={handleDelete} />
      );

      expect(screen.getByText("Apex RS 900")).toBeInTheDocument();
      expect(screen.getByText("Volt Pulse")).toBeInTheDocument();
      expect(screen.getByText(/Electric/)).toBeInTheDocument();
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });
  });

  describe("ModelForm component", () => {
    const mockBrands: Brand[] = [
      { id: 1, name: "Apex", slug: "apex", segment: "Track" },
    ];

    it("renders form inputs and handles cancel", () => {
      const handleCancel = vi.fn();
      const handleSubmit = vi.fn();

      render(
        <ModelForm
          brands={mockBrands}
          onSubmit={handleSubmit}
          isPending={false}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByPlaceholderText("e.g. Apex Track 900")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
      expect(handleCancel).toHaveBeenCalled();
    });
  });
});
