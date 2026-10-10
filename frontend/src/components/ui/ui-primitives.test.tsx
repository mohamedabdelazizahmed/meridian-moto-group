import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";

describe("Atomic UI Primitives", () => {
  describe("Button", () => {
    it("renders correctly with default props", () => {
      render(<Button>Click Me</Button>);
      const btn = screen.getByRole("button", { name: /click me/i });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute("type", "button");
    });

    it("handles click events", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click</Button>);

      await user.click(screen.getByRole("button", { name: /click/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("displays loading spinner and disables interaction when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      const btn = screen.getByRole("button", { name: /loading/i });
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("aria-busy", "true");
    });

    it("supports various variants", () => {
      const { rerender } = render(<Button variant="apex">Apex</Button>);
      expect(screen.getByRole("button", { name: /apex/i })).toHaveClass("bg-moto-apex");

      rerender(<Button variant="volt">Volt</Button>);
      expect(screen.getByRole("button", { name: /volt/i })).toHaveClass("bg-moto-volt");
    });
  });

  describe("Input", () => {
    it("renders correctly and accepts value changes", async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Enter name" />);
      const input = screen.getByPlaceholderText(/enter name/i);
      expect(input).toBeInTheDocument();

      await user.type(input, "Test Value");
      expect(input).toHaveValue("Test Value");
    });

    it("applies error styling when error prop is true", () => {
      render(<Input data-testid="error-input" error />);
      expect(screen.getByTestId("error-input")).toHaveClass("border-moto-apex");
    });

    it("supports left and right icons", () => {
      render(<Input leftIcon={<span data-testid="left-icon">L</span>} rightIcon={<span data-testid="right-icon">R</span>} />);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });
  });

  describe("Select", () => {
    const options = [
      { label: "Apex", value: "apex" },
      { label: "Volt", value: "volt" },
    ];

    it("renders placeholder and options correctly", () => {
      render(<Select options={options} placeholder="Choose brand" />);
      expect(screen.getByText(/choose brand/i)).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /apex/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /volt/i })).toBeInTheDocument();
    });

    it("applies error styling when error is true", () => {
      render(<Select data-testid="error-select" options={options} error />);
      expect(screen.getByTestId("error-select")).toHaveClass("border-moto-apex");
    });
  });

  describe("Badge", () => {
    it("renders variant styles correctly", () => {
      render(<Badge variant="success">Published</Badge>);
      const badge = screen.getByText(/published/i);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("bg-moto-volt/20");
    });

    it("renders with leading icon", () => {
      render(<Badge icon={<span data-testid="badge-icon">★</span>}>Featured</Badge>);
      expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
      expect(screen.getByText(/featured/i)).toBeInTheDocument();
    });
  });

  describe("Skeleton", () => {
    it("renders with aria-hidden=true for accessibility", () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
      expect(skeleton).toHaveClass("animate-pulse");
    });

    it("supports different variants", () => {
      const { rerender } = render(<Skeleton data-testid="skel" variant="circular" />);
      expect(screen.getByTestId("skel")).toHaveClass("rounded-full");

      rerender(<Skeleton data-testid="skel" variant="rectangular" />);
      expect(screen.getByTestId("skel")).toHaveClass("rounded-md");
    });
  });
});
