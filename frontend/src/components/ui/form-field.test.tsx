import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Select } from "./select";

describe("FormField Component", () => {
  it("renders label and connects it to the input control", () => {
    render(
      <FormField label="Full Name" htmlFor="name-input">
        <Input id="name-input" placeholder="Enter name" />
      </FormField>
    );

    const label = screen.getByText(/full name/i);
    const input = screen.getByPlaceholderText(/enter name/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "name-input");
  });

  it("indicates required fields with visual asterisk and screen reader text", () => {
    render(
      <FormField label="Email" required>
        <Input placeholder="Enter email" />
      </FormField>
    );

    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("(required)")).toHaveClass("sr-only");
  });

  it("renders helper description text and wires aria-describedby", () => {
    render(
      <FormField label="Password" description="Must be at least 8 characters long.">
        <Input type="password" />
      </FormField>
    );

    const description = screen.getByText(/must be at least 8 characters long/i);
    expect(description).toBeInTheDocument();

    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute("aria-describedby", description.id);
  });

  it("renders validation error message, sets aria-invalid, and wires aria-describedby", () => {
    render(
      <FormField label="Phone" error="Phone number is required.">
        <Input />
      </FormField>
    );

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/phone number is required/i);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
    expect(input.getAttribute("aria-describedby")).toContain(errorMessage.id);
  });

  it("composes successfully with Select component", () => {
    const options = [
      { label: "Apex", value: "apex" },
      { label: "Volt", value: "volt" },
    ];

    render(
      <FormField label="Marque Brand" error="Please select a brand.">
        <Select options={options} placeholder="Select brand" />
      </FormField>
    );

    expect(screen.getByText(/marque brand/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/please select a brand/i);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });
});
