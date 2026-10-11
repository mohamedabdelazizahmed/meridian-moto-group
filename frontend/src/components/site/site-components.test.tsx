import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { Hero } from "./Hero";
import { PromotionsSection } from "./PromotionsSection";
import { FeaturedMachines } from "./FeaturedMachines";
import { LocationsSection } from "./LocationsSection";
import { ok, err } from "@/lib/result";

beforeAll(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));

  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  });
});

describe("Site Section Components", () => {
  it("renders Hero section with main heading and CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/PURE DISPLACEMENT/i);
    expect(screen.getByRole("link", { name: /Book Private Test Drive/i })).toBeInTheDocument();
  });

  it("renders PromotionsSection error state when result is not ok", () => {
    render(<PromotionsSection promotionsResult={err("Failed")} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Unable to load active promotions/i);
  });

  it("returns null in PromotionsSection when promotions list is empty", () => {
    const { container } = render(<PromotionsSection promotionsResult={ok([])} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders FeaturedMachines error state when motorcyclesResult is not ok", () => {
    render(<FeaturedMachines brandsResult={ok([])} motorcyclesResult={err("Failed")} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Unable to load motorcycle catalog/i);
  });

  it("renders LocationsSection error state when locationsResult is not ok", () => {
    render(<LocationsSection locationsResult={err("Failed")} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Unable to load regional hubs network/i);
  });
});
