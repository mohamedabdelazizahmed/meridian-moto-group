import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { promotionSchema } from "./schema";
import { toFormData } from "./api";
import { PromotionsTable } from "./components/PromotionsTable";
import type { Promotion } from "@/types/api";

describe("Admin Promotions Feature", () => {
  describe("schema.ts", () => {
    it("validates valid promotion payload successfully", () => {
      const valid = {
        brand_id: 1,
        title: "Spring Track Special",
        description: "10% off all track bikes",
        starts_at: "2026-04-01",
        ends_at: "2026-04-30",
        is_published: true,
      };
      const result = promotionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when ends_at is before starts_at", () => {
      const invalid = {
        brand_id: 1,
        title: "Invalid Dates",
        starts_at: "2026-04-30",
        ends_at: "2026-04-01",
        is_published: true,
      };
      const result = promotionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("api.ts toFormData", () => {
    it("serializes promotion values into FormData correctly", () => {
      const values = {
        brand_id: 2,
        title: "Summer Ride",
        description: "Free gear",
        starts_at: "2026-06-01",
        ends_at: "2026-06-30",
        is_published: true,
      };
      const fd = toFormData(values);
      expect(fd.get("brand_id")).toBe("2");
      expect(fd.get("title")).toBe("Summer Ride");
      expect(fd.get("starts_at")).toBe("2026-06-01");
      expect(fd.get("is_published")).toBe("1");
    });
  });

  describe("PromotionsTable component", () => {
    const mockPromos: Promotion[] = [
      {
        id: 1,
        title: "Ramadan Special",
        description: "Special offer",
        starts_at: "2026-03-01",
        ends_at: "2026-03-30",
        is_published: true,
        brand: { id: 1, name: "Apex", slug: "apex", segment: "Circuit" },
      },
    ];

    it("renders promotions list correctly", () => {
      render(
        <PromotionsTable
          promotions={mockPromos}
          isLoading={false}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );
      expect(screen.getByText("Ramadan Special")).toBeDefined();
      expect(screen.getByText("Apex")).toBeDefined();
    });
  });
});
